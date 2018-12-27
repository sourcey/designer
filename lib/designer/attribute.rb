# frozen_string_literal: true

module Designer
  module Attribute
    extend ActiveSupport::Concern

    class_methods do
      def acts_as_designer(options = {})
        serialize :elements, Array

        has_many_attached :attachments
      end
    end
  end
end
