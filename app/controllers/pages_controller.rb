class PagesController < ApplicationController
  # Deshabilitar CSRF para submit_contact (solo para testing)
  skip_before_action :verify_authenticity_token, only: [:submit_contact]
  
  def home
  end
  
  def contact
  end
  
  def submit_contact
    # Datos del formulario - los parámetros pueden venir directamente o anidados
    contact_data = {
      name: params[:name] || params[:page][:name],
      email: params[:email] || params[:page][:email],
      phone: params[:phone] || params[:page][:phone],
      company: params[:company] || params[:page][:company],
      message: params[:message] || params[:page][:message],
      timestamp: Time.current.iso8601
    }
    
    Rails.logger.info "=== PARÁMETROS RECIBIDOS ==="
    Rails.logger.info "Params: #{params.inspect}"
    Rails.logger.info "Contact data: #{contact_data.inspect}"
    Rails.logger.info "=== INICIANDO LLAMADA A N8N ==="
    


    



    # Enviar a n8n webhook
    begin
      Rails.logger.info "=== ENVIANDO A N8N ==="
      Rails.logger.info "Datos: #{contact_data.to_json}"
      
      response = HTTParty.post(
        'https://n8n.aniracloud.com/n8n/webhook/submit/7b9e1f4a-3c2d-4e6f-9a1d-8f2c3e7a9d1b',
        body: contact_data.to_json,
        headers: { 
          'Content-Type' => 'application/json'
        }
      )
      
      Rails.logger.info "Respuesta de n8n: #{response.code} - #{response.body}"
      
      if response.success?
        flash[:success] = '¡Gracias por tu mensaje! Te contactaremos pronto.'
        redirect_to root_path
      else
        flash[:error] = 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.'
        redirect_to root_path
      end
    rescue => e
      Rails.logger.error "=== ERROR EN N8N ==="
      Rails.logger.error "Error: #{e.message}"
      Rails.logger.error "Backtrace: #{e.backtrace.first(5).join('\n')}"
      flash[:error] = 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.'
      redirect_to root_path
    end
  end
end
