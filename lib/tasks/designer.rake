# frozen_string_literal: true

namespace :designer do
  desc "Copy over the migration, stylesheet, and JavaScript files"
  task install: %w( environment run_installer ) # copy_migrations

  task :run_installer do
    installer_template = File.expand_path("../templates/installer.rb", __dir__)
    system "#{RbConfig.ruby} ./bin/rails app:template LOCATION=#{installer_template}"
  end

  task :run_dev_installer do
    installer_template = File.expand_path("../templates/dev_installer.rb", __dir__)
    system "#{RbConfig.ruby} ./bin/rails app:template LOCATION=#{installer_template}"
  end

  # task :copy_migrations do
  #   Rake::Task["designer:install:migrations"].invoke
  # end
end
