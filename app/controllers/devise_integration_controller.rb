class DeviseIntegrationController < ApplicationController
  # Deshabilitar CSRF para webhooks de n8n
  skip_before_action :verify_authenticity_token, only: [:create_user, :reset_password, :resend_confirmation]
  
  # Webhook para crear usuario (sign_up)
  def create_user
    Rails.logger.info "=== CREATE_USER WEBHOOK RECIBIDO ==="
    Rails.logger.info "Params: #{params.inspect}"
    
    # Datos del formulario de registro
    user_data = {
      email: params[:email] || params[:user][:email],
      website: params[:website] || params[:user][:website],
      password: params[:password] || params[:user][:password],
      password_confirmation: params[:password_confirmation] || params[:user][:password_confirmation],
      timestamp: Time.current.iso8601,
      action: 'user_registration'
    }
    
    Rails.logger.info "User data: #{user_data.inspect}"
    
    # Validar datos requeridos
    if user_data[:email].blank? || user_data[:website].blank? || user_data[:password].blank?
      Rails.logger.error "Datos requeridos faltantes"
      render json: { error: 'Datos requeridos faltantes' }, status: :bad_request
      return
    end
    
    # Enviar a n8n workflow create_user
    begin
      Rails.logger.info "=== GENERANDO TOKEN JWT ==="
      token = JwtService.generate_n8n_token
      Rails.logger.info "Token generado exitosamente"
      
      Rails.logger.info "=== ENVIANDO A N8N CREATE_USER WORKFLOW ==="
      Rails.logger.info "URL: https://n8n.aniracloud.com/n8n/webhook-test/9ce12be5-363e-4741-a8ed-16ba78ece643"
      Rails.logger.info "Token: #{token}"
      Rails.logger.info "Datos: #{user_data.to_json}"
      
      response = HTTParty.post(
        'https://n8n.aniracloud.com/n8n/webhook-test/9ce12be5-363e-4741-a8ed-16ba78ece643',
        body: user_data.to_json,
        headers: { 
          'Content-Type' => 'application/json',
          'Authorization' => "Bearer #{token}"
        }
      )
      
      Rails.logger.info "Respuesta de n8n: #{response.code} - #{response.body}"
      
      if response.success?
        Rails.logger.info "Usuario creado exitosamente en n8n"
        render json: { 
          success: true, 
          message: 'Usuario creado exitosamente',
          data: JSON.parse(response.body) rescue response.body
        }
      else
        Rails.logger.error "Error en n8n: #{response.code} - #{response.body}"
        render json: { 
          error: 'Error al crear usuario en n8n',
          details: response.body
        }, status: :unprocessable_entity
      end
    rescue => e
      Rails.logger.error "=== ERROR EN N8N CREATE_USER ==="
      Rails.logger.error "Error: #{e.message}"
      Rails.logger.error "Backtrace: #{e.backtrace.first(5).join('\n')}"
      render json: { 
        error: 'Error interno del servidor',
        details: e.message
      }, status: :internal_server_error
    end
  end
  
  # Webhook para reset de contraseña (password/new)
  def reset_password
    Rails.logger.info "=== RESET_PASSWORD WEBHOOK RECIBIDO ==="
    Rails.logger.info "Params: #{params.inspect}"
    
    # Datos del formulario de reset de contraseña
    reset_data = {
      email: params[:email] || params[:user][:email],
      timestamp: Time.current.iso8601,
      action: 'password_reset'
    }
    
    Rails.logger.info "Reset data: #{reset_data.inspect}"
    
    # Validar email requerido
    if reset_data[:email].blank?
      Rails.logger.error "Email requerido para reset de contraseña"
      render json: { error: 'Email es requerido' }, status: :bad_request
      return
    end
    
    # Enviar a n8n workflow create_user (mismo workflow, diferente acción)
    begin
      Rails.logger.info "=== GENERANDO TOKEN JWT ==="
      token = JwtService.generate_n8n_token
      Rails.logger.info "Token generado exitosamente"
      
      Rails.logger.info "=== ENVIANDO A N8N RESET_PASSWORD WORKFLOW ==="
      Rails.logger.info "URL: https://n8n.aniracloud.com/n8n/webhook-test/9ce12be5-363e-4741-a8ed-16ba78ece643"
      Rails.logger.info "Token: #{token}"
      Rails.logger.info "Datos: #{reset_data.to_json}"
      
      response = HTTParty.post(
        'https://n8n.aniracloud.com/n8n/webhook-test/9ce12be5-363e-4741-a8ed-16ba78ece643',
        body: reset_data.to_json,
        headers: { 
          'Content-Type' => 'application/json',
          'Authorization' => "Bearer #{token}"
        }
      )
      
      Rails.logger.info "Respuesta de n8n: #{response.code} - #{response.body}"
      
      if response.success?
        Rails.logger.info "Reset de contraseña enviado exitosamente"
        render json: { 
          success: true, 
          message: 'Instrucciones de reset enviadas',
          data: JSON.parse(response.body) rescue response.body
        }
      else
        Rails.logger.error "Error en n8n: #{response.code} - #{response.body}"
        render json: { 
          error: 'Error al enviar instrucciones de reset',
          details: response.body
        }, status: :unprocessable_entity
      end
    rescue => e
      Rails.logger.error "=== ERROR EN N8N RESET_PASSWORD ==="
      Rails.logger.error "Error: #{e.message}"
      Rails.logger.error "Backtrace: #{e.backtrace.first(5).join('\n')}"
      render json: { 
        error: 'Error interno del servidor',
        details: e.message
      }, status: :internal_server_error
    end
  end
  
  # Webhook para reenvío de confirmación (confirmation/new)
  def resend_confirmation
    Rails.logger.info "=== RESEND_CONFIRMATION WEBHOOK RECIBIDO ==="
    Rails.logger.info "Params: #{params.inspect}"
    
    # Datos del formulario de reenvío de confirmación
    confirmation_data = {
      email: params[:email] || params[:user][:email],
      timestamp: Time.current.iso8601,
      action: 'resend_confirmation'
    }
    
    Rails.logger.info "Confirmation data: #{confirmation_data.inspect}"
    
    # Validar email requerido
    if confirmation_data[:email].blank?
      Rails.logger.error "Email requerido para reenvío de confirmación"
      render json: { error: 'Email es requerido' }, status: :bad_request
      return
    end
    
    # Enviar a n8n workflow create_user (mismo workflow, diferente acción)
    begin
      Rails.logger.info "=== GENERANDO TOKEN JWT ==="
      token = JwtService.generate_n8n_token
      Rails.logger.info "Token generado exitosamente"
      
      Rails.logger.info "=== ENVIANDO A N8N RESEND_CONFIRMATION WORKFLOW ==="
      Rails.logger.info "URL: https://n8n.aniracloud.com/n8n/webhook-test/9ce12be5-363e-4741-a8ed-16ba78ece643"
      Rails.logger.info "Token: #{token}"
      Rails.logger.info "Datos: #{confirmation_data.to_json}"
      
      response = HTTParty.post(
        'https://n8n.aniracloud.com/n8n/webhook-test/9ce12be5-363e-4741-a8ed-16ba78ece643',
        body: confirmation_data.to_json,
        headers: { 
          'Content-Type' => 'application/json',
          'Authorization' => "Bearer #{token}"
        }
      )
      
      Rails.logger.info "Respuesta de n8n: #{response.code} - #{response.body}"
      
      if response.success?
        Rails.logger.info "Reenvío de confirmación enviado exitosamente"
        render json: { 
          success: true, 
          message: 'Instrucciones de confirmación reenviadas',
          data: JSON.parse(response.body) rescue response.body
        }
      else
        Rails.logger.error "Error en n8n: #{response.code} - #{response.body}"
        render json: { 
          error: 'Error al reenviar instrucciones de confirmación',
          details: response.body
        }, status: :unprocessable_entity
      end
    rescue => e
      Rails.logger.error "=== ERROR EN N8N RESEND_CONFIRMATION ==="
      Rails.logger.error "Error: #{e.message}"
      Rails.logger.error "Backtrace: #{e.backtrace.first(5).join('\n')}"
      render json: { 
        error: 'Error interno del servidor',
        details: e.message
      }, status: :internal_server_error
    end
  end
end
