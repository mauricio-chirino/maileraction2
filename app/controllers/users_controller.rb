class UsersController < ApplicationController
  # Deshabilitar CSRF para verificación de email
  skip_before_action :verify_authenticity_token, only: [:check_email]
  
  def check_email
    email = params[:email]
    
    if email.blank?
      render json: { exists: false, error: 'Email requerido' }, status: :bad_request
      return
    end
    
    # Buscar el usuario por email
    user = User.find_by(email: email.downcase.strip)
    
    if user
      if user.confirmed?
        render json: { 
          exists: true,
          confirmed: true,
          email: email,
          message: 'Email ya registrado y confirmado'
        }
      else
        render json: { 
          exists: true,
          confirmed: false,
          email: email,
          message: 'Usuario ya creado, pero aún no has validado tu correo'
        }
      end
    else
      render json: { 
        exists: false,
        email: email,
        message: 'Email disponible'
      }
    end
  rescue => e
    Rails.logger.error "Error verificando email: #{e.message}"
    render json: { 
      exists: false, 
      error: 'Error interno del servidor' 
    }, status: :internal_server_error
  end
end
