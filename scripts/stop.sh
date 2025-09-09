#!/bin/bash

# Mini Kaizen Cafetería - Stop Script
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

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Función principal
main() {
    local mode=${1:-"all"}

    case $mode in
        "dev")
            log "Deteniendo servicios de desarrollo..."
            docker-compose down
            success "Servicios de desarrollo detenidos"
            ;;
        "prod")
            log "Deteniendo servicios de producción..."
            docker-compose -f docker-compose.prod.yml down
            success "Servicios de producción detenidos"
            ;;
        "all")
            log "Deteniendo todos los servicios..."

            # Detener desarrollo
            if docker-compose ps | grep -q "Up"; then
                docker-compose down
                success "Servicios de desarrollo detenidos"
            else
                warning "No hay servicios de desarrollo ejecutándose"
            fi

            # Detener producción
            if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
                docker-compose -f docker-compose.prod.yml down
                success "Servicios de producción detenidos"
            else
                warning "No hay servicios de producción ejecutándose"
            fi
            ;;
        *)
            error "Modo no válido. Use: dev, prod, o all"
            echo "Uso: $0 [dev|prod|all]"
            exit 1
            ;;
    esac
}

main "$@"
