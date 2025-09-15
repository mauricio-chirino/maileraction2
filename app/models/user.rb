class User < ApplicationRecord
  include UuidIdentifiable
  
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable

  # Validaciones para campos del Radar
  validates :website, presence: true, format: { 
    with: URI::regexp(%w[http https]), 
    message: "debe ser una URL válida" 
  }

  # Validación personalizada para verificar que el email pertenece al dominio del sitio web
  validate :email_matches_domain

  # Relaciones
  has_many :campaigns, dependent: :destroy
  has_many :prospects, dependent: :destroy

  # Callbacks para integración con n8n
  after_commit :notify_n8n_user_created, on: :create
  after_commit :notify_n8n_user_confirmed, on: :update, if: :saved_change_to_confirmed_at?

  private

  def email_matches_domain
    return unless website.present? && email.present?
    
    begin
      website_domain = URI.parse(website).host
      email_domain = email.split('@').last
      
      unless website_domain == email_domain
        errors.add(:email, "debe pertenecer al dominio del sitio web (#{website_domain})")
      end
    rescue URI::InvalidURIError
      errors.add(:website, "no es una URL válida")
    end
  end

  # Callbacks para n8n
  def notify_n8n_user_created
    Rails.logger.info "=== NOTIFICANDO CREACIÓN DE USUARIO A N8N ==="
    Rails.logger.info "Usuario: #{email} - UUID: #{uuid}"
    
    # Ejecutar en background para no bloquear la respuesta
    Thread.new do
      begin
        result = DeviseN8nService.create_user({
          email: email,
          website: website,
          uuid: uuid
        })
        
        if result[:success]
          Rails.logger.info "Usuario creado exitosamente en n8n"
        else
          Rails.logger.error "Error al crear usuario en n8n: #{result[:error]}"
        end
      rescue => e
        Rails.logger.error "Error en callback de creación: #{e.message}"
      end
    end
  end

  def notify_n8n_user_confirmed
    Rails.logger.info "=== NOTIFICANDO CONFIRMACIÓN DE USUARIO A N8N ==="
    Rails.logger.info "Usuario: #{email} - UUID: #{uuid}"
    
    # Ejecutar en background para no bloquear la respuesta
    Thread.new do
      begin
        result = DeviseN8nService.confirm_email(self)
        
        if result[:success]
          Rails.logger.info "Confirmación de usuario enviada exitosamente a n8n"
        else
          Rails.logger.error "Error al confirmar usuario en n8n: #{result[:error]}"
        end
      rescue => e
        Rails.logger.error "Error en callback de confirmación: #{e.message}"
      end
    end
  end
end
