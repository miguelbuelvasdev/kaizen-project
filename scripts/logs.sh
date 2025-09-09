#!/bin/bash

# Script para ver logs de los servicios
# Uso: ./scripts/logs.sh [backend|frontend|all]

SERVICE=${1:-all}
PROJECT_NAME="mini-kaizen-cafeteria"

echo "📋 Mostrando logs del servicio: $SERVICE"

case "$SERVICE" in
    backend)
        docker-compose -p $PROJECT_NAME logs -f backend
        ;;
    frontend)
        docker-compose -p $PROJECT_NAME logs -f frontend
        ;;
    all)
        docker-compose -p $PROJECT_NAME logs -f
        ;;
    *)
        echo "❌ Servicio no válido. Usa: backend, frontend, o all"
        echo "Uso: $0 [backend|frontend|all]"
        exit 1
        ;;
esac
