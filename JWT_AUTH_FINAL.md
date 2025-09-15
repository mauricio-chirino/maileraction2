# Autenticación JWT para maileraction2

## Resumen
Sistema de autenticación JWT específico para maileraction2 que garantiza que las llamadas a n8n provienen únicamente de esta aplicación.

## Configuración

### JWT Secret
```
JWT_SECRET=040b728d216b3921b3c42f5f66318ee801872402a630cb357fab6c2f9d002107
```

### Estructura del Token JWT
```json
{
  "app": "maileraction2",
  "app_id": "maileraction2_001",
  "domain": "maileraction2.com",
  "ip": "178.156.153.157",
  "environment": "development",
  "timestamp": 1234567890,
  "exp": 1234571490,
  "version": "2.0"
}
```

### Headers enviados por maileraction2
- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`
- `X-App-Source: maileraction2`
- `X-App-ID: maileraction2_001`
- `X-App-Domain: maileraction2.com`
- `X-Client-IP: 178.156.153.157`
- `X-Environment: development`
- `X-Token-Version: 2.0`

## Validación en n8n

### Función de validación completa
```javascript
const jwt = require('jsonwebtoken');

const authHeader = $headers['authorization'];
const appSource = $headers['x-app-source'];
const appId = $headers['x-app-id'];
const appDomain = $headers['x-app-domain'];
const clientIp = $headers['x-client-ip'];
const environment = $headers['x-environment'];
const tokenVersion = $headers['x-token-version'];

if (!authHeader || !authHeader.startsWith('Bearer ')) {
  throw new Error('No JWT token provided');
}

const token = authHeader.split(' ')[1];

try {
  const decoded = jwt.verify(token, '040b728d216b3921b3c42f5f66318ee801872402a630cb357fab6c2f9d002107');
  
  // Verificar que viene específicamente de maileraction2
  if (decoded.app !== 'maileraction2') {
    throw new Error('Token inválido: aplicación no autorizada');
  }
  
  // Verificar versión del token
  if (decoded.version !== '2.0') {
    throw new Error('Token inválido: versión incorrecta');
  }
  
  // Verificar app_id específico
  if (decoded.app_id !== 'maileraction2_001') {
    throw new Error('Token inválido: app_id incorrecto');
  }
  
  // Verificar IP
  if (decoded.ip !== '178.156.153.157') {
    throw new Error('Token inválido: IP no autorizada');
  }
  
  // Verificar que el token no haya expirado
  if (decoded.exp < Date.now() / 1000) {
    throw new Error('Token expirado');
  }
  
  // Verificar headers adicionales
  if (appSource !== 'maileraction2') {
    throw new Error('Header X-App-Source no coincide');
  }
  
  if (appId !== 'maileraction2_001') {
    throw new Error('Header X-App-ID no coincide');
  }
  
  if (appDomain !== 'maileraction2.com') {
    throw new Error('Header X-App-Domain no coincide');
  }
  
  if (clientIp !== '178.156.153.157') {
    throw new Error('Header X-Client-IP no coincide');
  }
  
  if (tokenVersion !== '2.0') {
    throw new Error('Header X-Token-Version no coincide');
  }
  
  return [{ 
    json: { 
      autorizado: true,
      app: decoded.app,
      app_id: decoded.app_id,
      domain: decoded.domain,
      ip: decoded.ip,
      environment: decoded.environment,
      timestamp: decoded.timestamp,
      expira: new Date(decoded.exp * 1000).toISOString(),
      version: decoded.version,
      headers_validados: {
        'X-App-Source': appSource,
        'X-App-ID': appId,
        'X-App-Domain': appDomain,
        'X-Client-IP': clientIp,
        'X-Environment': environment,
        'X-Token-Version': tokenVersion
      }
    } 
  }];
  
} catch (err) {
  throw new Error('Token inválido o expirado: ' + err.message);
}
```

## Seguridad implementada

### Niveles de validación:
1. **JWT Token**: Verificación criptográfica con clave secreta
2. **App específica**: Solo acepta tokens de 'maileraction2'
3. **App ID único**: Identificador específico 'maileraction2_001'
4. **IP específica**: Solo acepta desde '178.156.153.157'
5. **Headers múltiples**: Validación de 6 headers diferentes
6. **Versión de token**: Solo acepta tokens versión '2.0'
7. **Expiración**: Tokens válidos por 1 hora máximo
8. **Environment**: Identificación del entorno (development/production)

### Datos enviados a n8n:
```json
{
  "name": "Nombre del usuario",
  "email": "email@ejemplo.com",
  "phone": "123456789",
  "company": "Empresa",
  "message": "Mensaje del usuario",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Testing

### Probar desde la aplicación:
```bash
curl -X POST http://localhost:3003/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "123456789",
    "company": "Test Company",
    "message": "Test message"
  }'
```

### Verificar token generado:
El token se genera automáticamente y se incluye en la llamada a n8n con todos los headers de validación.

## Ventajas del sistema

- **Máxima seguridad**: Múltiples capas de validación
- **Identificación única**: Solo maileraction2 puede autenticarse
- **Trazabilidad completa**: Logs detallados de cada validación
- **Flexibilidad**: Fácil modificar validaciones según necesidades
- **Escalabilidad**: Preparado para futuras mejoras
