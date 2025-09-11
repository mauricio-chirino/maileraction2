class PagesController < ApplicationController
  def home
  end
  
  def contact
  end
  
  def submit_contact
    # Datos del formulario
    contact_data = {
      name: params[:name],
      email: params[:email],
      phone: params[:phone],
      company: params[:company],
      message: params[:message],
      timestamp: Time.current.iso8601
    }
    
    # Enviar a n8n webhook
    begin
      response = HTTParty.post(
        'https://n8n.aniracloud.com/webhook/contact-form',
        body: contact_data.to_json,
        headers: { 'Content-Type' => 'application/json' }
      )
      
      if response.success?
        flash[:success] = '¡Gracias por tu mensaje! Te contactaremos pronto.'
        redirect_to contact_path
      else
        flash[:error] = 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.'
        redirect_to contact_path
      end
    rescue => e
      flash[:error] = 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.'
      redirect_to contact_path
    end
  end
end
