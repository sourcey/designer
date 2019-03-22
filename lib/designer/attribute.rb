# frozen_string_literal: true

module Designer
  module Attribute
    extend ActiveSupport::Concern

    class_methods do
      def acts_as_designer(options = {})
        serialize :metadata, Array

        has_many_attached :attachments
      end
    end

    def find_item id
      metadata.each do |item|
        return item if item['id'] == id
        next unless item['blocks']
        item['blocks'].each do |block|
          return block if block['id'] == id
        end
      end
      nil
    end

    def find_page id
      find_item id
    end

    def find_block id
      find_item id
    end

    # Custom configuration
    # Implement this to extend the static YML config with dynamic options
    def custom_designer_config
      { }
    end

    def designer_config
      @designer_config ||= Designer.configuration[model_name.route_key].merge(custom_designer_config)
    end

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

    def enqueue_attachment_cleanup
      Designer::AttachmentCleanupJob.perform_now(self)
    end

    def as_designer_json(options = {})
      as_json(options)
      # as_json({
      #   only: [:id, :metadata, :created_at],
      #   include: {
      #     attachments: {
      #       methods: [:key, :signed_id, :filename, :byte_size, :name, :metadata]
      #     }}}.merge(options))
    end
  end
end
