# Pin npm packages by running ./bin/importmap

pin "application"

pin "popper", to: 'popper.js', preload: true
pin "bootstrap", to: 'bootstrap.min.js', preload: true
pin "lunr", preload: false # @2.3.9
pin "@hotwired/stimulus", to: "@hotwired--stimulus.js" # @3.2.2

pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript", preload: false
