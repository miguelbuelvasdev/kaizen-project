#!/bin/bash

# Script para detener los servicios
# Uso: ./scripts/stop.sh [dev|prod]

ENVIRONMENT=${1:-dev}
PROJECT_NAME="mini-kaizen-cafeteria"

echo "🛑 Deteniendo servicios de $PROJECT_NAME en modo: $ENVIRONMENT"

if [ "$ENVIRONMENT" = "prod" ]; then
    docker-compose -f docker-compose.prod.yml -p $PROJECT_NAME down --volumes --remove-orphans
else
    docker-compose -p $PROJECT_NAME down --volumes --remove-orphans
fi

echo "✅ Servicios detenidos y volúmenes limpiados"
