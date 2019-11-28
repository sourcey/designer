# frozen_string_literal: true

module Designer
  module Attribute
    extend ActiveSupport::Concern

    class_methods do
      def acts_as_designer(options = {})
        # serialize :content, Array

        has_many_attached :attachments

        # after_save :enqueue_attachment_cleanup
      end

      def find_element_recursive(items, id)
        return unless items.present?
        result = nil
        items.each do |item|
          if item['id'] == id # item['type'] == 'element' || !item.has_key?('type')
            result = item
          elsif item['type'] == 'row' && item['columns'].present?
            item['columns'].each do |column|
              result = find_element_recursive column['items'], id
              break if result
            end
          elsif item['items'].present?
            result = find_element_recursive item['items'], id
          end
          break if result
        end
        result
      end
    end

    def find_element(id)
      return unless content.present?
      self.class.find_element_recursive content, id
    end

    # def find_element id
    #   content.each do |item|
    #     return item if item['id'] == id
    #     next unless item['items']
    #     item['items'].each do |element|
    #       return element if element['id'] == id
    #     end
    #   end
    #   nil
    # end

    # def find_page id
    #   find_item id
    # end
    #
    # def find_element id
    #   find_item id
    # end

    # Returns the designer config and spec for this class
    def designer_config
      return @designer_config if @designer_config
      @designer_config = Designer.configuration[model_name.route_key].dup
      # @designer_config['spec'] ||= {}
      # @designer_config['spec'].reverse_merge!(Designer.default_spec)
      if @designer_config['enable_default_spec'] != false
        @designer_config['spec'] = Designer.default_spec.dup.deep_merge(@designer_config['spec'])
      end
      @designer_config.deep_merge!(designer_custom_config) if designer_custom_config.present?
      @designer_config
    end

    # Custom configuration options
    # Implement this to override the static YML config with dynamic options,
    # such as custom API endpoints
    def designer_custom_config
    end

    # Returns the full designer data object for this instance
    def designer_data
      Designer::DataBuilder.new(self).perform
    end

    # def designer_config
    #   return @designer_config if @designer_config
    #   @designer_config = Designer.configuration[model_name.route_key].dup
    #   # @config.merge!(Designer.configuration[model_name.route_key].dup)
    #
    #   # Merge the default spec items
    #   @designer_config['spec'] ||= {}
    #   @designer_config['spec'].reverse_merge!(Designer.default_spec)
    #
    #   # Merge in the dynamic custom config if defined
    #   @designer_config.deep_merge!(designer_custom_config)
    #
    #   @designer_config
    #   # ||= Designer.configuration[model_name.route_key].merge(designer_custom_config)
    # end

    # Called by the designer to update the model
    # Override to handle custom update logic
    def designer_update(attributes)
      res = update(attributes)
      enqueue_attachment_cleanup if res
      res
    end

    def set_default_designer_data
      DefaultMetadataBuilder.new(self, overwrite: true).perform
    end

    # Cleans up attachments for elements that may have been deleted.
    # Calls `find_element` internally to check for existence.
    def enqueue_attachment_cleanup
      return if designer_config['enable_attachment_cleanup'] == false

      if Rails.env.production?
        Designer::AttachmentCleanupJob.perform_later(self)
      else
        Designer::AttachmentCleanupJob.perform_now(self)
      end
    end

    def as_designer_json(options = {})
      as_json(options)
      # as_json({
      #   only: [:id, :content, :created_at],
      #   include: {
      #     attachments: {
      #       methods: [:key, :signed_id, :filename, :byte_size, :name, :content]
      #     }}}.merge(options))
    end
  end
end
