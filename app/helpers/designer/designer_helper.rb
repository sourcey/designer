module Designer::DesignerHelper
  def designer_preview_path
    # preview_designer_path
    # raise  Designer.configuration[resource_name][:preview_path].inspect
    url_parts = Designer.configuration[resource_name][:preview_path].split('/')
    url_parts.each do |part|
      part = params[part] if part[0] == ':'
    end
    url_parts.join('/')
    # if param[0]
    # str
    # hash.keys.each {|key| hash[key]='new value'}
# _with_object('')
    # (id: @resource.id, resource_name: resource_name)
  end

  def designer_embed element_id
    # NOTE: internal calls to designer_embed only pass the id, so the instance
    # variable needs to be set externally
    elements ||= @_designer[:elements]
    template_path ||= @_designer[:template_path]

    element = elements.find{|x| x['id'] == element_id }
    return "Cannot find element #{element_id}" unless element

    designer_render element, template_path: template_path
  end

  def designer_render element, template_path: nil
    element.symbolize_keys!
    render "#{template_path}/#{element[:template]}", designer_element_options(element)
  end

  def designer_element_options element
    element.symbolize_keys!
    options = {}
    options.merge!(element[:values]) if element[:values]
    options.symbolize_keys
  end
end
