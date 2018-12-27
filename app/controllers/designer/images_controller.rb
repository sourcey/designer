require_dependency "designer/application_controller"

module Designer
  class ImagesController < ApplicationController
    # before_action :authenticate_artist!
    before_action :set_resource
    skip_before_action :verify_authenticity_token

    def index
      render json: designer_images_json
      # { files: designer_images_json } #(@resource)
    end

    def create
      @resource.attachments.attach(params[:file])

      render json: designer_images_json #(@resource)
      # render json: { files: designer_images_json } #(@resource)
    end

    def destroy
      # raise @resource.attachments.to_a.inspect
      # @image = @resource.attachments.to_a.find{|x| x.signed_id == params[:signed_id]}
      # @image.purge_later

      @image = ActiveStorage::Attachment.where(record: @resource).joins(:blob).where(active_storage_blobs: {key: params[:key]}).first
      # .find_signed(params[:signed_id])
      @image.purge_later
      # joins(:blob).where(active_storage_blobs: {signed_id: signed_id}).first
    end

    private

    # def set_resource
    #   # raise 'virtual'
    #   # @resource = Newsletter.find(params[:resource_id])
    #
    #   if /\A\d+\z/.match(resource_id)
    #     @resource = params[:resource_type].constantize.find(resource_id)
    #   else
    #     @resource = params[:resource_type].constantize.find_by_slug!(resource_id)
    #   end
    # end
    #
    # def resource_id
    #   params[:newsletter_id] || params[:article_id] || params[:resource_id] || params[:id]
    # end

    def designer_images_json
      images = @resource.attachments.to_a
      images << @resource.cover if @resource.respond_to?(:cover) && @resource.cover.attached?
      images.map do |attachment|
        designer_image_json attachment
      end
    end

    def designer_image_json attachment
      # raise attachment.inspect
      # include Sourcey::Application.routes.url_helpers

      {
        key: attachment.key,
        # signed_id: attachment.signed_id,
        # name: "#{attachment.name}: #{attachment.filename}",
        name: attachment.filename,
        size: attachment.byte_size,
        kind: attachment.name,
        thumbnail_url: attachment.variant(resize: '100x100').processed.service_url,
        delete_url: image_path(key: attachment.key, id: @resource.id, resource_name: params[:resource_name])
        # url_for(attachment),
        # Image::UrlResolver.new(attachment, {size: :icon_square}).perform,
        # url: url_for(attachment),
        # sources: {
        #   'Image Key' => attachment.key,
        #   'Signed ID' => attachment.signed_id,
        #   'Small: 256x' => Image::UrlResolver.new(attachment, {size: :small}).perform,
        #   'Small Square: 256x256' => Image::UrlResolver.new(attachment, {size: :small_square}).perform,
        #   'Thumb: 512x' => Image::UrlResolver.new(attachment, {size: :thumb}).perform,
        #   'Thumb Square: 512x512' => Image::UrlResolver.new(attachment, {size: :thumb_square}).perform,
        #   'Main: 1024x' => Image::UrlResolver.new(attachment, {size: :main}).perform,
        #   'Cover: 1600x' => Image::UrlResolver.new(attachment, {size: :cover}).perform,
        #   'Newsletter: 600x600' => Image::UrlResolver.new(attachment, {size: {width: 600, height: 600, crop: 'fill'}}).perform,
        #   'Newsletter: 600x300' => Image::UrlResolver.new(attachment, {size: {width: 600, height: 300, crop: 'fill'}}).perform,
        #   'Newsletter: 300x300' => Image::UrlResolver.new(attachment, {size: {width: 300, height: 300, crop: 'fill'}}).perform,
        #   'Newsletter: 200x200' => Image::UrlResolver.new(attachment, {size: {width: 200, height: 200, crop: 'fill'}}).perform
        # }
      }
    end
  end
end
