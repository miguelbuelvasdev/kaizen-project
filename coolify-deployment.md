# 🚀 Guía de Deployment en Coolify

Esta guía te ayudará a desplegar la aplicación Mini Kaizen Cafetería en Coolify.

## 📋 Prerrequisitos

1. **Cuenta en Coolify**: Asegúrate de tener acceso a un servidor Coolify
2. **Repositorio Git**: Tu código debe estar en un repositorio Git accesible
3. **Dominio**: Opcional, pero recomendado para producción

## 🏗️ Configuración del Proyecto en Coolify

### Paso 1: Crear Nuevo Proyecto

1. Ve a tu panel de Coolify
2. Haz clic en "New Project"
3. Selecciona "From Git Repository"
4. Ingresa la URL de tu repositorio
5. Configura la rama (generalmente `main` o `master`)

### Paso 2: Configurar Servicios

#### Backend Service

1. **Crear Servicio**:
   - Nombre: `kaizen-backend`
   - Tipo: `Docker Compose`
   - Archivo: `docker-compose.prod.yml`

2. **Configuración del Servicio**:
   - **Build Context**: `./backend`
   - **Dockerfile Path**: `./backend/Dockerfile`
   - **Container Port**: `8000`
   - **Domain**: `api.tu-dominio.com` (opcional)

3. **Variables de Entorno**:
   ```
   ENV=production
   DEBUG=False
   PORT=8000
   PYTHONPATH=/app
   PYTHONUNBUFFERED=1
   ```

4. **Health Check**:
   - URL: `/health`
   - Método: `GET`
   - Intervalo: `30s`

#### Frontend Service

1. **Crear Servicio**:
   - Nombre: `kaizen-frontend`
   - Tipo: `Docker Compose`
   - Archivo: `docker-compose.prod.yml`

2. **Configuración del Servicio**:
   - **Build Context**: `./frontend`
   - **Dockerfile Path**: `./frontend/Dockerfile`
   - **Container Port**: `80`
   - **Domain**: `tu-dominio.com` (principal)

3. **Variables de Entorno**:
   ```
   VITE_API_URL=https://api.tu-dominio.com
   ```

4. **Configuración de Nginx**:
   - El archivo `nginx.conf` ya está configurado para producción
   - Incluye proxy reverso para la API

### Paso 3: Configurar Base de Datos (Opcional)

Si necesitas persistencia de datos en el futuro:

1. Agrega un servicio PostgreSQL
2. Configura las variables de entorno:
   ```
   DATABASE_URL=postgresql://user:password@db:5432/kaizen_db
   ```

### Paso 4: Configurar Redes y Volúmenes

1. **Redes**:
   - Crea una red llamada `kaizen-network`
   - Conecta ambos servicios a esta red

2. **Volúmenes**:
   - `backend-reports`: Para almacenar reportes generados
   - `backend-static`: Para archivos estáticos

## 🔧 Configuración de Build

### Backend Build Settings

```yaml
# En docker-compose.prod.yml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  environment:
    - ENV=production
    - DEBUG=False
```

### Frontend Build Settings

```yaml
# En docker-compose.prod.yml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
  environment:
    - VITE_API_URL=https://api.tu-dominio.com
```

## 🌐 Configuración de Dominios

### Dominio Principal (Frontend)

1. Ve a la configuración del servicio frontend
2. Agrega tu dominio principal
3. Coolify generará automáticamente el certificado SSL

### Subdominio API (Backend)

1. Ve a la configuración del servicio backend
2. Agrega el subdominio `api.tu-dominio.com`
3. Asegúrate de que apunte al puerto 8000

## 🔒 Variables de Entorno de Producción

Crea un archivo `.env` en tu repositorio con:

```bash
# Copia .env.example a .env
cp .env.example .env

# Edita las variables según tu configuración
ENV=production
DEBUG=False
VITE_API_URL=https://api.tu-dominio.com
```

## 🚀 Proceso de Deployment

1. **Push a Git**: Haz commit y push de todos los cambios
2. **Trigger Build**: Coolify detectará el push y comenzará el build
3. **Monitoreo**: Ve los logs en tiempo real
4. **Verificación**: Una vez completado, verifica que ambos servicios estén corriendo

## 📊 Monitoreo y Logs

### Verificar Estado de Servicios

```bash
# Desde Coolify dashboard
- Revisa el estado de cada servicio
- Verifica los logs de build y runtime
- Monitorea el uso de recursos
```

### Logs de Aplicación

- **Backend**: Logs de FastAPI/Uvicorn
- **Frontend**: Logs de Nginx
- **Build**: Logs del proceso de construcción

## 🔧 Solución de Problemas

### Error: "Connection refused"

- Verifica que ambos servicios estén en la misma red
- Confirma las variables de entorno `VITE_API_URL`

### Error: "Build failed"

- Revisa los logs de build
- Verifica que todas las dependencias estén en `requirements.txt` y `package.json`
- Asegúrate de que los Dockerfiles sean válidos

### Error: "Port already in use"

- Cambia los puertos en `docker-compose.prod.yml`
- Asegúrate de que no haya conflictos de puertos

## 📈 Optimizaciones de Producción

### Backend

- **Workers**: Configurado para 4 workers en producción
- **Gunicorn**: Considera usar Gunicorn en lugar de Uvicorn para más estabilidad
- **Caching**: Implementa Redis para caching si es necesario

### Frontend

- **Build optimizado**: Vite genera builds optimizados
- **CDN**: Considera usar CDN para assets estáticos
- **Compression**: Nginx ya tiene gzip habilitado

## 🔄 Actualizaciones

### Deploy Automático

1. Push a la rama configurada
2. Coolify detectará cambios automáticamente
3. Se ejecutará el build y deployment

### Rollback

- Coolify mantiene versiones anteriores
- Puedes hacer rollback desde el dashboard

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs detalladamente
2. Verifica la documentación de Coolify
3. Consulta los issues del proyecto
4. Contacta al equipo de desarrollo

---

¡Tu aplicación Mini Kaizen Cafetería está lista para producción! 🎉
