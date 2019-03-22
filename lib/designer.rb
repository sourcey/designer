# frozen_string_literal: true

require "active_record"
require "designer/engine"

module Designer
  extend ActiveSupport::Autoload

  autoload :Attribute
end
