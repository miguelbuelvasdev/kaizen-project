# Backend - Mini Kaizen Cafetería

API REST desarrollada con FastAPI para análisis estadístico de mejoras en tiempos de atención usando metodología Kaizen.

## 🛠️ Tecnologías

- **FastAPI**: Framework web moderno y rápido para APIs REST
- **Python 3.11**: Lenguaje de programación
- **Pandas & NumPy**: Análisis de datos y computación numérica
- **SciPy**: Funciones matemáticas avanzadas
- **Matplotlib & Seaborn**: Generación de visualizaciones
- **Uvicorn**: Servidor ASGI de alto rendimiento

## 📁 Estructura

```
backend/
├── src/
│   ├── generate_data.py      # Simulador de datos estadísticos
│   ├── statistical_analysis.py # Análisis estadístico completo
│   └── visualization.py      # Generación de gráficos
├── reports/                  # Reportes y gráficos generados
├── static/                   # Archivos estáticos servidos
├── main.py                   # Punto de entrada de la API
├── requirements.txt          # Dependencias Python
├── Dockerfile               # Configuración Docker
└── README.md               # Esta documentación
```

## 🚀 Instalación

### Prerrequisitos

- Python 3.10 o superior
- pip (gestor de paquetes Python)

### Configuración del entorno

```bash
# Crear entorno virtual
python3 -m venv .venv

# Activar entorno virtual
source .venv/bin/activate  # Linux/Mac
# o
.venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Crear directorios necesarios
mkdir -p reports static
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
# Desde el directorio backend/
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Producción
```bash
# Usando Docker
docker build -t kaizen-backend .
docker run -p 8000:8000 kaizen-backend

# O usando docker-compose (desde raíz del proyecto)
docker-compose up backend
```

## 📡 API Endpoints

### GET `/`
- **Descripción**: Información básica de la API
- **Respuesta**: JSON con estado y versión

### GET `/health`
- **Descripción**: Verificación de salud del servicio
- **Respuesta**: Estado del servicio

### POST `/api/simulate`
- **Descripción**: Ejecuta simulación completa de datos
- **Parámetros**:
  - `n_before` (int): Tamaño muestra antes (default: 100)
  - `n_after` (int): Tamaño muestra después (default: 100)
  - `mean_before` (float): Media antes (default: 8.5)
  - `mean_after` (float): Media después (default: 6.5)
  - `std_before` (float): Desviación antes (default: 2.0)
  - `std_after` (float): Desviación después (default: 1.5)
- **Respuesta**: Resultados completos del análisis

### GET `/api/results`
- **Descripción**: Obtiene resultados de la última simulación
- **Respuesta**: Datos de la simulación más reciente

### GET `/api/plots/{plot_type}`
- **Descripción**: Obtiene gráfico específico
- **Parámetros**: `plot_type` (histogram, boxplot, timeline, dashboard)
- **Respuesta**: Archivo PNG del gráfico

## 🔧 Configuración

### Variables de entorno

```bash
# Archivo .env
ENV=development
DEBUG=True
PORT=8000
PYTHONPATH=/app
PYTHONUNBUFFERED=1
```

### Configuración CORS

La API está configurada para aceptar solicitudes desde:
- `http://localhost:3000` (desarrollo)
- `http://localhost:5173` (Vite dev server)
- Dominios de producción (configurables)

## 📊 Funcionalidades

### Generación de datos
- Simulación de tiempos de atención antes/después de mejoras
- Distribuciones normales con parámetros configurables
- Validación de parámetros de entrada

### Análisis estadístico
- **Pruebas de normalidad**: Shapiro-Wilk, Kolmogorov-Smirnov
- **Prueba t de Welch**: Comparación de medias con varianzas desiguales
- **Efecto Cohen's d**: Medida del tamaño del efecto
- **Intervalos de confianza**: Para diferencias de medias

### Visualizaciones
- Histogramas comparativos
- Box plots
- Gráficos de línea temporal
- Dashboard completo con múltiples métricas

## 🐛 Solución de problemas

### Error de dependencias
```bash
# Limpiar caché de pip
pip cache purge

# Reinstalar dependencias
pip install --force-reinstall -r requirements.txt
```

### Error de puerto ocupado
```bash
# Verificar procesos usando el puerto
lsof -i :8000

# Cambiar puerto
uvicorn main:app --port 8001
```

### Problemas con matplotlib
```bash
# Instalar dependencias del sistema (Ubuntu/Debian)
sudo apt-get install python3-tk

# Instalar dependencias del sistema (macOS)
brew install pkg-config cairo pango gdk-pixbuf
```

## 📈 Monitoreo

### Logs
```bash
# Ver logs en tiempo real
docker logs -f kaizen-backend

# Ver logs de la aplicación
tail -f /app/logs/app.log
```

### Health checks
```bash
# Verificar estado de la API
curl http://localhost:8000/health
```

## 🔒 Seguridad

### Mejores prácticas implementadas
- Validación de entrada de datos
- Sanitización de parámetros
- Límites en tamaños de muestra
- Configuración CORS restrictiva
- Variables de entorno para configuración sensible

### Producción
- Deshabilitar modo debug
- Usar HTTPS
- Configurar firewall
- Monitoreo de logs
- Actualizaciones regulares de dependencias

## 🧪 Desarrollo

### Agregar nuevo endpoint
1. Definir función en `main.py`
2. Agregar decorador `@app.get/post/put/delete`
3. Implementar lógica
4. Agregar documentación con docstrings
5. Probar con Postman/curl

### Agregar nueva visualización
1. Modificar `src/visualization.py`
2. Crear función de gráfico
3. Integrar en `generate_all_plots()`
4. Actualizar endpoints si es necesario

### Modificar análisis estadístico
1. Editar `src/statistical_analysis.py`
2. Agregar/modificar funciones
3. Integrar en `comprehensive_analysis()`
4. Actualizar validaciones

## 📚 Documentación adicional

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [Matplotlib Documentation](https://matplotlib.org/stable/contents.html)
- [SciPy Documentation](https://docs.scipy.org/doc/scipy/)

## 👨‍💻 Autor

**Miguel Buelvas**
- Email: contacto@miguelbuelvasdev.com
- LinkedIn: [linkedin.com/in/miguelbuelvasdev](https://linkedin.com/in/miguelbuelvasdev)
- Instagram: [@miguelbuelvasdev](https://instagram.com/miguelbuelvasdev)
- GitHub: [github.com/miguelbuelvasdev](https://github.com/miguelbuelvasdev)
