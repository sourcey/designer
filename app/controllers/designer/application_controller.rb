module Designer
  class ApplicationController < ActionController::Base
    before_action :set_host_for_local_storage

    protected

    def set_host_for_local_storage
      ActiveStorage::Current.host = request.base_url if Rails.application.config.active_storage.service == :local
    end

    helper_method :resource_name, :resource_type

    def resource_name
      params[:resource_name]
    end

    def resource_type
      params[:resource_name].classify
    end

    def resource_title
      Designer.configuration[resource_name]['resource_title'] || resource_type.classify
    end

    def set_resource
      @resource = resource_type.constantize.find(params[:id])
    end

    def resource_params
      if params[:resource] &&
        params[:resource][:metadata].present? &&
        params[:resource][:metadata].is_a?(String)
        params[:resource][:metadata] = JSON.parse(params[:resource][:metadata])
      end
      params.require(:resource).permit!
    end

    def render_api_error(error, status: :unprocessable_entity, detail: nil, extra: {})
      detail ||= "Looks like there are some errors that need to be fixed."
      response = {
        code: Rack::Utils::SYMBOL_TO_STATUS_CODE[status],
        detail: detail
      }.merge(extra)
      render json: { error: response }, status: status
    end

    def render_api_model_errors(entity, error: :unprocessable_entity)
      render_api_error(error, status: :unprocessable_entity, extra: { validation_errors: entity.errors.to_h })
    end

    def set_host_for_local_storage
      ActiveStorage::Current.host = request.base_url if Rails.application.config.active_storage.service == :local
    end
  end
end
