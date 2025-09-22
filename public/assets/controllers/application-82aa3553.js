import { Application } from "@hotwired/stimulus"

const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

// Import and register all your controllers from the importmap under controllers/*

import NavbarController from "./navbar_controller"
import LandingController from "./landing_controller"
import RadarController from "./radar_controller"
import EffectsController from "./effects_controller"
import ContactController from "./contact_controller"
import ProspectsModalController from "./prospects_modal_controller"

application.register("navbar", NavbarController)
application.register("landing", LandingController)
application.register("radar", RadarController)
application.register("effects", EffectsController)
application.register("contact", ContactController)
application.register("prospects-modal", ProspectsModalController)

export { application }
