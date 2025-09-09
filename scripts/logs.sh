#!/bin/bash

# Mini Kaizen Cafetería - Logs Script
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

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Función principal
main() {
    local service=${1:-"all"}
    local lines=${2:-"100"}

    log "Mostrando logs (últimas $lines líneas)..."

    case $service in
        "backend")
            log "Logs del backend..."
            docker-compose logs --tail="$lines" -f backend
            ;;
        "frontend")
            log "Logs del frontend..."
            docker-compose logs --tail="$lines" -f frontend
            ;;
        "all")
            log "Logs de todos los servicios..."
            docker-compose logs --tail="$lines" -f
            ;;
        *)
            error "Servicio no válido. Use: backend, frontend, o all"
            echo "Uso: $0 [backend|frontend|all] [número de líneas]"
            exit 1
            ;;
    esac
}

main "$@"
