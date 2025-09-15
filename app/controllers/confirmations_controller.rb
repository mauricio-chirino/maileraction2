class ConfirmationsController < Devise::ConfirmationsController
  # Deshabilitar CSRF para webhook de n8n
  skip_before_action :verify_authenticity_token, only: [:create]
  
  def create
    email = params[:user][:email]
    
    if email.blank?
      flash[:alert] = 'Email requerido'
      redirect_to new_user_confirmation_path
      return
    end
    
    # Buscar el usuario por email
    user = User.find_by(email: email.downcase.strip)
    
    if user
      if user.confirmed?
        flash[:notice] = 'Tu cuenta ya está confirmada. Puedes iniciar sesión.'
        redirect_to new_user_session_path
        return
      else
        # Usuario existe pero no está confirmado, enviar email via n8n
        send_confirmation_email_via_n8n(user)
        flash[:notice] = 'Se ha enviado un nuevo email de confirmación. Revisa tu bandeja de entrada.'
        redirect_to new_user_confirmation_path
        return
      end
    else
      flash[:alert] = 'No se encontró una cuenta con ese email.'
      redirect_to new_user_confirmation_path
      return
    end
  end
  
  private
  
  def send_confirmation_email_via_n8n(user)
    Rails.logger.info "=== ENVIANDO EMAIL DE CONFIRMACIÓN VIA N8N ==="
    Rails.logger.info "Usuario: #{user.email} - UUID: #{user.uuid}"
    
    # Ejecutar en background para no bloquear la respuesta
    Thread.new do
      begin
        result = DeviseN8nService.resend_confirmation(user)
        
        if result[:success]
          Rails.logger.info "Email de confirmación enviado exitosamente via n8n"
        else
          Rails.logger.error "Error al enviar email de confirmación via n8n: #{result[:error]}"
        end
      rescue => e
        Rails.logger.error "Error en envío de confirmación: #{e.message}"
      end
    end
  end
end
