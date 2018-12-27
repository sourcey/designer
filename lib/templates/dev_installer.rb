# Symlink designer javascripts so we can use the parent application
# webpacker for easy development
say "Symlink designer.js to app/javascript/packs"
designer_js = File.join(__dir__, "../..", "app", "javascript", "packs", "designer.js")
run "ln -s #{designer_js} app/javascript/packs/designer.js"

designer_dir = File.join(__dir__, "../..", "app", "javascript", "designer")
say "Symlink /designer directory to app/javascript"
run "ln -s #{designer_dir} app/javascript/designer"

# FIXME: Replace with release version on release
say "Installing JavaScript dependency"
run "yarn add https://github.com/sourcey/designer"
