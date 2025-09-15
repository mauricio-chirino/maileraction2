import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button", "card", "text", "icon"]
  static values = { 
    rippleColor: { type: String, default: "rgba(255, 255, 255, 0.3)" },
    animationDuration: { type: Number, default: 600 }
  }

  connect() {
    console.log('Effects controller connected')
    this.setupButtonEffects()
    this.setupCardEffects()
    this.setupTextEffects()
    this.setupIconEffects()
  }

  setupButtonEffects() {
    if (!this.hasButtonTarget) return

    this.buttonTarget.addEventListener('click', this.createRippleEffect.bind(this))
  }

  setupCardEffects() {
    if (!this.hasCardTarget) return

    // Add hover effects to cards
    this.cardTarget.addEventListener('mouseenter', this.cardHoverIn.bind(this))
    this.cardTarget.addEventListener('mouseleave', this.cardHoverOut.bind(this))
  }

  setupTextEffects() {
    if (!this.hasTextTarget) return

    // Add typewriter effect if data-typewriter is present
    if (this.textTarget.dataset.typewriter) {
      this.startTypewriterEffect()
    }
  }

  setupIconEffects() {
    if (!this.hasIconTarget) return

    // Add icon animation on hover
    this.iconTarget.addEventListener('mouseenter', this.iconHoverIn.bind(this))
    this.iconTarget.addEventListener('mouseleave', this.iconHoverOut.bind(this))
  }

  createRippleEffect(event) {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    const ripple = document.createElement('span')
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    ripple.style.backgroundColor = this.rippleColorValue
    ripple.classList.add('ripple-effect')
    
    button.appendChild(ripple)
    
    setTimeout(() => {
      ripple.remove()
    }, this.animationDurationValue)
  }

  cardHoverIn() {
    this.cardTarget.classList.add('hover-effect')
  }

  cardHoverOut() {
    this.cardTarget.classList.remove('hover-effect')
  }

  iconHoverIn() {
    this.iconTarget.classList.add('icon-bounce')
  }

  iconHoverOut() {
    this.iconTarget.classList.remove('icon-bounce')
  }

  startTypewriterEffect() {
    const text = this.textTarget.textContent
    this.textTarget.textContent = ''
    this.textTarget.style.borderRight = '2px solid #6366f1'
    
    let i = 0
    const typewriter = setInterval(() => {
      if (i < text.length) {
        this.textTarget.textContent += text.charAt(i)
        i++
      } else {
        clearInterval(typewriter)
        setTimeout(() => {
          this.textTarget.style.borderRight = 'none'
        }, 1000)
      }
    }, 50)
  }

  // Method to trigger custom animations
  animateIn() {
    this.element.classList.add('animate-in')
  }

  animateOut() {
    this.element.classList.add('animate-out')
  }

  // Method to add floating animation
  startFloating() {
    this.element.classList.add('floating')
  }

  stopFloating() {
    this.element.classList.remove('floating')
  }
}
