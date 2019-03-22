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
        if item['page']
          build_page(item)
          item['blocks'].each do |block|
            build_block(block)
          end
        else
          build_block(item)
        end
      end
    end

    def build_page page = {}
      name = page['page']
      spec = config['spec']['pages'][name]
      data = (spec['data'] || {}).merge(page['data'] || {})
      page.merge!({
        id: item_id(name),
        name: name,
        data: data,
        blocks: spec['blocks'] || []
      })
    end

    def build_block block = {}
      name = block['name']
      spec = config['spec']['blocks'][name]
      # puts "name #{name}"
      # puts "spec['data'] #{spec['data']}"
      # puts "block['data'] #{block['data']}"
      data = (spec['data'] || {}).merge(block['data'] || {})
      block.merge!({
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
