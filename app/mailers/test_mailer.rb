class TestMailer < ApplicationMailer
  def test_email
    mail(
      to: 'admin@maileraction.com',
      subject: 'Prueba de correo desde MailerAction',
      from: 'admin@maileraction.com'
    )
  end
end
