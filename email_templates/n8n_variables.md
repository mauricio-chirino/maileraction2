# Variables para Email de Confirmación - n8n

## Variables Disponibles

Las siguientes variables deben ser reemplazadas en los templates de email:

### Variables del Usuario
- `{{name}}` - Nombre del usuario
- `{{email}}` - Email del usuario
- `{{website}}` - Sitio web de la empresa
- `{{uuid}}` - UUID único del usuario
- `{{registration_date}}` - Fecha de registro (formato legible)

### Variables del Sistema
- `{{confirmation_url}}` - URL completa para confirmar la cuenta
- `{{confirmation_token}}` - Token de confirmación
- `{{website_url}}` - URL del sitio web de MailerAction
- `{{support_url}}` - URL de soporte
- `{{privacy_url}}` - URL de política de privacidad

## Ejemplo de URL de Confirmación

```
{{confirmation_url}} = https://maileraction.com/users/confirmation?confirmation_token={{confirmation_token}}
```

## Payload Recibido de Rails

```json
{
  "name": "Marco Chirino",
  "email": "mchirino@aniracloud.com",
  "website": "http://aniracloud.com",
  "user_uuid": "37ade7ab-b338-4380-8e9a-ae13f0efc34f",
  "confirmation_token": "Bggro-TXUvUsgN7bAFNq",
  "timestamp": "2025-09-15T05:30:00Z",
  "action": "resend_confirmation"
}
```

## Configuración en n8n

### 1. Extraer Variables del Payload
- `name` = `{{$json.name}}`
- `email` = `{{$json.email}}`
- `website` = `{{$json.website}}`
- `uuid` = `{{$json.user_uuid}}`
- `confirmation_token` = `{{$json.confirmation_token}}`

### 2. Generar Variables Adicionales
- `registration_date` = Formatear timestamp actual
- `confirmation_url` = Construir URL completa con token

### 3. Configurar Email
- **Asunto**: "Confirma tu cuenta - MailerAction"
- **Remitente**: "MailerAction <noreply@maileraction.com>"
- **Destinatario**: `{{email}}`
- **Template HTML**: Usar confirmation_email.html
- **Template Texto**: Usar confirmation_email.txt

## Ejemplo de Implementación en n8n

```javascript
// Generar URL de confirmación
const confirmation_url = `https://maileraction.com/users/confirmation?confirmation_token=${$json.confirmation_token}`;

// Formatear fecha
const registration_date = new Date().toLocaleDateString('es-ES', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

return {
  name: $json.name,
  email: $json.email,
  website: $json.website,
  uuid: $json.user_uuid,
  confirmation_token: $json.confirmation_token,
  confirmation_url,
  registration_date,
  website_url: 'https://maileraction.com',
  support_url: 'https://maileraction.com/support',
  privacy_url: 'https://maileraction.com/privacy'
};
```

## Validaciones Recomendadas

1. **Verificar que el usuario existe** en la base de datos
2. **Validar que no está confirmado** ya
3. **Verificar que el token es válido**
4. **Comprobar que no ha expirado** (24 horas)

## Logging Recomendado

- Log de envío exitoso
- Log de errores de envío
- Log de confirmaciones procesadas
- Log de tokens expirados
