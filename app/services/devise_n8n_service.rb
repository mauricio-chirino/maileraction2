class DeviseN8nService
  include HTTParty
  
  # URL del workflow create_user en n8n
  N8N_WEBHOOK_URL = 'https://n8n.aniracloud.com/n8n/webhook-test/9ce12be5-363e-4741-a8ed-16ba78ece643'
  
  class << self
    # Crear usuario en n8n
    def create_user(user_data)
      Rails.logger.info "=== DEVISE_N8N_SERVICE: CREATE_USER ==="
      
      payload = {
        email: user_data[:email],
        website: user_data[:website],
        password: user_data[:password],
        password_confirmation: user_data[:password_confirmation],
        timestamp: Time.current.iso8601,
        action: 'user_registration',
        user_uuid: user_data[:uuid] # UUID del usuario creado
      }
      
      send_to_n8n(payload, 'CREATE_USER')
    end
    
    # Reset de contraseña en n8n
    def reset_password(email)
      Rails.logger.info "=== DEVISE_N8N_SERVICE: RESET_PASSWORD ==="
      
      payload = {
        email: email,
        timestamp: Time.current.iso8601,
        action: 'password_reset'
      }
      
      send_to_n8n(payload, 'RESET_PASSWORD')
    end
    
    # Reenvío de confirmación en n8n
    def resend_confirmation(user)
      Rails.logger.info "=== DEVISE_N8N_SERVICE: RESEND_CONFIRMATION ==="
      
      payload = {
        email: user.email,
        website: user.website,
        user_uuid: user.uuid,
        confirmation_token: user.confirmation_token,
        timestamp: Time.current.iso8601,
        action: 'resend_confirmation'
      }
      
      send_to_n8n(payload, 'RESEND_CONFIRMATION')
    end
    
    # Confirmar email en n8n
    def confirm_email(user)
      Rails.logger.info "=== DEVISE_N8N_SERVICE: CONFIRM_EMAIL ==="
      
      payload = {
        email: user.email,
        website: user.website,
        user_uuid: user.uuid,
        confirmed_at: Time.current.iso8601,
        timestamp: Time.current.iso8601,
        action: 'email_confirmed'
      }
      
      send_to_n8n(payload, 'CONFIRM_EMAIL')
    end
    
    private
    
    def send_to_n8n(payload, action_type)
      begin
        Rails.logger.info "=== GENERANDO TOKEN JWT ==="
        token = JwtService.generate_n8n_token
        Rails.logger.info "Token generado exitosamente"
        
        Rails.logger.info "=== ENVIANDO A N8N #{action_type} ==="
        Rails.logger.info "URL: #{N8N_WEBHOOK_URL}"
        Rails.logger.info "Token: #{token}"
        Rails.logger.info "Payload: #{payload.to_json}"
        
        response = HTTParty.post(
          N8N_WEBHOOK_URL,
          body: payload.to_json,
          headers: { 
            'Content-Type' => 'application/json',
            'Authorization' => "Bearer #{token}"
          },
          timeout: 30
        )
        
        Rails.logger.info "Respuesta de n8n: #{response.code} - #{response.body}"
        
        if response.success?
          Rails.logger.info "#{action_type} enviado exitosamente a n8n"
          {
            success: true,
            data: begin
              JSON.parse(response.body)
            rescue
              response.body
            end,
            status: response.code
          }
        else
          Rails.logger.error "Error en n8n #{action_type}: #{response.code} - #{response.body}"
          {
            success: false,
            error: "Error en n8n: #{response.code}",
            details: response.body,
            status: response.code
          }
        end
      rescue => e
        Rails.logger.error "=== ERROR EN N8N #{action_type} ==="
        Rails.logger.error "Error: #{e.message}"
        Rails.logger.error "Backtrace: #{e.backtrace.first(5).join('\n')}"
        {
          success: false,
          error: 'Error interno del servidor',
          details: e.message
        }
      end
    end
  end
end
