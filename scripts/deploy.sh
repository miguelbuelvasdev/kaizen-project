#!/bin/bash

# Mini Kaizen Cafetería - Deployment Script
# Autor: Miguel Buelvas
# Email: contacto@miguelbuelvasdev.com

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función de logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función de ayuda
show_help() {
    echo "Mini Kaizen Cafetería - Deployment Script"
    echo ""
    echo "Uso: $0 [opción]"
    echo ""
    echo "Opciones:"
    echo "  dev       Desplegar en modo desarrollo"
    echo "  prod      Desplegar en modo producción"
    echo "  build     Construir imágenes Docker"
    echo "  stop      Detener todos los servicios"
    echo "  restart   Reiniciar servicios"
    echo "  logs      Ver logs de servicios"
    echo "  clean     Limpiar contenedores e imágenes"
    echo "  help      Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 dev          # Desplegar desarrollo"
    echo "  $0 prod         # Desplegar producción"
    echo "  $0 logs backend # Ver logs del backend"
    echo ""
}

# Verificar dependencias
check_dependencies() {
    log "Verificando dependencias..."

    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado. Instálalo desde https://docker.com"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose no está instalado"
        exit 1
    fi

    success "Dependencias verificadas"
}

# Construir imágenes
build_images() {
    log "Construyendo imágenes Docker..."

    # Backend
    log "Construyendo imagen del backend..."
    docker build -t kaizen-backend:latest ./backend

    # Frontend
    log "Construyendo imagen del frontend..."
    docker build -t kaizen-frontend:latest ./frontend

    success "Imágenes construidas exitosamente"
}

# Desplegar desarrollo
deploy_dev() {
    log "Desplegando en modo desarrollo..."

    # Crear archivo .env si no existe
    if [ ! -f .env ]; then
        warning "Creando archivo .env desde .env.example..."
        cp .env.example .env
    fi

    # Desplegar servicios
    docker-compose up -d --build

    # Esperar a que los servicios estén listos
    log "Esperando a que los servicios estén listos..."
    sleep 10

    # Verificar estado
    check_services

    success "Despliegue en desarrollo completado"
    show_endpoints "dev"
}

# Desplegar producción
deploy_prod() {
    log "Desplegando en modo producción..."

    # Crear archivo .env si no existe
    if [ ! -f .env ]; then
        warning "Creando archivo .env desde .env.example..."
        cp .env.example .env
        warning "Revisa y configura las variables en .env antes de continuar"
    fi

    # Desplegar servicios
    docker-compose -f docker-compose.prod.yml up -d --build

    # Esperar a que los servicios estén listos
    log "Esperando a que los servicios estén listos..."
    sleep 15

    # Verificar estado
    check_services_prod

    success "Despliegue en producción completado"
    show_endpoints "prod"
}

# Verificar servicios desarrollo
check_services() {
    log "Verificando servicios..."

    # Backend
    if docker-compose ps backend | grep -q "Up"; then
        success "Backend está ejecutándose"
    else
        error "Backend no está ejecutándose"
        docker-compose logs backend
        exit 1
    fi

    # Frontend
    if docker-compose ps frontend | grep -q "Up"; then
        success "Frontend está ejecutándose"
    else
        error "Frontend no está ejecutándose"
        docker-compose logs frontend
        exit 1
    fi
}

# Verificar servicios producción
check_services_prod() {
    log "Verificando servicios de producción..."

    # Backend
    if docker-compose -f docker-compose.prod.yml ps backend | grep -q "Up"; then
        success "Backend de producción está ejecutándose"
    else
        error "Backend de producción no está ejecutándose"
        docker-compose -f docker-compose.prod.yml logs backend
        exit 1
    fi

    # Frontend
    if docker-compose -f docker-compose.prod.yml ps frontend | grep -q "Up"; then
        success "Frontend de producción está ejecutándose"
    else
        error "Frontend de producción no está ejecutándose"
        docker-compose -f docker-compose.prod.yml logs frontend
        exit 1
    fi
}

# Mostrar endpoints
show_endpoints() {
    local mode=$1

    echo ""
    echo "🎉 Aplicación desplegada exitosamente!"
    echo ""

    if [ "$mode" = "dev" ]; then
        echo "📱 Endpoints de desarrollo:"
        echo "   Frontend:    http://localhost:3000"
        echo "   Backend:     http://localhost:8000"
        echo "   API Docs:    http://localhost:8000/docs"
        echo "   Health:      http://localhost:8000/health"
    else
        echo "🌐 Endpoints de producción:"
        echo "   Frontend:    http://localhost"
        echo "   Backend:     http://localhost:8000"
        echo "   API Docs:    http://localhost:8000/docs"
        echo "   Health:      http://localhost:8000/health"
    fi

    echo ""
    echo "📊 Comandos útiles:"
    echo "   Ver logs:     $0 logs"
    echo "   Detener:      $0 stop"
    echo "   Reiniciar:    $0 restart"
    echo ""
}

# Ver logs
show_logs() {
    local service=${1:-"all"}

    if [ "$service" = "all" ]; then
        log "Mostrando logs de todos los servicios..."
        docker-compose logs -f --tail=100
    elif [ "$service" = "backend" ]; then
        log "Mostrando logs del backend..."
        docker-compose logs -f --tail=100 backend
    elif [ "$service" = "frontend" ]; then
        log "Mostrando logs del frontend..."
        docker-compose logs -f --tail=100 frontend
    else
        error "Servicio no válido. Use: backend, frontend, o all"
        exit 1
    fi
}

# Detener servicios
stop_services() {
    log "Deteniendo servicios..."

    # Intentar detener ambos modos
    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

    success "Servicios detenidos"
}

# Reiniciar servicios
restart_services() {
    log "Reiniciando servicios..."

    # Intentar reiniciar desarrollo
    if docker-compose ps | grep -q "Up"; then
        docker-compose restart
        success "Servicios de desarrollo reiniciados"
    # Intentar reiniciar producción
    elif docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
        docker-compose -f docker-compose.prod.yml restart
        success "Servicios de producción reiniciados"
    else
        warning "No hay servicios ejecutándose"
    fi
}

# Limpiar contenedores e imágenes
clean_up() {
    log "Limpiando contenedores e imágenes..."

    # Detener y remover contenedores
    docker-compose down --volumes --remove-orphans 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down --volumes --remove-orphans 2>/dev/null || true

    # Remover imágenes
    docker image rm kaizen-backend:latest 2>/dev/null || true
    docker image rm kaizen-frontend:latest 2>/dev/null || true

    # Limpiar sistema Docker
    docker system prune -f

    success "Limpieza completada"
}

# Función principal
main() {
    local command=${1:-"help"}

    case $command in
        "dev")
            check_dependencies
            deploy_dev
            ;;
        "prod")
            check_dependencies
            deploy_prod
            ;;
        "build")
            check_dependencies
            build_images
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "logs")
            show_logs $2
            ;;
        "clean")
            clean_up
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Ejecutar función principal
main "$@"
