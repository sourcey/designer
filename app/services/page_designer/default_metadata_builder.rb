module PageDesigner
  class DefaultMetadataBuilder
    def initialize resource, overwrite: false
      @resource = resource
      @overwrite = overwrite
    end

    def perform
      return if default_items.blank?
      return if @resource.metadata.present? && !@overwrite

      default_items.each do |key, item|
        @resource.send(key + '=', item)
        # raise item.inspect if key == 'styles'
        # raise @resource.styles.inspect if key == 'styles'
      end
      process_metadata
      @resource.save!
    end

    def set_id item
      name = item['name'] || item['page']
      item['id'] = name + '-' + SecureRandom.urlsafe_base64(5)
    end

    def process_metadata
      @resource.metadata.each do |item|
        set_id item
        next unless item['blocks']
        item['blocks'].each do |block|
          set_id block
        end
      end
    end

    def default_items
      @default_items ||= PageDesigner.configuration[@resource.model_name.route_key]['defaults'] || []
      # @default_items ||= PageDesigner.configuration[@resource.model_name.route_key]['spec'].select{ |item| !!item['default'] }
    end
  end
end
