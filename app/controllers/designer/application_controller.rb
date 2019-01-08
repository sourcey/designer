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

    def set_resource
      @resource = resource_type.constantize.find(params[:id])
    end

    def resource_params
      if params[:resource] &&
        params[:resource][:elements].present? &&
        params[:resource][:elements].is_a?(String)
        params[:resource][:elements] = JSON.parse(params[:resource][:elements])
      end
      params.require(:resource).permit!
    end

    def set_host_for_local_storage
      ActiveStorage::Current.host = request.base_url if Rails.application.config.active_storage.service == :local
    end
  end
end
