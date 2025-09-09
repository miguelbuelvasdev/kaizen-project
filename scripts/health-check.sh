#!/bin/bash

# Mini Kaizen Cafetería - Health Check Script
# Autor: Miguel Buelvas

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Verificar si un servicio está saludable
check_service() {
    local url=$1
    local service_name=$2
    local timeout=${3:-10}

    log "Verificando $service_name en $url..."

    if curl -f -s --max-time $timeout "$url" > /dev/null 2>&1; then
        success "$service_name está saludable"
        return 0
    else
        error "$service_name no responde"
        return 1
    fi
}

# Verificar Docker containers
check_containers() {
    log "Verificando contenedores Docker..."

    local containers_up=0
    local total_containers=0

    # Verificar desarrollo
    if docker-compose ps 2>/dev/null | grep -q "Up"; then
        total_containers=$((total_containers + 2))
        if docker-compose ps backend 2>/dev/null | grep -q "Up"; then
            containers_up=$((containers_up + 1))
            success "Backend (desarrollo) ejecutándose"
        else
            error "Backend (desarrollo) no ejecutándose"
        fi

        if docker-compose ps frontend 2>/dev/null | grep -q "Up"; then
            containers_up=$((containers_up + 1))
            success "Frontend (desarrollo) ejecutándose"
        else
            error "Frontend (desarrollo) no ejecutándose"
        fi
    fi

    # Verificar producción
    if docker-compose -f docker-compose.prod.yml ps 2>/dev/null | grep -q "Up"; then
        total_containers=$((total_containers + 2))
        if docker-compose -f docker-compose.prod.yml ps backend 2>/dev/null | grep -q "Up"; then
            containers_up=$((containers_up + 1))
            success "Backend (producción) ejecutándose"
        else
            error "Backend (producción) no ejecutándose"
        fi

        if docker-compose -f docker-compose.prod.yml ps frontend 2>/dev/null | grep -q "Up"; then
            containers_up=$((containers_up + 1))
            success "Frontend (producción) ejecutándose"
        else
            error "Frontend (producción) no ejecutándose"
        fi
    fi

    if [ $total_containers -eq 0 ]; then
        warning "No hay contenedores ejecutándose"
        return 1
    fi

    echo "Contenedores ejecutándose: $containers_up/$total_containers"
    return $((total_containers - containers_up))
}

# Función principal
main() {
    local mode=${1:-"auto"}

    echo "🔍 Verificación de salud - Mini Kaizen Cafetería"
    echo "=============================================="

    local health_status=0

    # Verificar contenedores
    if ! check_containers; then
        health_status=1
    fi

    # Verificar endpoints HTTP
    case $mode in
        "dev")
            log "Verificando endpoints de desarrollo..."
            check_service "http://localhost:8000/health" "Backend API" || health_status=1
            check_service "http://localhost:3000" "Frontend" || health_status=1
            ;;
        "prod")
            log "Verificando endpoints de producción..."
            check_service "http://localhost:8000/health" "Backend API" || health_status=1
            check_service "http://localhost" "Frontend" || health_status=1
            ;;
        "auto")
            # Detectar automáticamente
            if docker-compose ps 2>/dev/null | grep -q "Up"; then
                log "Detectado modo desarrollo"
                check_service "http://localhost:8000/health" "Backend API" || health_status=1
                check_service "http://localhost:3000" "Frontend" || health_status=1
            elif docker-compose -f docker-compose.prod.yml ps 2>/dev/null | grep -q "Up"; then
                log "Detectado modo producción"
                check_service "http://localhost:8000/health" "Backend API" || health_status=1
                check_service "http://localhost" "Frontend" || health_status=1
            else
                warning "No se detectaron servicios ejecutándose"
                health_status=1
            fi
            ;;
        *)
            error "Modo no válido. Use: dev, prod, o auto"
            echo "Uso: $0 [dev|prod|auto]"
            exit 1
            ;;
    esac

    echo ""
    if [ $health_status -eq 0 ]; then
        success "✅ Todos los servicios están saludables"
        exit 0
    else
        error "❌ Algunos servicios no están saludables"
        echo ""
        echo "💡 Sugerencias:"
        echo "   - Verificar logs: ./scripts/logs.sh"
        echo "   - Reiniciar servicios: ./scripts/deploy.sh restart"
        echo "   - Verificar configuración de Docker"
        exit 1
    fi
}

main "$@"
