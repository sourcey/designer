module Designer
  class ApplicationController < ActionController::Base

    private

    helper_method :resource_name, :resource_type

    def resource_name
      params[:resource_name]
    end

    def resource_type
      params[:resource_name].classify
    end

    def set_resource
      @resource = resource_type.constantize.find(params[:id])
      # if /\A\d+\z/.match(resource_id)
      #   @resource = resource_type.constantize.find(resource_id)
      # else
      #   @resource = resource_type.constantize.find_by_slug!(resource_id)
      # end
    end

    def resource_params
      params.require(:resource).permit!
    end
  end
end
