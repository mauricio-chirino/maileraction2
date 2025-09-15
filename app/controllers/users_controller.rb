class UsersController < ApplicationController
  # Deshabilitar CSRF para verificación de email
  skip_before_action :verify_authenticity_token, only: [:check_email]
  
  def check_email
    email = params[:email]
    
    if email.blank?
      render json: { exists: false, error: 'Email requerido' }, status: :bad_request
      return
    end
    
    # Verificar si el email ya existe
    exists = User.exists?(email: email.downcase.strip)
    
    render json: { 
      exists: exists,
      email: email,
      message: exists ? 'Email ya registrado' : 'Email disponible'
    }
  rescue => e
    Rails.logger.error "Error verificando email: #{e.message}"
    render json: { 
      exists: false, 
      error: 'Error interno del servidor' 
    }, status: :internal_server_error
  end
end
