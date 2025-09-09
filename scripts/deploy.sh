#!/bin/bash

# Script de deployment para Mini Kaizen Cafetería
# Uso: ./scripts/deploy.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}
COMPOSE_FILE="docker-compose.yml"

if [ "$ENVIRONMENT" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
fi

echo "🚀 Iniciando deployment en modo: $ENVIRONMENT"
echo "📄 Usando archivo: $COMPOSE_FILE"

# Verificar que el archivo existe
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Error: $COMPOSE_FILE no encontrado"
    exit 1
fi

# Detener servicios existentes
echo "🛑 Deteniendo servicios existentes..."
docker-compose -f $COMPOSE_FILE down

# Limpiar imágenes no utilizadas (opcional)
echo "🧹 Limpiando imágenes no utilizadas..."
docker image prune -f

# Construir y levantar servicios
echo "🏗️ Construyendo y levantando servicios..."
docker-compose -f $COMPOSE_FILE up --build -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar health checks
echo "🔍 Verificando estado de los servicios..."
./scripts/health-check.sh

if [ $? -eq 0 ]; then
    echo "✅ Deployment completado exitosamente!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔗 API: http://localhost:8000"
    echo "📊 Dashboard: http://localhost:3000/dashboard"
else
    echo "❌ Error en el deployment. Revisa los logs:"
    docker-compose -f $COMPOSE_FILE logs
    exit 1
fi
