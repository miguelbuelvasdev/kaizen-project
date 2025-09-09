# Backend - Mini Kaizen Cafetería API

API REST desarrollada con **FastAPI** para análisis estadístico de mejoras en tiempos de atención usando metodología Kaizen.

## 🚀 Tecnologías

- **FastAPI** - Framework web moderno y rápido para Python
- **Python 3.11+** - Lenguaje de programación
- **pandas** - Manipulación y análisis de datos
- **numpy** - Computación numérica
- **scipy** - Análisis estadístico avanzado
- **matplotlib + seaborn** - Generación de visualizaciones
- **uvicorn** - Servidor ASGI de alto rendimiento

## 📁 Estructura del Backend

```
backend/
├── main.py                 # Punto de entrada principal de la API
├── requirements.txt        # Dependencias Python
├── Dockerfile              # Configuración Docker
├── .dockerignore           # Archivos excluidos del build Docker
├── pyrightconfig.json      # Configuración Pyright (type checking)
├── src/                    # Código fuente principal
│   ├── __init__.py
│   ├── generate_data.py       # Generador de datos simulados
│   ├── statistical_analysis.py # Análisis estadístico completo
│   └── visualization.py       # Generación de gráficos
├── reports/                # Reportes y gráficos generados
│   └── simulation_data.csv    # Datos de simulación
├── static/                 # Archivos estáticos servidos
└── .venv/                  # Virtual environment (desarrollo local)
```

## 🛠️ Instalación y Configuración

### Opción 1: Docker (Recomendado)

```bash
# Desde el directorio raíz del proyecto
cd ../  # Ir al directorio raíz

# Para desarrollo
../scripts/deploy.sh dev

# Para producción
../scripts/deploy.sh prod

# Verificar estado
../scripts/health-check.sh
```

### Opción 2: Desarrollo Local

```bash
# Crear virtual environment
python3 -m venv .venv

# Activar virtual environment
source .venv/bin/activate  # Linux/Mac
# o .venv\Scripts\activate  # Windows

# Instalar dependencias
pip install -r requirements.txt

# Crear directorios necesarios
mkdir -p reports static

# Ejecutar servidor
python main.py
# o uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 🎯 Funcionalidades Principales

### 1. 🎲 Generación de Datos Simulados
- **Archivo**: `src/generate_data.py`
- **Función**: `generate_kaizen_data()`
- Genera datos realistas de tiempos de atención antes/después de mejoras
- Soporta distribución normal con parámetros configurables

### 2. 📊 Análisis Estadístico Completo
- **Archivo**: `src/statistical_analysis.py`
- **Función**: `comprehensive_analysis()`
- **Welch t-test**: Comparación de medias con varianzas desiguales
- **Cohen's d**: Medida del tamaño del efecto
- **Pruebas de normalidad**: Shapiro-Wilk test
- **Intervalos de confianza**: 95% de confianza

### 3. 📈 Generación de Visualizaciones
- **Archivo**: `src/visualization.py`
- **Función**: `generate_all_plots()`
- Histogramas de distribución
- Box plots comparativos
- Gráficos de densidad
- Dashboard completo con múltiples visualizaciones

## 🔗 Endpoints de la API

### Información General
- `GET /` - Información de la API y estado
- `GET /health` - Health check del servidor
- `GET /docs` - Documentación interactiva (Swagger UI)
- `GET /redoc` - Documentación alternativa (ReDoc)

### Simulación de Datos
- `POST /simulate` - Generar nuevos datos simulados
- `GET /data/current` - Obtener datos actuales
- `GET /data/download` - Descargar datos en CSV
- `POST /reset` - Limpiar datos actuales

### Análisis Estadístico
- `GET /analyze` - Ejecutar análisis completo
- `GET /stats/summary` - Resumen estadístico básico
- `GET /stats/detailed` - Análisis detallado con p-values

### Visualizaciones
- `GET /plots/histogram` - Histograma de distribución
- `GET /plots/boxplot` - Box plot comparativo
- `GET /plots/dashboard` - Dashboard completo
- `GET /plots/{type}` - Gráfico específico por tipo

## 📊 Formato de Datos

### Request - Simulación
```json
{
  "n_before": 120,
  "n_after": 130,
  "before_mean": 8.5,
  "after_mean": 6.2,
  "before_std": 2.1,
  "after_std": 1.5,
  "seed": 42
}
```

### Response - Análisis
```json
{
  "success": true,
  "data": {
    "n_before": 120,
    "n_after": 130,
    "before_stats": {
      "mean": 8.5,
      "std": 2.1,
      "median": 8.4
    },
    "after_stats": {
      "mean": 6.2,
      "std": 1.5,
      "median": 6.1
    },
    "statistical_test": {
      "test_type": "Welch t-test",
      "t_statistic": 12.34,
      "p_value": 0.0001,
      "significant": true
    },
    "effect_size": {
      "cohens_d": 1.23,
      "interpretation": "Large effect"
    },
    "business_impact": {
      "reduction_minutes": 2.3,
      "reduction_percentage": 27.1,
      "confidence_interval": [2.0, 2.6]
    }
  }
}
```

## 🧪 Testing de la API

### Usando curl
```bash
# Health check
curl http://localhost:8000/health

# Generar datos
curl -X POST "http://localhost:8000/simulate" \
     -H "Content-Type: application/json" \
     -d '{"n_before":100,"n_after":100,"before_mean":8.5,"after_mean":6.2}'

# Ejecutar análisis
curl "http://localhost:8000/analyze?generate_plots=true"
```

### Usando Python
```python
import requests

# Simular datos
response = requests.post("http://localhost:8000/simulate", json={
    "n_before": 100,
    "n_after": 100,
    "before_mean": 8.5,
    "after_mean": 6.2
})
print(response.json())

# Obtener análisis
response = requests.get("http://localhost:8000/analyze")
print(response.json())
```

## ⚙️ Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `8000` | Puerto del servidor |
| `ENV` | `development` | Entorno (development/production) |
| `DEBUG` | `True` | Modo debug |
| `PYTHONPATH` | `/app` | Path de Python |

## 🐛 Solución de Problemas

### Error: "Module not found"
```bash
# Asegurarse de activar el virtual environment
source .venv/bin/activate
pip install -r requirements.txt
```

### Error: "Port already in use"
```bash
# Cambiar puerto
PORT=8001 python main.py
# o
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### Error: "Permission denied" (Docker)
```bash
# Dar permisos de ejecución a los scripts
chmod +x ../scripts/*.sh
```

### Error: "Connection refused"
- Verificar que el servidor esté ejecutándose
- Verificar el puerto correcto (8000 por defecto)
- Verificar firewall/antivirus

## 📈 Rendimiento y Optimización

### Producción
- **Workers**: 4 workers en producción para mejor rendimiento
- **Gunicorn**: Considera usar Gunicorn para más estabilidad
- **Caching**: Implementa Redis para caching si es necesario

### Desarrollo
- **Reload**: Auto-reload activado para desarrollo
- **Debug**: Modo debug activado para mejor debugging

## 🔧 Desarrollo y Contribución

### Agregar Nuevo Análisis
1. Editar `src/statistical_analysis.py`
2. Agregar función de análisis
3. Integrar en `comprehensive_analysis()`
4. Actualizar endpoints en `main.py`

### Agregar Nueva Visualización
1. Editar `src/visualization.py`
2. Crear función de gráfico
3. Integrar en `generate_all_plots()`
4. Agregar endpoint correspondiente

### Mejores Prácticas
- Usar type hints en todas las funciones
- Documentar funciones con docstrings
- Mantener separación de responsabilidades
- Usar variables de entorno para configuración

## 📞 Soporte

Para soporte técnico:
- 📧 Email: contacto@miguelbuelvasdev.com
- 🔗 LinkedIn: [miguelbuelvasdev](https://linkedin.com/in/miguelbuelvasdev)
- 📱 Instagram: [@miguelbuelvasdev](https://instagram.com/miguelbuelvasdev)
- 💻 GitHub: [miguelbuelvasdev](https://github.com/miguelbuelvasdev)

---

**🚀 API Lista**: `http://localhost:8000/docs`
