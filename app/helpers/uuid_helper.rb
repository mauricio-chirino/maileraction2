module UuidHelper
  # Genera un UUID v4 único
  def generate_uuid
    SecureRandom.uuid
  end

  # Genera un UUID corto (8 caracteres) para referencias internas
  def generate_short_uuid
    SecureRandom.hex(4)
  end

  # Valida si un string es un UUID válido
  def valid_uuid?(uuid)
    uuid.match?(/\A[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\z/i)
  end

  # Formatea un UUID para mostrar (con guiones)
  def format_uuid(uuid)
    return nil unless uuid
    uuid.to_s.downcase
  end

  # Genera un UUID para uso en URLs (sin guiones)
  def uuid_for_url(uuid)
    return nil unless uuid
    uuid.to_s.gsub('-', '')
  end
end
