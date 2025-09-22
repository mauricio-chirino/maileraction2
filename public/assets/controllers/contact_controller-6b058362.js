import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form", "name", "email", "phone", "company", "message", "submit", "error", "success"]
  static values = { 
    validateOnBlur: { type: Boolean, default: true },
    showRealTimeValidation: { type: Boolean, default: true }
  }

  connect() {
    console.log('Contact controller connected')
    this.setupValidation()
    this.setupFormSubmission()
  }

  setupValidation() {
    if (!this.validateOnBlurValue) return

    // Add blur event listeners for real-time validation
    if (this.hasNameTarget) {
      this.nameTarget.addEventListener('blur', () => this.validateName())
    }
    if (this.hasEmailTarget) {
      this.emailTarget.addEventListener('blur', () => this.validateEmail())
    }
    if (this.hasPhoneTarget) {
      this.phoneTarget.addEventListener('blur', () => this.validatePhone())
    }
    if (this.hasCompanyTarget) {
      this.companyTarget.addEventListener('blur', () => this.validateCompany())
    }
    if (this.hasMessageTarget) {
      this.messageTarget.addEventListener('blur', () => this.validateMessage())
    }
  }

  setupFormSubmission() {
    if (!this.hasFormTarget) return

    this.formTarget.addEventListener('submit', this.handleSubmit.bind(this))
  }

  validateName() {
    const name = this.nameTarget.value.trim()
    const isValid = name.length >= 2
    
    this.showFieldValidation(this.nameTarget, isValid, 'Name must be at least 2 characters')
    return isValid
  }

  validateEmail() {
    const email = this.emailTarget.value.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)
    
    this.showFieldValidation(this.emailTarget, isValid, 'Please enter a valid email address')
    return isValid
  }

  validatePhone() {
    const phone = this.phoneTarget.value.trim()
    // Chilean phone format: +569 + 8 digits
    const phoneRegex = /^\+569\d{8}$/
    const isValid = phoneRegex.test(phone)
    
    this.showFieldValidation(this.phoneTarget, isValid, 'Please enter a valid Chilean phone number (+569 + 8 digits)')
    return isValid
  }

  validateCompany() {
    const company = this.companyTarget.value.trim()
    const isValid = company.length >= 2
    
    this.showFieldValidation(this.companyTarget, isValid, 'Company name must be at least 2 characters')
    return isValid
  }

  validateMessage() {
    const message = this.messageTarget.value.trim()
    const isValid = message.length >= 20
    
    this.showFieldValidation(this.messageTarget, isValid, 'Message must be at least 20 characters')
    return isValid
  }

  showFieldValidation(field, isValid, errorMessage) {
    if (!this.showRealTimeValidationValue) return

    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid')
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error')
    if (existingError) {
      existingError.remove()
    }

    if (isValid) {
      field.classList.add('is-valid')
    } else {
      field.classList.add('is-invalid')
      
      // Add error message
      const errorDiv = document.createElement('div')
      errorDiv.className = 'field-error text-danger small mt-1'
      errorDiv.textContent = errorMessage
      field.parentNode.appendChild(errorDiv)
    }
  }

  async handleSubmit(event) {
    event.preventDefault()
    
    console.log('Form submission started')
    
    // Validate all fields
    const isNameValid = this.validateName()
    const isEmailValid = this.validateEmail()
    const isPhoneValid = this.validatePhone()
    const isCompanyValid = this.validateCompany()
    const isMessageValid = this.validateMessage()
    
    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isCompanyValid && isMessageValid
    
    if (!isFormValid) {
      this.showError('Please fix the errors above before submitting')
      return
    }
    
    // Disable submit button and show loading
    this.setSubmitLoading(true)
    
    try {
      const formData = new FormData(this.formTarget)
      const response = await fetch('/submit_contact', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        }
      })
      
      if (response.ok) {
        this.showSuccess('Message sent successfully! We\'ll get back to you soon.')
        this.resetForm()
      } else {
        throw new Error('Server error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      this.showError('There was an error sending your message. Please try again.')
    } finally {
      this.setSubmitLoading(false)
    }
  }

  setSubmitLoading(loading) {
    if (!this.hasSubmitTarget) return

    if (loading) {
      this.submitTarget.disabled = true
      this.submitTarget.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...'
    } else {
      this.submitTarget.disabled = false
      this.submitTarget.innerHTML = 'Send Message'
    }
  }

  showSuccess(message) {
    this.hideMessages()
    if (this.hasSuccessTarget) {
      this.successTarget.textContent = message
      this.successTarget.classList.add('show')
    }
  }

  showError(message) {
    this.hideMessages()
    if (this.hasErrorTarget) {
      this.errorTarget.textContent = message
      this.errorTarget.classList.add('show')
    }
  }

  hideMessages() {
    if (this.hasSuccessTarget) {
      this.successTarget.classList.remove('show')
    }
    if (this.hasErrorTarget) {
      this.errorTarget.classList.remove('show')
    }
  }

  resetForm() {
    if (!this.hasFormTarget) return

    this.formTarget.reset()
    
    // Remove validation classes
    const fields = this.formTarget.querySelectorAll('.form-control')
    fields.forEach(field => {
      field.classList.remove('is-valid', 'is-invalid')
    })
    
    // Remove error messages
    const errorMessages = this.formTarget.querySelectorAll('.field-error')
    errorMessages.forEach(error => error.remove())
  }
}
