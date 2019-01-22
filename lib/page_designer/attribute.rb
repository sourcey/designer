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
  end
end
