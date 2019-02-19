# frozen_string_literal: true

require "rails/engine"

require "page_designer/configuration"
require "page_designer/attribute"

module PageDesigner
  class Engine < Rails::Engine
    isolate_namespace PageDesigner
    config.eager_load_namespaces << PageDesigner
    config.autoload_paths << Engine.root.join('app', 'jobs', 'page_designer')
    # += %W(#{config.root}/lib/modules)

    Webpacker::Compiler.watched_paths << Engine.root.join('app', 'javascript', 'page_designer', '*')
    Webpacker::Compiler.watched_paths << Engine.root.join('app', 'javascript', 'page_designer', 'components', '*')

    initializer "page_designer.acts_as_page_designer" do
      ActiveSupport.on_load(:active_record) do
        include PageDesigner::Attribute
      end
    end

    initializer "page_designer.assets.precompile" do |app|
      app.config.assets.precompile += %w( page_designer.css page_designer-vendor.css )
    end

    initializer "page_designer.helper" do
      ActiveSupport.on_load(:action_controller_base) do
        helper PageDesigner::Engine.helpers
      end
      config.to_prepare do
       ::ApplicationController.helper(PageDesigner::PageDesignerHelper)
      end
    end
  end
end
