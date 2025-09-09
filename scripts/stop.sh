#!/bin/bash

# Script para detener servicios de Mini Kaizen Cafetería
# Uso: ./scripts/stop.sh [dev|prod]

ENVIRONMENT=${1:-dev}
COMPOSE_FILE="docker-compose.yml"

if [ "$ENVIRONMENT" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

echo "🛑 Deteniendo servicios en modo: $ENVIRONMENT"
echo "📄 Usando archivo: $COMPOSE_FILE"

# Verificar que el archivo existe
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Error: $COMPOSE_FILE no encontrado"
    exit 1
fi

# Detener servicios
docker-compose -f $COMPOSE_FILE down

# Opcional: remover volúmenes
read -p "¿Deseas remover los volúmenes también? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Removiendo volúmenes..."
    docker-compose -f $COMPOSE_FILE down -v
fi

# Opcional: remover imágenes
read -p "¿Deseas remover las imágenes también? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Removiendo imágenes..."
    docker-compose -f $COMPOSE_FILE down --rmi all
fi

echo "✅ Servicios detenidos exitosamente"
