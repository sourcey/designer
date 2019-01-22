# Symlink page_designer javascripts so we can use the parent application
# webpacker for easy development
say "Symlink page_designer.js to app/javascript/packs"
page_designer_js = File.join(__dir__, "../..", "app", "javascript", "packs", "page_designer.js")
run "ln -s #{page_designer_js} app/javascript/packs/page_designer.js"

page_designer_dir = File.join(__dir__, "../..", "app", "javascript", "page_designer")
say "Symlink /page_designer directory to app/javascript"
run "ln -s #{page_designer_dir} app/javascript/page_designer"

# FIXME: Replace with release version on release
say "Installing JavaScript dependency"
run "yarn add https://github.com/sourcey/page_designer"
