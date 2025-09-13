class JwtService
  ALGORITHM = 'HS256'
  
  def self.encode(payload)
    JWT.encode(payload, secret, ALGORITHM)
  end
  
  def self.decode(token)
    JWT.decode(token, secret, true, { algorithm: ALGORITHM })
  rescue JWT::DecodeError => e
    Rails.logger.error "JWT decode error: #{e.message}"
    nil
  end
  
  def self.generate_n8n_token
    payload = {
      app: 'maileraction2',
      app_id: 'maileraction2_001',
      domain: 'maileraction2.com',
      ip: '178.156.153.157',
      environment: Rails.env,
      timestamp: Time.current.to_i,
      exp: 1.hour.from_now.to_i,
      version: '2.0'
    }
    encode(payload)
  end
  
  # Método para generar token compatible con versiones anteriores
  def self.generate_legacy_token
    payload = {
      app: 'maileraction2',
      timestamp: Time.current.to_i,
      exp: 1.hour.from_now.to_i,
      version: '1.0'
    }
    encode(payload)
  end
  
  private
  
  def self.secret
    ENV['JWT_SECRET'] || 'fallback_secret_for_development'
  end
end
