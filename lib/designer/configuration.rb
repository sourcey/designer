module Designer
  # @return [ActiveSupport::HashWithIndifferentAccess] Designer's current configuration
  def self.configuration
    @configuration ||= YAML.load_file(Rails.root.join('config/designer.yml')).with_indifferent_access
  end
end
