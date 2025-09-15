import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["scanner", "profile", "data", "progress", "result"]
  static values = { 
    demoMode: { type: Boolean, default: true },
    scanDuration: { type: Number, default: 3000 }
  }

  connect() {
    console.log('Radar controller connected')
    this.setupScanner()
    this.setupDemoData()
  }

  disconnect() {
    this.clearTimers()
  }

  setupScanner() {
    if (!this.hasScannerTarget) return
    
    // Add scanner animation classes
    this.scannerTarget.classList.add('radar-scanner')
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

  startScan() {
    if (!this.hasScannerTarget || !this.hasProgressTarget) return

    console.log('Starting radar scan...')
    
    // Reset UI
    this.resetScanUI()
    
    // Start scanning animation
    this.scannerTarget.classList.add('scanning')
    this.progressTarget.style.width = '0%'
    
    // Simulate scanning progress
    this.scanProgress = 0
    this.scanInterval = setInterval(() => {
      this.scanProgress += 2
      this.progressTarget.style.width = this.scanProgress + '%'
      
      if (this.scanProgress >= 100) {
        this.completeScan()
      }
    }, this.scanDurationValue / 50)
  }

  completeScan() {
    console.log('Scan completed!')
    
    // Clear scanning animation
    this.scannerTarget.classList.remove('scanning')
    this.scannerTarget.classList.add('completed')
    
    // Clear progress interval
    if (this.scanInterval) {
      clearInterval(this.scanInterval)
    }
    
    // Show results after a brief delay
    setTimeout(() => {
      this.showResults()
    }, 500)
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
    if (this.hasScannerTarget) {
      this.scannerTarget.classList.remove('scanning', 'completed')
    }
    if (this.hasResultTarget) {
      this.resultTarget.classList.remove('show')
    }
    if (this.hasDataTarget) {
      this.dataTarget.innerHTML = ''
    }
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
