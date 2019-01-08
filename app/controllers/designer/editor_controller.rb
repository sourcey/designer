require_dependency "designer/application_controller"

module Designer
  class EditorController < ApplicationController
    before_action :set_resource
    # skip_before_action :verify_authenticity_token

    def show
    end

    def update
      if @resource.update(resource_params)
        render_success
      else
        render_error
      end
    end

    # def preview
    #   raise 'virtual'
    # end

    protected

    def render_success message = nil
      if request.xhr?
        flash.now[:notice] = message || "#{resource_type.classify} saved"
        render :notifications
      else
        render json: @resource
      end
    end

    def render_error
      if request.xhr?
        flash.now[:error] = @resource.errors.full_messages.join('. ')
        render :notifications, status: :unprocessable_entity
      else
        head :unprocessable_entity
      end
    end
  end
end
