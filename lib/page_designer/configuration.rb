module PageDesigner
  # @return [ActiveSupport::HashWithIndifferentAccess] PageDesigner's current configuration
  def self.configuration
    @configuration ||= YAML.load_file(Rails.root.join('config/page_designer.yml')).with_indifferent_access
  end
end
