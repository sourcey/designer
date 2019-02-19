# frozen_string_literal: true

module PageDesigner
  module Attribute
    extend ActiveSupport::Concern

    class_methods do
      def acts_as_page_designer(options = {})
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

    def reset_default_data!
      DefaultMetadataBuilder.new(self, overwrite: true).perform
    end
  end
end
