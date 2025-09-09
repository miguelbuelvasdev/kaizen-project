#!/bin/bash

# Script para monitorear logs de Mini Kaizen Cafetería
# Uso: ./scripts/logs.sh [servicio] [líneas]

SERVICE=${1:-all}
LINES=${2:-50}
COMPOSE_FILE="docker-compose.yml"

# Detectar si estamos en producción
if [ -f "docker-compose.prod.yml" ] && [ "$ENV" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

echo "📋 Mostrando logs de: $SERVICE"
echo "📄 Archivo compose: $COMPOSE_FILE"
echo "📏 Últimas $LINES líneas"
echo "----------------------------------------"

case $SERVICE in
    "backend"|"kaizen-backend")
        docker-compose -f $COMPOSE_FILE logs -f --tail=$LINES backend
        ;;
    "frontend"|"kaizen-frontend")
        docker-compose -f $COMPOSE_FILE logs -f --tail=$LINES frontend
        ;;
    "all"|*)
        docker-compose -f $COMPOSE_FILE logs -f --tail=$LINES
        ;;
esac
