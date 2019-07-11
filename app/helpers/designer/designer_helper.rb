module Designer::DesignerHelper

  def designer_embed element_id
    element = designer_resource.metadata.find{|x| x['id'] == element_id }
    return "Cannot find element `#{element_id}`" unless element

    designer_render element
  end

  def designer_render element
    element = element.symbolize_keys
    template_path = designer_option(:element_views_path)

    if lookup_context.exists?(element[:name], designer_option(:element_views_path), true)
      render "#{template_path}/#{element[:name]}", designer_element_options(element)
    elsif lookup_context.exists?(element[:name], 'designer/elements', true)
      render "designer/elements/#{element[:name]}", designer_element_options(element)
    else
      raise "Missing designer template `#{element[:name]}`"
    end
  end

  def designer_render_resource resource
    return unless resource&.metadata
    designer_set_resource resource
    resource.metadata.each_with_object('') do |element, html|
      next if element['hidden'] || element[:hidden]
      result = designer_render element
      html << result if result
    end.html_safe
  end

  def designer_element_options element
    element.symbolize_keys!
    options = {}
    options.merge!(element[:data]) if element[:data]
    options.symbolize_keys
  end

  def designer_attachment image_key
    ActiveStorage::Attachment.joins(:blob).where(active_storage_blobs: {key: image_key}).first
  end

  # Render input text embeds and ERB
  def designer_content text, context={}
    return if text.blank?
    ApplicationController.render inline: text,
        assigns: { _resource: designer_resource }.merge(context)
  end

  # Render input text as markdown
  def designer_markdown text, options = {}
    return if text.blank?
    Kramdown::Document.new(text, {
      syntax_highlighter_opts: {
        line_numbers: nil
      }
    }.merge(options)).to_html
  end

  def designer_option? key
    designer_resource.designer_config.has_key? key
  end

  def designer_option key
    designer_resource.designer_config[key]
  rescue
    raise "Mismatch designer option `#{key}` for `#{designer_resource_name}`"
  end

  def designer_resource_name
    designer_resource&.model_name&.route_key || params[:resource_name]
  end

  def designer_set_resource resource
    @_resource = resource
  end

  def designer_resource
    @_resource || @resource
  end

  def designer_context_paths resource = nil
    designer_set_resource(resource) if resource
    resource ||= designer_resource

    # raise designer.thumbnail_attachment_path(":key").inspect
    @designer_context_paths ||= {
      resource_path: designer.editor_path(id: resource.id, resource_name: designer_resource_name),
      preview_url: designer_preview_url,
      attachment_upload_path_template: designer.attachments_path(name: ":name"),
      attachment_direct_upload_url: designer.direct_uploads_attachments_path,
      attachment_delete_path_template: designer.attachment_path(":key"),
      attachment_thumbnail_path_template: designer.thumbnail_attachment_path(":key"),
      attachment_cdn_url_template: main_app.rails_service_blob_url(":signed_id", ":filename"),
      # resource_url_params: {
      #   resource_id: resource.id,
      #   resource_name: designer_resource_name
      # }
      #(record_id: resource.id, record_type: resource.class.name),
      # attachment_direct_upload_url: main_app.rails_direct_uploads_path(record_id: resource.id, record_type: resource.class.name),
      # blob_url_template: main_app.rails_service_blob_url(":signed_id", ":filename"),
    }
  end

  def designer_context resource = nil
    designer_set_resource(resource) if resource
    resource ||= designer_resource

    @designer_context ||= {
      resource_id: resource.id,
      resource_type: resource.class.name,
      resource_name: designer_resource_name,
      resource: resource.as_designer_json,
      metadata: resource.metadata,
    }
    .merge(designer_context_paths(resource))
    .merge(resource.designer_config)
    .transform_keys{ |key| key.to_s.camelize(:lower) }
  end
end
