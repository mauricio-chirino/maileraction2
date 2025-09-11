import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

// Import and register all your controllers from the importmap under controllers/*

import NavbarController from "./navbar_controller"
application.register("navbar", NavbarController)

export { application }
