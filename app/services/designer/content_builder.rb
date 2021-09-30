module Designer
  class ContentBuilder
    def initialize(page)
      @page = page
      @content = page.content
    end

    def perform
      return [] unless @content.present?
      @content.each do |section|
        section['id'] ||= item_id(section)

        # merge_item_demo_data section
        merge_layout_defaults section, config, 'section_default'#, spec
        process_grid section['items'], config
      end

      # raise @content.inspect
      @content
    end

    # def process_content content
    #
    #   # NOTE: Using `temp` prefix to identify data only contents
    #   # content['id'] ||= item_id(content, 'temp')
    #
    #   # Set the unique content reference if not already set.
    #   # The reference is used to identify the content for navigaton and sorting.
    #   # NOTE: It is use to the client side to handle set the reference for created contents
    #   # content['reference'] ||= content['name'] # item_id(content)
    #   #
    #   # spec = config['spec']['contents'][content['name']]
    #   # merge_item_defaults content, spec
    #
    # end

    def process_grid items, config
      return unless items.present?
      items.each do |item|
        # p item
        if item['type'] == 'element' || !item.has_key?('type')
          # merge_layout_defaults item, config, 'element_default'
          process_element item, config
          # raise item.inspect
        end
        if item['type'] == 'row' && item['columns'].present?
          item['columns'].each do |column|
            process_grid column['items'], config
          end
        end
      end
    end

    def process_element element, config
      element['id'] ||= item_id(element)
      spec = config['spec']['elements'][element['name']]
      merge_item_defaults element, spec
      process_grid element['items'], config
    end

    def merge_layout_defaults item, config, default_layout
      layout = item.dig('data', 'layout')

      # NOTE: Fallback to default layout if the specified one doesnt exist
      layout = default_layout unless config['spec']['layouts'][layout]
      spec = config['spec']['layouts'][layout]
      raise "Unknown layout: #{layout}" if !spec
      item['data'] ||= {}

      # Set the layout incase the default fallback is used
      item['data']['layout'] = layout
      item['data']['label'] ||= item['label']
      merge_item_defaults item, spec
    end

    def merge_item_defaults item, spec
      item['data'] ||= {}
      return unless spec && spec['properties']
      spec['properties'].each do |name, prop|
        if !item['data'].has_key?(name)

          # NOTE: This will set all properties to nil if undefined for reactivity
          item['data'][name] = prop['default'].presence
        end
      end
    end

    def item_id item, name = nil
      name ||= item['name'].parameterize if item['name']
      name ||= item['label'].downcase.parameterize if item['label']
      name + '-' + SecureRandom.urlsafe_base64(5)
    end

    def config
      @page.designer_config
    end
  end
end
