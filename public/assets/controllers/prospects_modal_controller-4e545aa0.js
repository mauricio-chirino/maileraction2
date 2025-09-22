import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log("ProspectsModal controller connected")
  }

  showModal(event) {
    console.log("=== PROSPECTS MODAL DEBUG ===")
    console.log("Event:", event)
    console.log("Controller:", this)
    
    if (event) {
      event.preventDefault()
    }
    
    // Generar datos
    console.log("Generating prospects...")
    const prospects = this.createMockProspects()
    console.log("Prospects generated:", prospects)
    
    // Buscar el modal
    const modalElement = document.getElementById('prospectsModal')
    console.log("Modal element found:", modalElement)
    
    if (modalElement) {
      console.log("Filling table...")
      // Llenar la tabla
      this.renderProspects(prospects)
      
      console.log("Showing modal...")
      // Mostrar el modal
      const modal = new bootstrap.Modal(modalElement)
      modal.show()
      console.log("Modal should be visible now")
    } else {
      console.error("❌ Modal element not found!")
      console.log("Available modals:", document.querySelectorAll('.modal'))
    }
  }

  createMockProspects() {
    const companies = [
      "TechCorp Solutions", "InnovateLab", "DataFlow Systems", "CloudTech Inc", "AI Dynamics",
      "NextGen Software", "Digital Ventures", "SmartTech Group", "FutureWorks", "CyberCore"
    ]
    
    const industries = [
      "Tecnología", "Fintech", "Healthcare", "E-commerce", "SaaS", 
      "Manufacturing", "Consulting", "Real Estate", "Education", "Automotive"
    ]
    
    const sizes = [
      "1-10 empleados", "11-50 empleados", "51-200 empleados", "201-500 empleados", "500+ empleados"
    ]
    
    const locations = [
      "Madrid, España", "Barcelona, España", "Valencia, España", "Sevilla, España", "Bilbao, España",
      "México DF, México", "Buenos Aires, Argentina", "Santiago, Chile", "Bogotá, Colombia", "Lima, Perú"
    ]

    const prospects = []
    
    for (let i = 0; i < 10; i++) {
      prospects.push({
        company: companies[i],
        industry: industries[Math.floor(Math.random() * industries.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        email: `contacto@${companies[i].toLowerCase().replace(/\s+/g, '')}.com`,
        compatibility: Math.floor(Math.random() * 40) + 60 // 60-100%
      })
    }

    // Ordenar por compatibilidad descendente
    return prospects.sort((a, b) => b.compatibility - a.compatibility)
  }

  renderProspects(prospects) {
    const tableBody = document.querySelector('[data-prospects-modal-target="tableBody"]')
    if (!tableBody) {
      console.error("Table body not found")
      return
    }
    
    tableBody.innerHTML = ""
    
    prospects.forEach((prospect, index) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${index + 1}</td>
        <td><strong>${prospect.company}</strong></td>
        <td>${prospect.industry}</td>
        <td>${prospect.size}</td>
        <td>${prospect.location}</td>
        <td>${prospect.email}</td>
        <td>
          <span class="badge ${this.getCompatibilityClass(prospect.compatibility)}">
            ${prospect.compatibility}%
          </span>
        </td>
      `
      tableBody.appendChild(row)
    })
  }

  getCompatibilityClass(score) {
    if (score >= 90) return "bg-success"
    if (score >= 80) return "bg-warning"
    if (score >= 70) return "bg-info"
    return "bg-secondary"
  }
}
