import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["hero", "features", "services", "results", "progressBar", "scrollTopBtn"]
  static values = { 
    scrollThreshold: { type: Number, default: 100 },
    animationDelay: { type: Number, default: 100 }
  }

  connect() {
    console.log('Landing controller connected')
    this.setupScrollEffects()
    this.setupAnimations()
    this.setupProgressBar()
    this.setupScrollTopButton()
    this.setupCounters()
  }

  disconnect() {
    this.removeEventListeners()
  }

  setupScrollEffects() {
    this.scrollHandler = this.handleScroll.bind(this)
    window.addEventListener('scroll', this.scrollHandler, { passive: true })
  }

  setupAnimations() {
    // Intersection Observer for scroll animations
    this.animationObserver = new IntersectionObserver(
      this.handleAnimationIntersection.bind(this),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    // Observe elements for animation
    const animateElements = this.element.querySelectorAll('.feature-card, .service-card, .result-card, .process-step, .testimonial-card')
    animateElements.forEach(el => {
      this.animationObserver.observe(el)
    })
  }

  setupProgressBar() {
    if (!this.hasProgressBarTarget) return

    this.progressHandler = this.updateProgressBar.bind(this)
    window.addEventListener('scroll', this.progressHandler, { passive: true })
  }

  setupScrollTopButton() {
    if (!this.hasScrollTopBtnTarget) return

    this.scrollTopHandler = this.toggleScrollTopButton.bind(this)
    window.addEventListener('scroll', this.scrollTopHandler, { passive: true })

    this.scrollTopBtnTarget.addEventListener('click', this.scrollToTop.bind(this))
  }

  setupCounters() {
    this.counterObserver = new IntersectionObserver(
      this.handleCounterIntersection.bind(this),
      { threshold: 0.5 }
    )

    const counters = this.element.querySelectorAll('.result-number, .counter')
    counters.forEach(counter => {
      this.counterObserver.observe(counter)
    })
  }

  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    // Add scrolled class to navbar
    if (scrollTop > this.scrollThresholdValue) {
      document.body.classList.add('scrolled')
    } else {
      document.body.classList.remove('scrolled')
    }
  }

  handleAnimationIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animate-in')
        }, this.animationDelayValue)
      }
    })
  }

  handleCounterIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateCounter(entry.target)
        this.counterObserver.unobserve(entry.target)
      }
    })
  }

  animateCounter(element) {
    const text = element.textContent
    const isPercentage = text.includes('%')
    const isNegative = text.includes('-')
    const hasPlus = text.includes('+')
    const isMillion = text.includes('M')
    
    let targetNumber = parseInt(text.replace(/[^\d]/g, ''))
    
    let currentNumber = 0
    const increment = targetNumber / 50
    const timer = setInterval(() => {
      currentNumber += increment
      if (currentNumber >= targetNumber) {
        currentNumber = targetNumber
        clearInterval(timer)
      }
      
      let displayNumber = Math.floor(currentNumber)
      let displayText = ''
      
      if (hasPlus) displayText += '+'
      if (isNegative) displayText += '-'
      
      if (isMillion) {
        displayText += displayNumber + 'M+'
      } else {
        displayText += displayNumber
        if (isPercentage) displayText += '%'
      }
      
      element.textContent = displayText
    }, 30)
  }

  updateProgressBar() {
    if (!this.hasProgressBarTarget) return

    const scrollTop = window.pageYOffset
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = (scrollTop / docHeight) * 100
    this.progressBarTarget.style.width = scrollPercent + '%'
  }

  toggleScrollTopButton() {
    if (!this.hasScrollTopBtnTarget) return

    if (window.pageYOffset > 300) {
      this.scrollTopBtnTarget.style.opacity = '1'
      this.scrollTopBtnTarget.style.visibility = 'visible'
    } else {
      this.scrollTopBtnTarget.style.opacity = '0'
      this.scrollTopBtnTarget.style.visibility = 'hidden'
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  removeEventListeners() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler)
    }
    if (this.progressHandler) {
      window.removeEventListener('scroll', this.progressHandler)
    }
    if (this.scrollTopHandler) {
      window.removeEventListener('scroll', this.scrollTopHandler)
    }
    if (this.animationObserver) {
      this.animationObserver.disconnect()
    }
    if (this.counterObserver) {
      this.counterObserver.disconnect()
    }
  }
}
