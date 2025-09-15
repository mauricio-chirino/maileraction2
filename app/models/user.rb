class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable

  # Validaciones para campos del Radar
  validates :website, presence: true, format: { 
    with: URI::regexp(%w[http https]), 
    message: "debe ser una URL válida" 
  }
  validates :domain_email, presence: true, format: { 
    with: URI::MailTo::EMAIL_REGEXP, 
    message: "debe ser un email válido" 
  }

  # Validación personalizada para verificar que el email pertenece al dominio del sitio web
  validate :email_matches_domain

  private

  def email_matches_domain
    return unless website.present? && domain_email.present?
    
    begin
      website_domain = URI.parse(website).host
      email_domain = domain_email.split('@').last
      
      unless website_domain == email_domain
        errors.add(:domain_email, "debe pertenecer al dominio del sitio web (#{website_domain})")
      end
    rescue URI::InvalidURIError
      errors.add(:website, "no es una URL válida")
    end
  end
end
