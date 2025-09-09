#!/bin/bash

# Script de deployment para Mini Kaizen Cafetería
# Uso: ./scripts/deploy.sh [dev|prod|test]

set -e

ENVIRONMENT=${1:-dev}
PROJECT_NAME="mini-kaizen-cafeteria"

echo "🚀 Iniciando deployment de $PROJECT_NAME en modo: $ENVIRONMENT"

# Función para verificar dependencias
check_dependencies() {
    echo "📋 Verificando dependencias..."

    if ! command -v docker &> /dev/null; then
        echo "❌ Docker no está instalado. Por favor instala Docker primero."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
        exit 1
    fi

    echo "✅ Dependencias verificadas"
}

# Función para limpiar contenedores anteriores
cleanup() {
    echo "🧹 Limpiando contenedores anteriores..."

    docker-compose -p $PROJECT_NAME down --volumes --remove-orphans 2>/dev/null || true
    docker system prune -f

    echo "✅ Limpieza completada"
}

# Función para construir imágenes
build_images() {
    echo "🔨 Construyendo imágenes Docker..."

    if [ "$ENVIRONMENT" = "prod" ]; then
        docker-compose -f docker-compose.prod.yml -p $PROJECT_NAME build --no-cache
    else
        docker-compose -p $PROJECT_NAME build --no-cache
    fi

    echo "✅ Imágenes construidas"
}

# Función para iniciar servicios
start_services() {
    echo "▶️  Iniciando servicios..."

    if [ "$ENVIRONMENT" = "prod" ]; then
        docker-compose -f docker-compose.prod.yml -p $PROJECT_NAME up -d
    else
        docker-compose -p $PROJECT_NAME up -d
    fi

    echo "✅ Servicios iniciados"
}

# Función para verificar estado
check_status() {
    echo "🔍 Verificando estado de los servicios..."

    # Esperar a que los servicios estén listos
    echo "⏳ Esperando a que los servicios estén listos..."
    sleep 10

    # Verificar backend
    if curl -f http://localhost:8000/health &>/dev/null; then
        echo "✅ Backend está funcionando en http://localhost:8000"
        echo "📚 Documentación API: http://localhost:8000/docs"
    else
        echo "❌ Backend no responde en http://localhost:8000"
    fi

    # Verificar frontend
    if [ "$ENVIRONMENT" = "prod" ]; then
        if curl -f http://localhost &>/dev/null; then
            echo "✅ Frontend está funcionando en http://localhost"
        else
            echo "❌ Frontend no responde en http://localhost"
        fi
    else
        if curl -f http://localhost:5173 &>/dev/null; then
            echo "✅ Frontend está funcionando en http://localhost:5173"
        else
            echo "❌ Frontend no responde en http://localhost:5173"
        fi
    fi
}

# Función para mostrar logs
show_logs() {
    echo "📋 Mostrando logs de los servicios..."
    echo "Presiona Ctrl+C para salir de los logs"
    sleep 2

    if [ "$ENVIRONMENT" = "prod" ]; then
        docker-compose -f docker-compose.prod.yml -p $PROJECT_NAME logs -f
    else
        docker-compose -p $PROJECT_NAME logs -f
    fi
}

# Función principal
main() {
    check_dependencies
    cleanup
    build_images
    start_services
    check_status

    echo ""
    echo "🎉 Deployment completado exitosamente!"
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
    echo ""
    echo "💡 Comandos útiles:"
    echo "  Ver logs: ./scripts/deploy.sh $ENVIRONMENT && ./scripts/logs.sh"
    echo "  Detener: docker-compose -p $PROJECT_NAME down"
    echo "  Reiniciar: docker-compose -p $PROJECT_NAME restart"
    echo ""

    # Preguntar si quiere ver logs
    read -p "¿Quieres ver los logs en tiempo real? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        show_logs
    fi
}

# Manejo de argumentos
case "$ENVIRONMENT" in
    dev)
        echo "🛠️  Modo desarrollo"
        ;;
    prod)
        echo "🏭 Modo producción"
        ;;
    test)
        echo "🧪 Modo testing"
        ;;
    *)
        echo "❌ Ambiente no válido. Usa: dev, prod, o test"
        echo "Uso: $0 [dev|prod|test]"
        exit 1
        ;;
esac

main
