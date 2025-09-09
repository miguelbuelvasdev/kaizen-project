#!/bin/bash

# Script de health check para verificar el estado de los servicios
# Uso: ./scripts/health-check.sh [dev|prod]

ENVIRONMENT=${1:-dev}
PROJECT_NAME="mini-kaizen-cafeteria"

echo "🔍 Verificando estado de los servicios en modo: $ENVIRONMENT"
echo "=================================================="

# Función para verificar servicio
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}

    echo -n "Verificando $service_name ($url)... "

    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        echo "✅ OK"
        return 0
    else
        echo "❌ FALLANDO"
        return 1
    fi
}

# Función para verificar contenedores Docker
check_containers() {
    echo ""
    echo "🐳 Estado de contenedores Docker:"
    echo "----------------------------------"

    if [ "$ENVIRONMENT" = "prod" ]; then
        docker-compose -f docker-compose.prod.yml -p $PROJECT_NAME ps
    else
        docker-compose -p $PROJECT_NAME ps
    fi
}

# Función para verificar logs de errores
check_logs() {
    echo ""
    echo "📋 Verificando logs de errores recientes:"
    echo "------------------------------------------"

    # Últimas 10 líneas de logs con errores
    if [ "$ENVIRONMENT" = "prod" ]; then
        docker-compose -f docker-compose.prod.yml -p $PROJECT_NAME logs --tail=10 2>&1 | grep -i error || echo "No se encontraron errores recientes"
    else
        docker-compose -p $PROJECT_NAME logs --tail=10 2>&1 | grep -i error || echo "No se encontraron errores recientes"
    fi
}

# Función para verificar uso de recursos
check_resources() {
    echo ""
    echo "📊 Uso de recursos:"
    echo "-------------------"

    if command -v docker &> /dev/null; then
        echo "Contenedores corriendo:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        echo "Uso de disco:"
        docker system df
    fi
}

# Verificaciones principales
errors=0

# Verificar backend
if [ "$ENVIRONMENT" = "prod" ]; then
    check_service "Backend API" "http://localhost:8000/health" || ((errors++))
    check_service "Backend Docs" "http://localhost:8000/docs" || ((errors++))
    check_service "Frontend" "http://localhost" || ((errors++))
else
    check_service "Backend API" "http://localhost:8000/health" || ((errors++))
    check_service "Backend Docs" "http://localhost:8000/docs" || ((errors++))
    check_service "Frontend" "http://localhost:5173" || ((errors++))
fi

# Verificar endpoints específicos de la API
echo ""
echo "🔗 Verificando endpoints específicos:"
echo "--------------------------------------"

check_service "API Root" "http://localhost:8000/" || ((errors++))
check_service "API Status" "http://localhost:8000/status" || ((errors++))

# Verificaciones adicionales
check_containers
check_logs
check_resources

# Resumen final
echo ""
echo "=================================================="
if [ $errors -eq 0 ]; then
    echo "🎉 ¡Todos los servicios están funcionando correctamente!"
    echo ""
    echo "📊 Servicios disponibles:"
    if [ "$ENVIRONMENT" = "prod" ]; then
        echo "  🌐 Frontend: http://localhost"
        echo "  🚀 Backend:  http://localhost:8000"
    else
        echo "  🌐 Frontend: http://localhost:5173"
        echo "  🚀 Backend:  http://localhost:8000"
    fi
    echo "  📚 API Docs: http://localhost:8000/docs"
    exit 0
else
    echo "❌ Se encontraron $errors problemas. Revisa los logs arriba."
    echo ""
    echo "💡 Soluciones sugeridas:"
    echo "  - Reinicia los servicios: ./scripts/deploy.sh $ENVIRONMENT"
    echo "  - Revisa logs detallados: ./scripts/logs.sh all"
    echo "  - Verifica configuración: cat docker-compose.yml"
    exit 1
fi
