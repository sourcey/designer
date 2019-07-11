module Designer
  def self.default_spec
    @default_spec ||= YAML.load_file(Engine.root.join('config/designer/default_spec.yml')).with_indifferent_access
  end

  # @return [ActiveSupport::HashWithIndifferentAccess] Designer's current configuration
  def self.configuration
    @configuration ||= YAML.load_file(Rails.root.join('config/designer.yml')).with_indifferent_access
  end
end
