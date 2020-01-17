module Designer
  class DataBuilder
    include Rails.application.routes.mounted_helpers

    def initialize(resource)
      @resource = resource
      @resource_name = resource.model_name.route_key
    end

    def perform
      { resource_id: @resource.id,
        resource_type: @resource.class.name,
        resource_name: @resource_name,
        resource: @resource.as_designer_json }
          .merge(endpoints)
          .merge(@resource.designer_config)
    end

    def endpoints
      # Yes, we are doing this. Why is `default_url_options` always a pain in the ass. Bleh
      designer.routes.default_url_options = Rails.application.routes.default_url_options

      @endpoints ||= {
        resource_url: designer.editor_url(id: @resource.id, resource_name: @resource_name),
        preview_url: designer_preview_url,
        attachments_url: designer.attachments_url,
        attachment_upload_url_template: designer.attachments_url(name: ":name"),
        attachment_direct_upload_url: designer.direct_uploads_attachments_url,
        attachment_delete_url_template: designer.attachment_url(":key"),
        attachment_thumbnail_url_template: designer.thumbnail_attachment_url(":key"),
        attachment_cdn_url_template: main_app.rails_service_blob_url(":signed_id", ":filename"),
        # attachment_direct_upload_url: main_app.rails_direct_uploads_path(record_id: resource.id, record_type: resource.class.name),
        # blob_url_template: main_app.rails_service_blob_url(":signed_id", ":filename"),
      }
    end

    def designer_preview_url
      return designer_option(:preview_url) if designer_option?(:preview_url)
      path = designer_option(:preview_url_template) || ':resource_name/:id'
      designer_interpolate_path path
    end

    # Interpolate paths with `:param` system using request params or resource
    # instance variables
    def designer_interpolate_path path
      path.gsub(/:([a-z]+)/) do |x|
        param = Regexp.last_match[1]
        # if params[param] && param != 'subdomain'
        #   params[param]
        # else
          # raise @resource.send(param)
          @resource.send(param)
        # end
      end
    end

    def designer_option? key
      @resource.designer_config.has_key? key
    end

    def designer_option key
      @resource.designer_config[key]
    rescue
      raise "Mismatch designer option `#{key}` for `#{@resource_name}`"
    end
  end
end
