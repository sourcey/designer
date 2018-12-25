require_dependency "designer/application_controller"

module Designer
  class EditorController < ApplicationController
    before_action :set_resource
    # before_action :authenticate_admin! # FIXME
    skip_before_action :verify_authenticity_token

    # layout 'designer'

    def show
      # raise Designer.configuration.inspect
      # raise @resource.elements.inspect
    end

    def update
      if @resource.update(resource_params.merge(elements: resource_elements))
        render_success
      else
        render_error
      end
    end

    # def preview
    #   raise 'virtual'
    # end

    protected

    # def generate_content
    # end

    def resource_name
      params[:resource_name]
    end

    def resource_type
      params[:resource_name].classify
    end

    helper_method :resource_name, :resource_type

    def set_resource
      # @resource = params[:resource_name].constantize.find(resource_id)
      if /\A\d+\z/.match(resource_id)
        @resource = resource_type.constantize.find(resource_id)
      else
        @resource = resource_type.constantize.find_by_slug!(resource_id)
      end
    end

    def resource_params
      params.require(:resource).permit!
    end

    def resource_id
      params[:newsletter_id] || params[:article_id] || params[:article_slug] || params[:id]
    end

    def resource_elements
      # BUG: The front end stringifies the elements JSON, but this is getting
      # auto-parsed by Rails only in production, so check if it's a string first.
      @resource_elements ||= params[:resource][:elements]&.is_a?(String) ?
        JSON.parse(params[:resource][:elements]) : params[:resource][:elements]
    end

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
