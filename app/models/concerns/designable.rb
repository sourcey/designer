require 'active_support/concern'

module HasSettings
  extend ActiveSupport::Concern

  included do
    before_save :sanitize_settings, if: :settings_changed?
  end

  # def settings=(value)
  #   super self.class.sanitize_settings(value)
  # end

  # def settings_key(key, default = nil)
  #   return default unless self.settings.include?(key)
  #   self.class.cast_value(self.settings[key])
  # end

  def update_settings_key(key, value)
    # json = self.settings
    # json[key] = self.class.cast_value(value)
    # self.update(settings: json)
    self.settings[key] = self.class.cast_value(value)
    self.save
  end

  # def self.sanitize_settings(value)
  #   value = value.to_h if value.is_a?(ActionController::Parameters)
  #   value = JSON.parse(value) if value.is_a?(String) && value.start_with?('{')
  #   value
  # end

  def normalize_settings #_hash(hash)
    self.settings.each do |key, val|
      self.settings[key] = self.class.cast_value(value)
    end
    # hash.keys.each { |k| hash[k.to_s] = normalize_settings_data(hash.delete(k)) }
    # hash
  end
  #
  # def normalize_settings_data(val)
  #   return false if val.nil? || val == false || (val.is_a?(String) && val.empty? || val =~ (/\A(false|off|no)\Z/i))
  #   return true  if val == true  || (val.is_a?(String) && val =~ (/\A(true|on|yes)\Z/i))
  #   return val.to_i if val =~ /^[0-9]+$/
  #   val
  # end

  def self.cast_value(value)
    return ActiveModel::Type::Boolean.new.cast(value) if %w(true false on off yes no).include?(value)
    return ActiveModel::Type::Integer.new.cast(value) if value.to_s =~ /\A[+-]?\d+\Z/ # from validates_numericality_of
    value
  end
end
