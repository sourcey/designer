module PageDesigner::PageDesignerHelper

  def page_designer_embed element_id
    element = page_designer_resource.metadata.find{|x| x['id'] == element_id }
    return "Cannot find element `#{element_id}`" unless element

    page_designer_render element
  end

  def page_designer_render element
    element = element.symbolize_keys
    template_path = page_designer_option(:metadata_template_path)
    if lookup_context.exists?(element[:template], page_designer_option(:metadata_template_path), true)
      render "#{template_path}/#{element[:template]}", page_designer_element_options(element)
    elsif lookup_context.exists?(element[:template], 'page_designer/metadata', true)
      render "page_designer/metadata/#{element[:template]}", page_designer_element_options(element)
    else
      raise "Missing page_designer template `#{element[:template]}`"
    end
  end

  def page_designer_render_resource resource
    return unless resource&.metadata
    page_designer_set_resource resource
    resource.metadata.each_with_object('') do |element, html|
      next if element['hidden'] || element[:hidden]
      result = page_designer_render element
      html << result if result
    end.html_safe
  end

  def page_designer_element_options element
    element.symbolize_keys!
    options = {}
    options.merge!(element[:values]) if element[:values]
    options.symbolize_keys
  end

  def page_designer_attachment image_key
    ActiveStorage::Attachment.joins(:blob).where(active_storage_blobs: {key: image_key}).first
  end

  # Render input text embeds and ERB
  def page_designer_content text, context={}
    return if text.blank?
    ApplicationController.render inline: text,
        assigns: { _resource: page_designer_resource }.merge(context)
  end

  # Render input text as markdown
  def page_designer_markdown text, options = {}
    return if text.blank?
    Kramdown::Document.new(text, {
      syntax_highlighter_opts: {
        line_numbers: nil
      }
    }.merge(options)).to_html
  end

  def page_designer_preview_url
    return page_designer_option(:preview_url) if page_designer_option?(:preview_url)
    path = page_designer_option(:preview_url_template) || ':resource_name/:id'
    page_designer_interpolate_path path
  end

  # Interpolate paths with `:param` system using request params or resource
  # instance variables
  def page_designer_interpolate_path path
    path.gsub(/:([a-z]+)/) do |x|
      param = Regexp.last_match[1]
      if params[param]
        params[param]
      else
        page_designer_resource.send(param)
      end
    end

    # path_parts = path.split('/')
    # path_parts.map! do |part|
    #   if part[0] == ':'
    #     param = part[1..-1]
    #     if params[param]
    #       params[param]
    #     else
    #       page_designer_resource.send(param)
    #     end
    #   else
    #     part
    #   end
    # end
    # path_parts.join('/')
  end

  def page_designer_option? key
    PageDesigner.configuration[page_designer_resource_name].has_key? key
  end

  def page_designer_option key
    PageDesigner.configuration[page_designer_resource_name][key]
  rescue
    raise "Mismatch page_designer option `#{key}` for `#{page_designer_resource_name}`"
  end

  def page_designer_resource_name
    page_designer_resource&.model_name&.route_key || params[:resource_name]
  end

  def page_designer_set_resource resource
    @_resource = resource
  end

  def page_designer_resource
    @_resource || @resource
  end

  def page_designer_context resource = nil
    page_designer_set_resource(resource) if resource
    @page_designer_context ||= {
      resource_id: resource.id,
      resource_type: resource.class.name,
      resource: resource,
      metadata: resource.metadata,
      # spec: page_designer_option(:spec),
      resource_path: page_designer.editor_path(id: resource.id, resource_name: page_designer_resource_name),
      preview_url: page_designer_preview_url,
      attachment_upload_path: page_designer.attachments_path(id: resource.id, resource_name: page_designer_resource_name),
      attachment_direct_upload_url: main_app.rails_direct_uploads_url(record_id: resource.id, record_type: resource.class.name),
      attachment_delete_path_template: page_designer.attachment_path(":key", id: resource.id, resource_name: page_designer_resource_name),
      attachment_thumbnail_path_template: page_designer.attachment_thumbnail_path(":key", id: resource.id, resource_name: page_designer_resource_name),
      attachment_cdn_url_template: main_app.rails_service_blob_url(":signed_id", ":filename"),
      # blob_url_template: main_app.rails_service_blob_url(":signed_id", ":filename"),
    }.merge(PageDesigner.configuration[page_designer_resource_name])
    # raise @page_designer_context.inspect
  end
end
