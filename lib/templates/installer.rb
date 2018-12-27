say "Copying designer.scss to app/assets/stylesheets"
copy_file "#{__dir__}/designer.scss", "app/assets/stylesheets/designer.scss"

say "Copying designer.js to app/javascript/packs"
copy_file "#{__dir__}/designer.js", "app/javascript/packs/designer.js"

# FIXME: Replace with release version on release
say "Installing JavaScript dependency"
run "yarn add https://github.com/sourcey/designer"

# APPLICATION_PACK_PATH = "app/javascript/packs/application.js"
#
# if File.exists?(APPLICATION_PACK_PATH) && File.read(APPLICATION_PACK_PATH) !~ /import "designer"/
#   say "Adding import to default JavaScript pack"
#   append_to_file APPLICATION_PACK_PATH, <<-EOS
# import "designer"
# EOS
end
