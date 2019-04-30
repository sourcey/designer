module Designer
  class DefaultMetadataBuilder
    def initialize(resource, overwrite: false)
      @resource = resource
      @overwrite = overwrite
    end

    def perform
      return if default_items.blank?
      return if @resource.metadata.present? && !@overwrite

      default_items.each do |key, data|
        @resource.send(key + '=',
          key == 'metadata' ? process_metadata(data) : data)
      end
      # raise @resource.styles.inspect
    end

    def process_metadata(data)
      data.each do |item|
        # if item['page']
        #   build_page(item)
        #   item['elements'].each do |element|
        #     build_element(element)
        #   end
        # else
          build_element(item)
        # end
      end
    end

    # def build_page page = {}
    #   name = page['page']
    #   spec = config['spec']['pages'][name]
    #   data = (spec['data'] || {}).merge(page['data'] || {})
    #   page.merge!({
    #     id: item_id(name),
    #     name: name,
    #     data: data,
    #     elements: spec['elements'] || []
    #   })
    # end

    def build_element element = {}
      name = element['name']
      spec = config['spec']['elements'][name]
      # puts "name #{name}"
      # puts "spec['data'] #{spec['data']}"
      # puts "element['data'] #{element['data']}"
      data = (spec['data'] || {}).merge(element['data'] || {})
      element.merge!({
        id: item_id(name),
        name: name,
        data: data
      })
    end

    def config
      @resource.designer_config
    end

    def default_items
      @default_items ||= config['defaults'] || []
    end

    def item_id name
      name + '-' + SecureRandom.urlsafe_base64(5)
    end
  end
end
