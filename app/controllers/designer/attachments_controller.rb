require_dependency "designer/application_controller"

module Designer
  class AttachmentsController < ApplicationController
    before_action :set_resource
    before_action :set_attachment, only: [:thumbnail, :destroy]
    # skip_before_action :verify_authenticity_token

    def index
      render json: all_attachments #designer_images_json
    end

    def create
      instance = @resource.send(params[:name] || 'attachments')
      # attachments = instance.attach(params[:file])
      # attachment = attachments.present? ? attachments.first : instance
      # @resource.attachments.destroy_all
      if instance.attach(params[:file])
        attachment = instance if instance.is_a?(ActiveStorage::Attached::One)
        attachment = instance.last if instance.is_a?(ActiveStorage::Attached::Many)
        # attachment = instance.@resource.attachments.last
        attachment.blob.update!(metadata:
          attachment.metadata.merge(params[:metadata].permit!)) if params[:metadata]
        render json: attachment.blob #designer_image_json(attachment)
      else
        head :bad_request
      end
    end

    def direct_uploads
      blob = ActiveStorage::Blob.create_before_direct_upload!(direct_upload_blob_args)
      render json: direct_upload_json(blob)
    end

    def thumbnail
      # redirect_to Image::UrlResolver.new(@attachment, {size: :icon_square}).perform
      redirect_to @attachment.variant(resize: '200x').processed.service_url
    end

    def destroy
      @attachment.purge_later
    end

    private

    def set_attachment
      @attachment = ActiveStorage::Attachment.where(record: @resource).joins(:blob)
                                             .where(active_storage_blobs: {key: params[:attachment_key] || params[:key]}).first
    end

    def all_attachments
      @attachments ||= ActiveStorage::Attachment.where(record: @resource).joins(:blob)
    end

    def direct_upload_blob_args
      params.require(:blob).permit(:filename, :byte_size, :checksum, :content_type, :metadata).to_h.symbolize_keys
    end

    def direct_upload_json(blob)
      blob.as_json(root: false, methods: :signed_id).merge(direct_upload: {
        url: blob.service_url_for_direct_upload,
        headers: blob.service_headers_for_direct_upload
      })
    end

    # def metadata_params
    #   params.permit(metadata: {})
    # end

    # def designer_images_json
    #   all_attachments.map do |attachment|
    #     designer_image_json attachment
    #   end
    # end
    #
    # def designer_image_json attachment
    #   {
    #     key: attachment.key,
    #     signed_id: attachment.signed_id,
    #     filename: attachment.filename,
    #     byte_size: attachment.byte_size,
    #     name: attachment.name,
    #     url: attachment.service_url,
    #     metadata: attachment.metadata
    #     # sources: {
    #     #   'Image Key' => attachment.key,
    #     #   'Signed ID' => attachment.signed_id,
    #     #   'Small: 256x' => Image::UrlResolver.new(attachment, {size: :small}).perform,
    #     #   'Small Square: 256x256' => Image::UrlResolver.new(attachment, {size: :small_square}).perform,
    #     #   'Thumb: 512x' => Image::UrlResolver.new(attachment, {size: :thumb}).perform,
    #     #   'Thumb Square: 512x512' => Image::UrlResolver.new(attachment, {size: :thumb_square}).perform,
    #     #   'Main: 1024x' => Image::UrlResolver.new(attachment, {size: :main}).perform,
    #     #   'Cover: 1600x' => Image::UrlResolver.new(attachment, {size: :cover}).perform,
    #     #   'Newsletter: 600x600' => Image::UrlResolver.new(attachment, {size: {width: 600, height: 600, crop: 'fill'}}).perform,
    #     #   'Newsletter: 600x300' => Image::UrlResolver.new(attachment, {size: {width: 600, height: 300, crop: 'fill'}}).perform,
    #     #   'Newsletter: 300x300' => Image::UrlResolver.new(attachment, {size: {width: 300, height: 300, crop: 'fill'}}).perform,
    #     #   'Newsletter: 200x200' => Image::UrlResolver.new(attachment, {size: {width: 200, height: 200, crop: 'fill'}}).perform
    #     # }
    #   }
    # end
  end
end
