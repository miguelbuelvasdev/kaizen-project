# 🚀 Guía de Deployment con Coolify

Esta guía proporciona instrucciones completas para desplegar la aplicación Mini Kaizen Cafetería usando Coolify.

## 📋 Prerrequisitos

- **Cuenta en Coolify** (autohospedado o cloud)
- **Repositorio Git** accesible por Coolify
- **Dominio** configurado (opcional pero recomendado)

## 🏗️ Configuración del Proyecto

### 1. Crear Proyecto en Coolify

1. **Acceder a Coolify**
   - Ve a tu instancia de Coolify
   - Haz clic en "Add Project"

2. **Configurar Proyecto**
   - **Nombre**: `mini-kaizen-cafeteria`
   - **Tipo**: `Docker Compose`
   - **Repositorio**: `https://github.com/miguelbuelvasdev/kaizen-project`
   - **Rama**: `main` (o la rama que uses para producción)

### 2. Configurar Servicios

#### Servicio Frontend

1. **Crear Servicio**
   - Tipo: `Docker Compose`
   - Archivo: `docker-compose.prod.yml`
   - Servicio: `frontend`

2. **Configuración del Servicio**
   ```yaml
   # Configuración automática desde docker-compose.prod.yml
   ports:
     - "80:80"
   environment:
     - VITE_API_URL=https://api.tu-dominio.com
   ```

3. **Configurar Dominio**
   - **Dominio**: `tu-dominio.com` o `app.tu-dominio.com`
   - **SSL**: Habilitar Let's Encrypt
   - **Redirect HTTP to HTTPS**: Habilitar

#### Servicio Backend

1. **Crear Servicio**
   - Tipo: `Docker Compose`
   - Archivo: `docker-compose.prod.yml`
   - Servicio: `backend`

2. **Configuración del Servicio**
   ```yaml
   # Configuración automática desde docker-compose.prod.yml
   ports:
     - "8000:8000"
   environment:
     - ENV=production
     - DEBUG=False
     - PORT=8000
   ```

3. **Configurar Dominio**
   - **Dominio**: `api.tu-dominio.com`
   - **SSL**: Habilitar Let's Encrypt
   - **Health Check**: `/health`

### 3. Variables de Entorno

Configurar las siguientes variables de entorno en Coolify:

#### Variables Globales
```bash
# Entorno
ENV=production
DEBUG=False

# Backend
PORT=8000
PYTHONPATH=/app
PYTHONUNBUFFERED=1

# Frontend
VITE_API_URL=https://api.tu-dominio.com
```

#### Variables de Producción Adicionales (Opcionales)
```bash
# Seguridad
SECRET_KEY=tu-clave-secreta-muy-segura-aqui
ALLOWED_HOSTS=api.tu-dominio.com,www.tu-dominio.com

# Base de datos (si se agrega en el futuro)
DATABASE_URL=postgresql://user:password@db:5432/kaizen_db

# Logging
LOG_LEVEL=INFO
LOG_FILE=/app/logs/app.log
```

## 🚀 Deployment

### Opción 1: Deployment Automático

1. **Push a GitHub**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Coolify detectará** el cambio automáticamente
3. **Build y deploy** se ejecutarán automáticamente

### Opción 2: Deployment Manual

1. **Ir a Coolify Dashboard**
2. **Seleccionar el proyecto**
3. **Haz clic en "Deploy"**
4. **Monitorear el progreso** en los logs

## 🔍 Verificación del Deployment

### 1. Health Checks

```bash
# Verificar backend
curl https://api.tu-dominio.com/health

# Verificar frontend
curl https://tu-dominio.com
```

### 2. Logs

```bash
# Ver logs del backend
docker logs kaizen-backend-prod

# Ver logs del frontend
docker logs kaizen-frontend-prod
```

### 3. Monitoreo

- **Coolify Dashboard**: Estado de servicios
- **Aplicación**: Funcionalidad completa
- **API Documentation**: `https://api.tu-dominio.com/docs`

## 🔧 Configuración Avanzada

### Redes y Comunicación

Los servicios están configurados para comunicarse a través de la red Docker:

```yaml
networks:
  kaizen-network:
    driver: bridge
```

### Volúmenes Persistentes

```yaml
volumes:
  backend-reports:
  backend-static:
```

### Health Checks Automáticos

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## 🛠️ Solución de Problemas

### Error: Build falla

```bash
# Verificar Dockerfile
cat backend/Dockerfile
cat frontend/Dockerfile

# Verificar docker-compose
cat docker-compose.prod.yml
```

### Error: Servicio no inicia

```bash
# Verificar logs
docker logs <container-name>

# Verificar configuración
docker inspect <container-name>
```

### Error: Comunicación entre servicios

```bash
# Verificar red Docker
docker network ls
docker network inspect kaizen-network

# Verificar conectividad
docker exec kaizen-frontend-prod curl http://backend:8000/health
```

### Error: Variables de entorno

```bash
# Verificar variables en Coolify
# Ir a Project Settings > Environment Variables

# Verificar en contenedor
docker exec kaizen-backend-prod env | grep ENV
```

## 📊 Monitoreo y Mantenimiento

### Logs en Coolify

1. **Ir al proyecto** en Coolify
2. **Seleccionar servicio**
3. **Ver "Logs"** tab
4. **Configurar log rotation** si es necesario

### Backups

```bash
# Backup de volúmenes
docker run --rm -v kaizen-backend-reports:/data -v $(pwd):/backup alpine tar czf /backup/backup-reports.tar.gz -C /data .
```

### Actualizaciones

```bash
# Actualizar aplicación
git pull origin main
git push origin main

# Coolify detectará cambios y redeploy automáticamente
```

## 🔒 Seguridad

### Configuraciones de Producción

1. **SSL/TLS**: Habilitado automáticamente por Coolify
2. **Firewall**: Configurado por Coolify
3. **Variables sensibles**: Nunca en código, usar env vars
4. **Actualizaciones**: Mantener dependencias actualizadas

### Mejores Prácticas

- **Secrets**: Usar Coolify secrets para claves sensibles
- **Backups**: Configurar backups automáticos
- **Monitoring**: Configurar alertas en Coolify
- **Updates**: Mantener imagen base actualizada

## 📈 Escalabilidad

### Recursos

Configurar límites de recursos en Coolify:

```yaml
# Backend
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M

# Frontend
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

### Escalado Horizontal

Para múltiples instancias:

1. **Configurar load balancer** en Coolify
2. **Aumentar réplicas** del servicio
3. **Configurar session affinity** si es necesario

## 📞 Soporte

### Recursos Adicionales

- **Coolify Documentation**: [docs.coolify.io](https://docs.coolify.io)
- **Docker Documentation**: [docs.docker.com](https://docs.docker.com)
- **FastAPI Documentation**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **React Documentation**: [react.dev](https://react.dev)

### Contacto

- **Autor**: Miguel Buelvas
- **Email**: contacto@miguelbuelvasdev.com
- **GitHub**: [github.com/miguelbuelvasdev](https://github.com/miguelbuelvasdev)
- **LinkedIn**: [linkedin.com/in/miguelbuelvasdev](https://linkedin.com/in/miguelbuelvasdev)

## ✅ Checklist de Deployment

- [ ] Proyecto creado en Coolify
- [ ] Repositorio Git conectado
- [ ] Servicios frontend y backend configurados
- [ ] Variables de entorno configuradas
- [ ] Dominios configurados
- [ ] SSL habilitado
- [ ] Health checks funcionando
- [ ] Aplicación accesible
- [ ] API funcionando correctamente
- [ ] Logs configurados
- [ ] Backups configurados (opcional)
- [ ] Monitoreo configurado

¡Tu aplicación Mini Kaizen Cafetería está lista para producción! 🎉
