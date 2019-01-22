# say "Copying page_designer.scss to app/assets/stylesheets"
# copy_file Engine.root.join('app/assets/stylesheets/page_designer.scss'), "app/assets/stylesheets/page_designer.scss"
# copy_file "#{__dir__}/page_designer.scss", "app/assets/stylesheets/page_designer.scss"

say "Copying page_designer.js to app/javascript/packs"
copy_file Engine.root.join('app/javascript/packs/page_designer.js'), "app/javascript/packs/page_designer.js"
# copy_file "#{__dir__}/page_designer.js", "app/javascript/packs/page_designer.js"

# FIXME: Replace with release version on release
say "Installing JavaScript dependency"
run "yarn add https://github.com/sourcey/page_designer"
