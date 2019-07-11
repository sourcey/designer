# frozen_string_literal: true

module Designer
  module Attribute
    extend ActiveSupport::Concern

    class_methods do
      def acts_as_designer(options = {})
        serialize :metadata, Array

        has_many_attached :attachments

        # after_save :enqueue_attachment_cleanup
      end
    end

    def find_element id
      metadata.each do |item|
        return item if item['id'] == id
        # next unless item['elements']
        # item['elements'].each do |element|
        #   return element if element['id'] == id
        # end
      end
      nil
    end

    # def find_page id
    #   find_item id
    # end
    #
    # def find_element id
    #   find_item id
    # end

    # Custom configuration
    # Implement this to extend the static YML config with dynamic options
    def custom_designer_config
      { }
    end

    def designer_config
      return @designer_config if @designer_config
      @designer_config = Designer.configuration[model_name.route_key].dup
      @designer_config['spec'] ||= {}
      @designer_config['spec'].reverse_merge!(Designer.default_spec)
      @designer_config.deep_merge!(custom_designer_config)
      @designer_config
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
    #   @designer_config.deep_merge!(custom_designer_config)
    #
    #   @designer_config
    #   # ||= Designer.configuration[model_name.route_key].merge(custom_designer_config)
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
      # FIXME: AttachmentCleanupJob is undefined?
      require_dependency Designer::Engine.root.join('app', 'jobs', 'designer', 'attachemnt_cleanup_job').to_s

      if Rails.env.production?
        Designer::AttachmentCleanupJob.perform_later(self)
      else
        Designer::AttachmentCleanupJob.perform_now(self)
      end
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
