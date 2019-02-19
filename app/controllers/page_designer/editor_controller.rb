require_dependency "page_designer/application_controller"
require_dependency "page_designer/attachemnt_cleanup_job"


module PageDesigner
  class EditorController < ApplicationController
    before_action :set_resource
    before_action :reset_default_data
    # skip_before_action :verify_authenticity_token

    def show
    end

    def update
      if @resource.update(resource_params)
        enqueue_attachment_cleanup
        render_success
      else
        render_error
      end
    end

    protected

    def render_success message = nil
      if request.xhr?
        flash.now[:notice] = message || "#{resource_title} saved"
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

    def reset_default_data
      @resource.reset_default_data! if Rails.env.development? && params[:reset_data]
    end

    def enqueue_attachment_cleanup
      PageDesigner::AttachmentCleanupJob.perform_now(@resource)
    end
  end
end
