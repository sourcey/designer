module Designer
  # @return [Designer::Configuration] Designer's current configuration
  def self.configuration
    @configuration ||= YAML.load_file(Rails.root.join('config/designer.yml')).with_indifferent_access
    # deep_symbolize_keys
    # [Rails.env]
    # Rails.application.config_for(:designer)
  end
end
