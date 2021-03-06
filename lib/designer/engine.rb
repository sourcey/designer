# frozen_string_literal: true

require "rails/engine"

require "designer/configuration"
require "designer/attribute"

module Designer
  class Engine < Rails::Engine
    isolate_namespace Designer
    config.eager_load_namespaces << Designer

    Webpacker::Compiler.watched_paths << Engine.root.join('app', 'javascript', 'designer', '*')
    Webpacker::Compiler.watched_paths << Engine.root.join('app', 'javascript', 'designer', 'components', '*')

    initializer "designer.acts_as_designer" do
      ActiveSupport.on_load(:active_record) do
        include Designer::Attribute
      end
    end

    initializer "designer.assets.precompile" do |app|
      app.config.assets.precompile += %w( designer.css )
    end

    initializer "designer.helper" do
      ActiveSupport.on_load(:action_controller_base) do
        helper Designer::Engine.helpers
      end
      config.to_prepare do
       ::ApplicationController.helper(Designer::DesignerHelper)
      end
    end
  end
end
