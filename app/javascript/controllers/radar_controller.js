import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["industryInput", "searchBtn", "inputPanel", "stepsPanel", "industryDisplay", "wizardStep1", "wizardStep2", "wizardStep3", "wizardStep4", "wizardStep5", "stepCircle1", "stepCircle2", "stepCircle3", "stepCircle4", "stepCircle5", "visual1", "visual2", "visual3", "visual4", "visual5", "affinityBar", "sendAnimation"]
  static values = { 
    demoMode: { type: Boolean, default: true },
    scanDuration: { type: Number, default: 8000 }
  }

  connect() {
    console.log('Radar controller connected')
    this.setupDemoData()
    this.currentIndustry = ""
    this.currentStep = 0
  }

  showDemo() {
    console.log('Showing radar demo...')
    console.log('Radar controller connected:', this.element)
    
    // Show the demo section
    const demoSection = document.getElementById('demo-servicios')
    console.log('Demo section found:', demoSection)
    
    if (demoSection) {
      demoSection.style.display = 'block'
      console.log('Demo section displayed')
      
      // Scroll to demo section
      demoSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      console.log('Scrolled to demo section')
    } else {
      console.error('Demo section not found!')
    }
  }

  disconnect() {
    this.clearTimers()
  }

  validateInput() {
    const input = this.industryInputTarget.value.trim()
    const isValid = input.length >= 3
    
    if (isValid) {
      this.searchBtnTarget.disabled = false
      this.searchBtnTarget.classList.remove('btn-secondary')
      this.searchBtnTarget.classList.add('btn-primary')
    } else {
      this.searchBtnTarget.disabled = true
      this.searchBtnTarget.classList.remove('btn-primary')
      this.searchBtnTarget.classList.add('btn-secondary')
    }
  }

  setupDemoData() {
    if (!this.demoModeValue) return
    
    this.demoProfiles = [
      {
        name: "Sarah Johnson",
        company: "TechCorp Solutions",
        title: "VP of Marketing",
        industry: "Technology",
        companySize: "500-1000 employees",
        location: "San Francisco, CA",
        recentActivity: "Posted about AI trends on LinkedIn",
        engagementScore: 92,
        conversionProbability: 87,
        interests: ["AI", "Marketing Automation", "Data Analytics"],
        painPoints: ["Lead Generation", "ROI Measurement"],
        optimalContactTime: "Tuesday 2-4 PM PST"
      },
      {
        name: "Michael Chen",
        company: "GrowthLabs Inc",
        title: "Head of Sales",
        industry: "SaaS",
        companySize: "100-500 employees",
        location: "Austin, TX",
        recentActivity: "Engaged with competitor content",
        engagementScore: 78,
        conversionProbability: 73,
        interests: ["Sales Automation", "CRM", "Lead Scoring"],
        painPoints: ["Sales Pipeline", "Lead Quality"],
        optimalContactTime: "Wednesday 10-12 PM CST"
      },
      {
        name: "Emily Rodriguez",
        company: "Digital Dynamics",
        title: "Marketing Director",
        industry: "E-commerce",
        companySize: "50-200 employees",
        location: "Miami, FL",
        recentActivity: "Shared article about email marketing",
        engagementScore: 85,
        conversionProbability: 81,
        interests: ["Email Marketing", "Customer Retention", "Personalization"],
        painPoints: ["Email Deliverability", "Personalization"],
        optimalContactTime: "Thursday 1-3 PM EST"
      }
    ]
  }

  startWizard() {
    if (!this.hasIndustryInputTarget) return

    const industry = this.industryInputTarget.value.trim()
    if (industry.length < 3) return

    console.log('Starting radar wizard for industry:', industry)
    
    this.currentIndustry = industry
    
    // Hide input panel and show steps panel
    this.inputPanelTarget.style.display = 'none'
    this.stepsPanelTarget.style.display = 'block'
    
    // Update industry display
    this.industryDisplayTarget.textContent = industry
    
    // Reset wizard state
    this.resetWizard()
    
    // Start wizard process
    this.startWizardSteps()
  }

  resetWizard() {
    // Reset all wizard steps
    for (let i = 1; i <= 5; i++) {
      const stepTarget = this[`wizardStep${i}Target`]
      const circleTarget = this[`stepCircle${i}Target`]
      
      if (stepTarget) stepTarget.classList.remove('active', 'completed')
      if (circleTarget) circleTarget.classList.remove('active', 'completed')
    }
    
    // Reset affinity bar
    if (this.hasAffinityBarTarget) {
      this.affinityBarTarget.style.width = '0%'
    }
    
    this.currentStep = 0
  }

  startWizardSteps() {
    // Step 1: Perfil inicial (Apollo.io)
    setTimeout(() => {
      this.activateWizardStep(1)
      this.animateProfilePreview()
    }, 500)
    
    // Step 2: Contexto inteligente (Tavily)
    setTimeout(() => {
      this.completeWizardStep(1)
      this.activateWizardStep(2)
      this.animateContextRadar()
    }, 2000)
    
    // Step 3: Personalización emocional
    setTimeout(() => {
      this.completeWizardStep(2)
      this.activateWizardStep(3)
      this.animateEmotionalCard()
    }, 3500)
    
    // Step 4: Validación
    setTimeout(() => {
      this.completeWizardStep(3)
      this.activateWizardStep(4)
      this.animateValidation()
    }, 5000)
    
    // Step 5: Listo para contactar
    setTimeout(() => {
      this.completeWizardStep(4)
      this.activateWizardStep(5)
      this.animateReadyState()
    }, 6500)
  }

  activateWizardStep(stepNumber) {
    const stepTarget = this[`wizardStep${stepNumber}Target`]
    const circleTarget = this[`stepCircle${stepNumber}Target`]
    
    if (stepTarget) stepTarget.classList.add('active')
    if (circleTarget) circleTarget.classList.add('active')
    
    this.currentStep = stepNumber
  }

  completeWizardStep(stepNumber) {
    const stepTarget = this[`wizardStep${stepNumber}Target`]
    const circleTarget = this[`stepCircle${stepNumber}Target`]
    
    if (stepTarget) {
      stepTarget.classList.remove('active')
      stepTarget.classList.add('completed')
    }
    if (circleTarget) {
      circleTarget.classList.remove('active')
      circleTarget.classList.add('completed')
    }
  }

  // Animation methods for each step
  animateProfilePreview() {
    if (!this.hasVisual1Target) return
    
    const visual = this.visual1Target
    const placeholders = visual.querySelectorAll('.name-placeholder, .title-placeholder, .company-placeholder')
    
    placeholders.forEach((placeholder, index) => {
      setTimeout(() => {
        placeholder.classList.add('animate-in')
      }, index * 200)
    })
  }

  animateContextRadar() {
    if (!this.hasVisual2Target) return
    
    const visual = this.visual2Target
    const radarRing = visual.querySelector('.radar-ring')
    const contextIcons = visual.querySelectorAll('.context-icons lord-icon')
    
    if (radarRing) {
      radarRing.classList.add('scanning')
    }
    
    contextIcons.forEach((icon, index) => {
      setTimeout(() => {
        icon.style.opacity = '1'
        icon.style.transform = 'scale(1)'
      }, index * 300)
    })
  }

  animateEmotionalCard() {
    if (!this.hasVisual3Target) return
    
    const visual = this.visual3Target
    const emojiSection = visual.querySelector('.emoji-section')
    const toneIndicator = visual.querySelector('.tone-indicator')
    const ctaPreview = visual.querySelector('.cta-preview')
    
    setTimeout(() => emojiSection.classList.add('animate-in'), 200)
    setTimeout(() => toneIndicator.classList.add('animate-in'), 400)
    setTimeout(() => ctaPreview.classList.add('animate-in'), 600)
  }

  animateValidation() {
    if (!this.hasVisual4Target) return
    
    const visual = this.visual4Target
    const checkmarks = visual.querySelectorAll('.checkmarks lord-icon')
    const affinityBar = this.affinityBarTarget
    
    checkmarks.forEach((checkmark, index) => {
      setTimeout(() => {
        checkmark.classList.add('animate-in')
      }, index * 200)
    })
    
    // Animate affinity bar
    setTimeout(() => {
      if (affinityBar) {
        affinityBar.style.width = '92%'
      }
    }, 800)
  }

  animateReadyState() {
    if (!this.hasVisual5Target) return
    
    const visual = this.visual5Target
    const outreachBtn = visual.querySelector('.outreach-btn')
    
    setTimeout(() => {
      outreachBtn.classList.add('animate-in')
    }, 300)
  }

  initiateOutreach() {
    console.log('Initiating outreach...')
    
    // Show send animation
    if (this.hasSendAnimationTarget) {
      this.sendAnimationTarget.classList.add('sending')
    }
    
    // Simulate sending
    setTimeout(() => {
      alert('¡Outreach iniciado! El mensaje emocionalmente resonante ha sido enviado al prospecto.')
      
      // Reset wizard
      this.resetScanUI()
    }, 2000)
  }

  completeScan() {
    console.log('Scan completed!')
    
    // Hide progress section and show results
    setTimeout(() => {
      this.progressSectionTarget.style.display = 'none'
      this.showResults()
    }, 1000)
  }

  showResults() {
    if (!this.hasResultTarget) return

    // Get random demo profile
    const randomProfile = this.demoProfiles[Math.floor(Math.random() * this.demoProfiles.length)]
    
    // Populate result data
    this.populateProfileData(randomProfile)
    
    // Show result with animation
    this.resultTarget.classList.add('show')
    
    // Trigger profile animation
    setTimeout(() => {
      this.animateProfileData()
    }, 200)
  }

  populateProfileData(profile) {
    if (!this.hasDataTarget) return

    const dataHTML = `
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <lord-icon src="https://cdn.lordicon.com/dxjqoygy.json" trigger="loop" delay="2000" stroke="light" style="width:60px;height:60px"></lord-icon>
          </div>
          <div class="profile-info">
            <h3>${profile.name}</h3>
            <p class="profile-title">${profile.title}</p>
            <p class="profile-company">${profile.company}</p>
          </div>
          <div class="profile-score">
            <div class="score-circle">
              <span class="score-number">${profile.conversionProbability}%</span>
              <span class="score-label">Conversion Probability</span>
            </div>
          </div>
        </div>
        
        <div class="profile-details">
          <div class="detail-row">
            <span class="detail-label">Industry:</span>
            <span class="detail-value">${profile.industry}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Company Size:</span>
            <span class="detail-value">${profile.companySize}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">${profile.location}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Recent Activity:</span>
            <span class="detail-value">${profile.recentActivity}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Engagement Score:</span>
            <span class="detail-value score-high">${profile.engagementScore}%</span>
          </div>
        </div>
        
        <div class="profile-interests">
          <h4>Key Interests:</h4>
          <div class="interest-tags">
            ${profile.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
          </div>
        </div>
        
        <div class="profile-pain-points">
          <h4>Pain Points:</h4>
          <div class="pain-point-tags">
            ${profile.painPoints.map(pain => `<span class="pain-tag">${pain}</span>`).join('')}
          </div>
        </div>
        
        <div class="profile-timing">
          <h4>Optimal Contact Time:</h4>
          <p class="timing-info">${profile.optimalContactTime}</p>
        </div>
        
        <div class="profile-actions">
          <button class="btn btn-primary" data-action="click->radar#contactProspect">
            <lord-icon src="https://cdn.lordicon.com/ggihhudh.json" trigger="loop" delay="2000" stroke="light" style="width:20px;height:20px"></lord-icon>
            Contact Prospect
          </button>
          <button class="btn btn-secondary" data-action="click->radar#saveProspect">
            <lord-icon src="https://cdn.lordicon.com/ggihhudh.json" trigger="loop" delay="2000" stroke="light" style="width:20px;height:20px"></lord-icon>
            Save to CRM
          </button>
        </div>
      </div>
    `
    
    this.dataTarget.innerHTML = dataHTML
  }

  animateProfileData() {
    if (!this.hasDataTarget) return

    const profileCard = this.dataTarget.querySelector('.profile-card')
    if (profileCard) {
      profileCard.classList.add('animate-in')
    }
  }

  resetScanUI() {
    // Show input panel and hide steps panel
    this.inputPanelTarget.style.display = 'block'
    this.stepsPanelTarget.style.display = 'none'
    
    // Clear input
    this.industryInputTarget.value = ''
    this.validateInput()
    
    // Reset wizard state
    this.resetWizard()
  }

  contactProspect() {
    console.log('Contacting prospect...')
    // This would integrate with the contact form or CRM
    alert('Prospect contact initiated! This would open the contact form with pre-filled data.')
  }

  saveProspect() {
    console.log('Saving prospect to CRM...')
    // This would integrate with CRM system
    alert('Prospect saved to CRM! This would sync with your CRM system.')
  }

  clearTimers() {
    if (this.scanInterval) {
      clearInterval(this.scanInterval)
    }
  }
}
