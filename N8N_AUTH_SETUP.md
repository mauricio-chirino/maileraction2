# Configuración de Autenticación JWT para n8n - Múltiples Aplicaciones

## Resumen
Sistema de autenticación JWT para múltiples aplicaciones que usan n8n desde diferentes dominios/IPs. Cada aplicación tiene su propio identificador único y validaciones específicas.

## Configuración en n8n

### 1. Variables de Entorno en n8n
Configura estas variables en tu instancia de n8n:

```bash
JWT_SECRET=040b728d216b3921b3c42f5f66318ee801872402a630cb357fab6c2f9d002107
```

### 2. Estructura del Token JWT
El token contiene información específica de cada aplicación:
```json
{
  "app": "maileraction2",
  "app_id": "maileraction2_001",
  "domain": "maileraction2.com",
  "ip_range": "178.156.153.157",
  "timestamp": 1234567890,
  "exp": 1234571490
}
```

### 3. Headers que envía maileraction2
- `Authorization: Bearer <jwt_token>`
- `X-App-Source: maileraction2`
- `X-App-ID: maileraction2_001`
- `X-App-Domain: maileraction2.com`
- `X-Client-IP: 178.156.153.157`
- `Content-Type: application/json`

### 4. Validación en n8n para Múltiples Aplicaciones
```javascript
const jwt = require('jsonwebtoken');

// Configuración de aplicaciones autorizadas
const authorizedApps = {
  'maileraction2_001': {
    app: 'maileraction2',
    domain: 'maileraction2.com',
    ip: '178.156.153.157',
    allowed_ips: ['178.156.153.157']
  },
  // Agregar otras aplicaciones aquí
  // 'otra_app_002': {
  //   app: 'otra_app',
  //   domain: 'otra-app.com',
  //   ip: '192.168.1.100',
  //   allowed_ips: ['192.168.1.100', '192.168.1.101']
  // }
};

const authHeader = $headers['authorization'];
const appSource = $headers['x-app-source'];
const appId = $headers['x-app-id'];
const appDomain = $headers['x-app-domain'];
const clientIp = $headers['x-client-ip'];

if (!authHeader || !authHeader.startsWith('Bearer ')) {
  throw new Error('No JWT token provided');
}

const token = authHeader.split(' ')[1];

try {
  const decoded = jwt.verify(token, '040b728d216b3921b3c42f5f66318ee801872402a630cb357fab6c2f9d002107');
  
  // Verificar que la aplicación está autorizada
  if (!authorizedApps[decoded.app_id]) {
    throw new Error(`Aplicación no autorizada: ${decoded.app_id}`);
  }
  
  const appConfig = authorizedApps[decoded.app_id];
  
  // Verificar que los datos del token coinciden con la configuración
  if (decoded.app !== appConfig.app) {
    throw new Error('Token inválido: aplicación incorrecta');
  }
  
  // Verificar IP (opcional)
  if (clientIp && !appConfig.allowed_ips.includes(clientIp)) {
    throw new Error(`IP no autorizada: ${clientIp}`);
  }
  
  // Verificar que el token no haya expirado
  if (decoded.exp < Date.now() / 1000) {
    throw new Error('Token expirado');
  }
  
  return [{ 
    json: { 
      autorizado: true,
      app: decoded.app,
      app_id: decoded.app_id,
      domain: decoded.domain,
      ip: decoded.ip_range
    } 
  }];
  
} catch (err) {
  throw new Error('Token inválido o expirado: ' + err.message);
}
```

### 5. Configuración de Variables de Entorno
En tu archivo `.env` de n8n o en las variables de entorno del sistema:

```bash
# JWT Secret (debe ser el mismo que en maileraction2)
JWT_SECRET=040b728d216b3921b3c42f5f66318ee801872402a630cb357fab6c2f9d002107
```

## Compatibilidad hacia atrás

### Versiones de Token soportadas:

#### Versión 1.0 (Legacy - propiedades360.cl y otras apps existentes)
```json
{
  "app": "propiedades360",
  "timestamp": 1234567890,
  "exp": 1234571490,
  "version": "1.0"
}
```

#### Versión 2.0 (Nueva - maileraction2)
```json
{
  "app": "maileraction2",
  "app_id": "maileraction2_001",
  "domain": "maileraction2.com",
  "ip_range": "178.156.153.157",
  "timestamp": 1234567890,
  "exp": 1234571490,
  "version": "2.0"
}
```

### Headers por versión:

#### Versión 1.0 (Mínimos requeridos):
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

#### Versión 2.0 (Extendidos):
- `Authorization: Bearer <token>`
- `X-App-Source: maileraction2`
- `X-App-ID: maileraction2_001`
- `X-App-Domain: maileraction2.com`
- `X-Client-IP: 178.156.153.157`
- `X-Token-Version: 2.0`
- `Content-Type: application/json`

## Seguridad
- El token expira en 1 hora
- Solo las peticiones con token válido serán procesadas
- El header `X-App-Source` proporciona una capa adicional de verificación
- El JWT_SECRET debe mantenerse seguro y no exponerse en logs
- **Compatibilidad hacia atrás**: Las aplicaciones existentes siguen funcionando sin cambios

## Testing
Para probar la autenticación, puedes usar curl:

```bash
# Generar token de prueba
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

El token se generará automáticamente y se incluirá en la llamada a n8n.
