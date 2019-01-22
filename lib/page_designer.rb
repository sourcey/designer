# frozen_string_literal: true

require "active_record"
require "page_designer/engine"

module PageDesigner
  extend ActiveSupport::Autoload

  autoload :Attribute
end
