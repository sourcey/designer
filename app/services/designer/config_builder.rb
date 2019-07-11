module Designer
  class ConfigBuilder
    include Rails.application.routes.mounted_helpers

    def initialize(resource)
      @resource = resource
      @resource_name = resource.model_name.route_key
    end

    def perform
      @config = {
        resource_id: @resource.id,
        resource_type: @resource.class.name,
        resource_name: @resource_name,
        resource: @resource.as_designer_json,
        metadata: @resource.metadata,
      }
      .merge(api_paths)
      .merge(@resource.designer_config)


      # @designer_config = Designer.configuration[@resource_name].dup
      # # @config.merge!(Designer.configuration[@resource_name].dup)
      #
      # # Merge the default spec items
      # @designer_config['spec'] ||= {}
      # @designer_config['spec'].reverse_merge!(Designer.default_spec)
      #
      # # Merge in the dynamic custom config if defined
      # @designer_config.deep_merge!(custom_designer_config)

      # NOTE: Need to dup or singleton memory will be overwritten on merge
      # @config = Designer.configuration[@resource_name].dup
      # @config.merge!(Designer.configuration[@resource_name].dup)

      # Merge the default spec items
      # @config['spec'] ||= {}
      # @config['spec'].reverse_merge!(Designer.default_spec)

      # Deep merge the theme manifest overriding default spec items
      # @config.deep_merge!(theme_manifest)

      # .transform_keys{ |key| key.to_s.camelize(:lower) }

      # sort_forms
      # @config
    end

    def api_paths
      # resource = nil
      # designer_set_resource(resource) if resource
      # resource ||= @resource

      # raise designer.thumbnail_attachment_path(":key").inspect
      @api_paths ||= {
        resource_path: designer.editor_path(id: @resource.id, resource_name: @resource_name),
        preview_url: designer_preview_url,
        attachment_upload_path_template: designer.attachments_path(name: ":name"),
        attachment_direct_upload_url: designer.direct_uploads_attachments_path,
        attachment_delete_path_template: designer.attachment_path(":key"),
        attachment_thumbnail_path_template: designer.thumbnail_attachment_path(":key"),
        attachment_cdn_url_template: main_app.rails_service_blob_url(":signed_id", ":filename"),
        # resource_url_params: {
        #   resource_id: resource.id,
        #   resource_name: @resource_name
        # }
        #(record_id: resource.id, record_type: resource.class.name),
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

    # def theme_manifest
    #   # raise @site.theme_install.manifest.inspect
    #   @site.theme_install.manifest
    # end

    # def sort_forms
    #
    #   # Add advanced styles to the end of the hash
    #   styles = @config['spec']['forms']['styles']['sections']
    #   advanced = styles.delete('advanced')
    #   styles['advanced'] = advanced
    #   # raise p.inspect
    #   # # raise @config['spec']['forms']['styles'].sort_by{|k,v| k === 'advanced'}.inspect
    #   # @config['spec']['forms']['styles'] = @config['spec']['forms']['styles'].sort_by{|k,v| k === 'advanced'}
    #   # raise @config['spec']['forms']['styles']['sections'].keys.inspect
    # end
  end
end
