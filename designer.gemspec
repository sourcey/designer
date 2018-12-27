$:.push File.expand_path("lib", __dir__)

# Maintain your gem's version:
require "designer/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name     = "designer"
  s.version  = Designer::VERSION
  s.authors  = ["Kam Low"]
  s.email    = ["hello@sourcey.com"]
  s.summary  = "Design rich text markdown pages in Rails applications"
  s.homepage = "https://github.com/sourcey/designer"
  s.license  = "MIT"

  s.required_ruby_version = ">= 2.5.0"

  s.add_dependency "rails", ">= 5.2.0"
  s.add_dependency "nokogiri"
  s.add_dependency "kramdown"

  s.add_development_dependency "bundler", "~> 1.15"
  # s.add_development_dependency "mini_magick"
  # s.add_development_dependency "sqlite3"
  s.add_development_dependency "webpacker", "~> 3.2.2"

  s.files      = `git ls-files`.split("\n")
  s.test_files = `git ls-files -- test/*`.split("\n")
end
