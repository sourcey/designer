module Designer::DesignerHelper

  def designer_embed element_id
    element = designer_resource.elements.find{|x| x['id'] == element_id }
    return "Cannot find element `#{element_id}`" unless element

    designer_render element
  end

  def designer_render element
    element = element.symbolize_keys
    template_path = designer_option(:elements_template_path)
    if lookup_context.exists?(element[:template], designer_option(:elements_template_path), true)
      render "#{template_path}/#{element[:template]}", designer_element_options(element)
    elsif lookup_context.exists?(element[:template], 'designer/elements', true)
      render "designer/elements/#{element[:template]}", designer_element_options(element)
    else
      raise "Missing designer template `#{element[:template]}`"
    end
  end

  def designer_render_resource resource
    return unless resource&.elements
    designer_set_resource resource
    resource.elements.each_with_object('') do |element, html|
      next if element['hidden'] || element[:hidden]
      result = designer_render element
      html << result if result
    end.html_safe
  end

  def designer_element_options element
    element.symbolize_keys!
    options = {}
    options.merge!(element[:values]) if element[:values]
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

  def designer_preview_path
    path = designer_option(:preview_path) || ':resource_name/:id'
    path_parts = path.split('/')
    path_parts.map! do |part|
      if part[0] == ':'
        param = part[1..-1]
        if params[param]
          params[param]
        else
          designer_resource.send(param)
        end
      else
        part
      end
    end
    path_parts.join('/')
  end

  def designer_option key
    Designer.configuration[designer_resource_name][key]
  rescue
    raise "Mismatch designer option `#{val}` for `#{designer_resource_name}`"
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
end
