# say "Copying designer.scss to app/assets/stylesheets"
# copy_file Engine.root.join('app/assets/stylesheets/designer.scss'), "app/assets/stylesheets/designer.scss"
# copy_file "#{__dir__}/designer.scss", "app/assets/stylesheets/designer.scss"

say "Copying designer.js to app/javascript/packs"
copy_file Engine.root.join('app/javascript/packs/designer.js'), "app/javascript/packs/designer.js"
# copy_file "#{__dir__}/designer.js", "app/javascript/packs/designer.js"

# FIXME: Replace with release version on release
say "Installing JavaScript dependency"
run "yarn add https://github.com/sourcey/designer"
