class TestController < ApplicationController
  def send_test_email
    begin
      TestMailer.test_email.deliver_now
      render json: { status: 'success', message: 'Correo enviado exitosamente' }
    rescue => e
      render json: { status: 'error', message: e.message }
    end
  end
end
