#!/bin/bash

# Script de verificación de salud para Mini Kaizen Cafetería
# Uso: ./scripts/health-check.sh

set -e

BACKEND_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:3000"

echo "🔍 Verificando estado de los servicios..."
echo "----------------------------------------"

# Función para verificar endpoint
check_endpoint() {
    local url=$1
    local service=$2
    local expected_code=${3:-200}

    echo -n "Verificando $service ($url)... "

    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "^$expected_code$"; then
        echo "✅ OK"
        return 0
    else
        echo "❌ FALLÓ"
        return 1
    fi
}

# Verificar backend
echo "🔧 Verificando Backend:"
check_endpoint "$BACKEND_URL/health" "Backend Health" || BACKEND_FAIL=1
check_endpoint "$BACKEND_URL/docs" "Backend API Docs" || BACKEND_FAIL=1

# Verificar frontend
echo ""
echo "🌐 Verificando Frontend:"
check_endpoint "$FRONTEND_URL" "Frontend" || FRONTEND_FAIL=1

# Verificar contenedores Docker
echo ""
echo "🐳 Verificando Contenedores Docker:"
if docker ps | grep -q "kaizen-backend"; then
    echo "✅ Backend container: RUNNING"
else
    echo "❌ Backend container: NOT RUNNING"
    CONTAINER_FAIL=1
fi

if docker ps | grep -q "kaizen-frontend"; then
    echo "✅ Frontend container: RUNNING"
else
    echo "❌ Frontend container: NOT RUNNING"
    CONTAINER_FAIL=1
fi

# Resumen
echo ""
echo "📊 Resumen de Health Check:"
echo "----------------------------------------"

if [ -z "$BACKEND_FAIL" ] && [ -z "$FRONTEND_FAIL" ] && [ -z "$CONTAINER_FAIL" ]; then
    echo "✅ Todos los servicios están funcionando correctamente"
    echo "🌐 Aplicación disponible en: $FRONTEND_URL"
    echo "🔗 API disponible en: $BACKEND_URL"
    exit 0
else
    echo "❌ Algunos servicios tienen problemas:"
    [ -n "$BACKEND_FAIL" ] && echo "  - Backend no responde correctamente"
    [ -n "$FRONTEND_FAIL" ] && echo "  - Frontend no responde correctamente"
    [ -n "$CONTAINER_FAIL" ] && echo "  - Uno o más contenedores no están ejecutándose"
    echo ""
    echo "💡 Sugerencias:"
    echo "  - Revisa los logs: ./scripts/logs.sh"
    echo "  - Reinicia los servicios: ./scripts/deploy.sh"
    echo "  - Verifica la configuración de Docker"
    exit 1
fi
