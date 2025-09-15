import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["collapse", "toggler"]
  
  connect() {
    console.log('Navbar controller connected')
    this.setupEventListeners()
  }

  disconnect() {
    this.removeEventListeners()
  }

  setupEventListeners() {
    // Close menu when clicking outside
    this.outsideClickHandler = this.handleOutsideClick.bind(this)
    document.addEventListener('click', this.outsideClickHandler)

    // Close menu when pressing Escape key
    this.escapeKeyHandler = this.handleEscapeKey.bind(this)
    document.addEventListener('keydown', this.escapeKeyHandler)

    // Close menu when window loses focus
    this.blurHandler = this.handleWindowBlur.bind(this)
    window.addEventListener('blur', this.blurHandler)

    // Close menu when scrolling
    this.scrollHandler = this.handleScroll.bind(this)
    window.addEventListener('scroll', this.scrollHandler)
  }

  removeEventListeners() {
    document.removeEventListener('click', this.outsideClickHandler)
    document.removeEventListener('keydown', this.escapeKeyHandler)
    window.removeEventListener('blur', this.blurHandler)
    window.removeEventListener('scroll', this.scrollHandler)
  }

  handleOutsideClick(event) {
    if (!this.hasCollapseTarget) return

    // Check if click is inside the navbar element
    const isClickInsideNavbar = this.element.contains(event.target)
    
    console.log('Outside click detected:', {
      isClickInsideNavbar,
      isMenuOpen: this.isMenuOpen(),
      target: event.target
    })
    
    if (!isClickInsideNavbar && this.isMenuOpen()) {
      console.log('Closing menu due to outside click')
      this.closeMenu()
    }
  }

  handleEscapeKey(event) {
    if (event.key === 'Escape' && this.isMenuOpen()) {
      this.closeMenu()
    }
  }

  handleWindowBlur() {
    if (this.isMenuOpen()) {
      this.closeMenu()
    }
  }

  handleScroll() {
    // Add scrolled class to navbar
    if (window.scrollY > 100) {
      this.element.classList.add('scrolled')
    } else {
      this.element.classList.remove('scrolled')
    }
  }

  isMenuOpen() {
    return this.hasCollapseTarget && this.collapseTarget.classList.contains('show')
  }

  closeMenu() {
    if (!this.hasCollapseTarget) return

    // Use Bootstrap's collapse method
    const bsCollapse = bootstrap.Collapse.getInstance(this.collapseTarget) || 
                      new bootstrap.Collapse(this.collapseTarget, { toggle: false })
    bsCollapse.hide()
  }

  // Method to handle smooth scrolling for nav links
  handleNavClick(event) {
    event.preventDefault()
    const targetId = event.target.getAttribute('href')
    const targetSection = document.querySelector(targetId)
    
    if (targetSection) {
      const navbarHeight = this.element.offsetHeight
      const targetPosition = targetSection.offsetTop - navbarHeight
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
      
      // Close menu after navigation
      this.closeMenu()
    }
  }
}
