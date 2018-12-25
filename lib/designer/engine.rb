# frozen_string_literal: true

require 'designer/configuration'

require "rails/engine"

module Designer
  class Engine < Rails::Engine
    isolate_namespace Designer
    config.eager_load_namespaces << Designer

    # Engine.routes do
    # # Engine.routes.draw do
    #   resource :designer, controller: :designer, path: :designer do
    #     scope module: :designer do
    #       resources :images, only: [:index, :create, :destroy]
    #     end
    #     # member do
    #     #   get :preview
    #     # end
    #   end
    #
    #   # resources :designer do
    #   #   get :random, :on => :collection
    #   # end
    # end
    # , :only => [:show]

    # initializer "designer.attribute" do
    #   ActiveSupport.on_load(:active_record) do
    #     include Designer::Attribute
    #   end
    # end
    #
    # initializer "designer.active_storage_extension" do
    #   ActiveSupport.on_load(:active_storage_blob) do
    #     include Designer::Attachable
    #
    #     def previewable_attachable?
    #       representable?
    #     end
    #   end
    # end
    
    initializer "designer.helper" do
      ActiveSupport.on_load(:action_controller_base) do
        helper Designer::Engine.helpers
      end
    end

    # initializer "designer.config" do
    #   config.after_initialize do |app|
    #     Designer.renderer ||= ApplicationController.renderer
    #
    #     # FIXME: ApplicationController should have a per-request specific renderer
    #     # that's been set with the request.env env, and Designer should just piggyback off
    #     # that by default rather than doing this work directly.
    #     ApplicationController.before_action do
    #       Designer.renderer = Designer.renderer.new(request.env)
    #     end
    #   end
    # end
  end
end
