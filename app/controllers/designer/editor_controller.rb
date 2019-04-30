require_dependency "designer/application_controller"
# require_dependency "designer/attachemnt_cleanup_job"


module Designer
  class EditorController < ApplicationController
    before_action :set_resource
    before_action :reset_default_data
    # skip_before_action :verify_authenticity_token

    def show
      # @resource.theme.set_configuration_from_file
      # @resource.theme.save
      # puts @resource.metadata
      # raise @resource.as_designer_json.inspect
    end

    def update
      if @resource.designer_update(resource_params)
        render json: @resource
      else
        render_api_model_errors(@resource, error: :unprocessable_entity)
      end
    end

    protected

    # def render_success message = nil
    #   if request.xhr?
    #     flash.now[:notice] = message || "#{resource_title} saved"
    #     render :notifications
    #   else
    #     render json: @resource
    #   end
    # end
    #
    # def render_error
    #   if request.xhr?
    #     flash.now[:error] = @resource.errors.full_messages.join('. ')
    #     render :notifications, status: :unprocessable_entity
    #   else
    #     head :unprocessable_entity
    #   end
    # end

    def reset_default_data
      @resource.reset_default_data! if Rails.env.development? && params[:reset_data]
    end
  end
end
