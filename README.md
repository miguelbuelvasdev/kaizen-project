# Mini Kaizen — Reducción del tiempo de atención en cafetería

[![CI/CD](https://github.com/miguelbuelvasdev/kaizen-project/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/miguelbuelvasdev/kaizen-project/actions)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![Python](https://img.shields.io/badge/python-3670A0?style=flat&logo=python&logoColor=ffdd54)](https://python.org)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org)

Proyecto fullstack para análisis estadístico de mejoras en tiempo de atención usando metodología Kaizen. Incluye simulación de datos, análisis estadístico completo (Welch t-test, Cohen's d) y visualizaciones interactivas.

**Repositorio**: [https://github.com/miguelbuelvasdev/kaizen-project](https://github.com/miguelbuelvasdev/kaizen-project)
**Autor**: Miguel Buelvas - [contacto@miguelbuelvasdev.com](mailto:contacto@miguelbuelvasdev.com)
**LinkedIn**: [linkedin.com/in/miguelbuelvasdev](https://linkedin.com/in/miguelbuelvasdev)
**Instagram**: [@miguelbuelvasdev](https://instagram.com/miguelbuelvasdev)
**GitHub**: [@miguelbuelvasdev](https://github.com/miguelbuelvasdev)

## 🎯 Características

- **Simulación de datos**: Genera datos realistas de tiempos de atención antes y después de mejoras
- **Análisis estadístico robusto**: Welch t-test, Cohen's d, pruebas de normalidad
- **Visualizaciones profesionales**: Histogramas, boxplots, gráficos temporales y dashboard completo
- **Interfaz web moderna**: React con Tailwind CSS y componentes interactivos
- **API REST completa**: FastAPI con documentación automática
- **Resultados interpretables**: Resúmenes ejecutivos y conclusiones de negocio

## 🏗️ Estructura del proyecto

```
mini-kaizen-cafeteria/
├── 📁 backend/                    # 🔧 API Python (FastAPI)
│   ├── 📖 README.md              # 📚 Documentación completa del backend
│   ├── 🚀 main.py                # 🎯 Punto de entrada principal
│   ├── 📦 requirements.txt       # 🐍 Dependencias Python
│   ├── 🐳 Dockerfile             # 🐳 Configuración Docker
│   ├── ⚙️ pyrightconfig.json     # 🔍 Configuración Pyright
│   ├── 📂 src/                   # 💻 Código fuente principal
│   │   ├── 🎲 generate_data.py      # 📊 Generador de datos simulados
│   │   ├── 📈 statistical_analysis.py # 🔬 Análisis estadístico completo
│   │   └── 📊 visualization.py      # 🎨 Generación de gráficos
│   ├── 📊 reports/               # 📈 Reportes y gráficos generados
│   ├── 🖼️ static/                # 📁 Archivos estáticos servidos
│   └── 🐍 .venv/                 # 🌐 Virtual environment (desarrollo)
├── 📁 frontend/                  # ⚛️ Aplicación React
│   ├── 📖 README.md              # 📚 Documentación completa del frontend
│   ├── 🌐 index.html             # 🎯 HTML principal
│   ├── 📦 package.json           # 📋 Configuración y dependencias
│   ├── 🐳 Dockerfile             # 🐳 Configuración Docker
│   ├── ⚙️ vite.config.js         # ⚡ Configuración de Vite
│   ├── 🎨 tailwind.config.js     # 💅 Configuración de Tailwind
│   ├── 📂 src/                   # 💻 Código fuente React
│   │   ├── 🏠 App.jsx               # 🎯 Componente principal
│   │   ├── 🚀 main.jsx             # 🎯 Punto de entrada React
│   │   ├── 🎨 index.css            # 💅 Estilos globales
│   │   ├── 🖼️ assets/              # 📁 Recursos estáticos
│   │   ├── 🧩 components/          # 🔧 Componentes reutilizables
│   │   ├── 📄 pages/               # 📱 Páginas principales
│   │   ├── 🔗 services/            # 🌐 Comunicación con API
│   │   ├── 🪝 hooks/               # 🎣 Hooks personalizados
│   │   └── 🛠️ utils/               # 🔧 Utilidades
│   └── 🌐 nginx.conf              # 🌐 Configuración Nginx
├── 📁 scripts/                   # 🚀 Scripts de automatización
│   ├── 🚀 deploy.sh              # 📦 Deployment automatizado
│   ├── 📋 logs.sh                # 📝 Monitoreo de logs
│   ├── 🛑 stop.sh                # ⏹️ Detención de servicios
│   └── ✅ health-check.sh        # 🔍 Verificación de salud
├── 📁 .github/                   # 🤖 CI/CD
│   └── 📋 workflows/             # 🔄 GitHub Actions
├── 🐳 docker-compose.yml         # 🐳 Configuración desarrollo
├── 🐳 docker-compose.prod.yml    # 🐳 Configuración producción
├── 📖 README.md                  # 📚 Documentación principal
├── 🔧 .gitignore                 # 🚫 Archivos ignorados
├── 🌐 .dockerignore              # 🚫 Docker build exclusions
└── ⚙️ .env.example               # 🔑 Variables de entorno
```

### 📚 Documentación Detallada

Para información completa sobre cada parte del proyecto:

- **📖 [Backend Documentation](backend/README.md)** - API FastAPI, análisis estadístico, configuración
- **📖 [Frontend Documentation](frontend/README.md)** - React, componentes, UI/UX, configuración
- **🚀 [Deployment Guide](coolify-deployment.md)** - Guía completa de deployment con Coolify

## 🚀 Instalación y configuración

### Opción 1: Deployment con Docker (Recomendado)

#### Prerrequisitos
- **Docker** y **Docker Compose**
- **Git**

#### Instalación rápida
```bash
# Clonar repositorio
git clone https://github.com/miguelbuelvasdev/kaizen-project.git
cd mini-kaizen-cafeteria

# Ejecutar deployment
./scripts/deploy.sh prod
```

Los servicios estarán disponibles en:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs

#### Comandos útiles
```bash
# Ver logs
./scripts/logs.sh all

# Detener servicios
./scripts/stop.sh prod

# Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart
```

### Opción 2: Desarrollo local

#### Prerrequisitos
- **Python 3.10+**
- **Node.js 16+** y npm
- **Git**
- **WSL** (para Windows) o terminal Unix

#### 1. Clonar el repositorio
```bash
git clone https://github.com/miguelbuelvasdev/kaizen-project.git
cd mini-kaizen-cafeteria
```

### 2. Configurar Backend (Python + FastAPI)

#### Opción A: Desarrollo Local

```bash
# Navegar al directorio backend
cd backend

# Crear virtual environment
python3 -m venv .venv

# Activar virtual environment
source .venv/bin/activate  # En WSL/Linux/Mac
# o .venv\Scripts\activate  # En Windows

# Instalar dependencias
pip install -r requirements.txt

# Crear directorios necesarios
mkdir -p reports static

# Volver al directorio raíz
cd ..
```

#### Opción B: Docker (Recomendado)

```bash
# Para desarrollo
./scripts/deploy.sh dev

# Para producción
./scripts/deploy.sh prod

# Verificar estado
./scripts/health-check.sh

# Ver logs
./scripts/logs.sh

# Detener servicios
./scripts/stop.sh
```

#### Opción C: Deployment con Coolify

1. **Crear proyecto en Coolify** apuntando a este repositorio
2. **Configurar servicios** usando `docker-compose.prod.yml`
3. **Variables de entorno** según `.env.example`
4. **Dominios**: Configurar frontend y api subdomain
5. **Deploy automático** desde GitHub Actions

Ver [Guía de Deployment en Coolify](coolify-deployment.md) para instrucciones detalladas.

#### 3. Configurar Frontend (React + Vite)
```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Verificar que todas las dependencias estén instaladas
npm list react-router-dom recharts axios lucide-react

# Volver al directorio raíz
cd ..
```

### Opción 3: Deployment en Coolify

Para deployment en producción con Coolify, sigue la guía completa en [`coolify-deployment.md`](./coolify-deployment.md).

#### Configuración rápida en Coolify
1. Conecta tu repositorio Git a Coolify
2. Usa `docker-compose.prod.yml` como archivo de configuración
3. Configura las variables de entorno según `.env.example`
4. Deploy automáticamente con cada push a la rama main

## 🎮 Uso de la aplicación

### 1. Iniciar el Backend

```bash
# Terminal 1: Iniciar servidor backend
cd backend
source .venv/bin/activate
python main.py
```

**Salida esperada:**
```
🚀 Iniciando servidor FastAPI...
📊 Mini Kaizen - Análisis de Cafetería
🔗 Documentación: http://localhost:8000/docs
🔗 API: http://localhost:8000
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2. Iniciar el Frontend

```bash
# Terminal 2: Iniciar servidor frontend
cd frontend
npm run dev
```

**Salida esperada:**
```
  VITE v5.0.0  ready in 500 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3. Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **API Documentation**: http://localhost:8000/docs
- **API**: http://localhost:8000

## 📊 Flujo de trabajo

### Paso 1: Simulación de datos
1. Ve a la sección **Simulación**
2. Configura los parámetros:
   - **Observaciones**: Cantidad de mediciones (recomendado: 100-200)
   - **Medias**: Tiempo promedio antes y después (ej: 8.5 → 6.2 min)
   - **Desviaciones**: Variabilidad de los datos (ej: 2.1 → 1.5 min)
   - **Semilla**: Para reproducibilidad (ej: 42)
3. Haz clic en **Generar Datos**

### Paso 2: Análisis estadístico
1. Ve a la sección **Análisis**
2. El análisis se ejecuta automáticamente si hay datos
3. Revisa los resultados:
   - **Welch t-test**: Significancia estadística
   - **Cohen's d**: Tamaño del efecto
   - **Impacto de negocio**: Reducción en minutos y porcentaje

### Paso 3: Dashboard completo
1. Ve a la sección **Dashboard**
2. Explora las pestañas:
   - **Resumen**: Conclusiones ejecutivas
   - **Gráficos**: Visualizaciones interactivas
   - **Visualizaciones**: Gráficos generados por el backend

## 🔧 API Endpoints principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/` | GET | Información de la API |
| `/health` | GET | Estado del servidor |
| `/simulate` | POST | Generar datos simulados |
| `/analyze` | GET | Ejecutar análisis estadístico |
| `/data/current` | GET | Obtener datos actuales |
| `/data/download` | GET | Descargar CSV |
| `/plots/{type}` | GET | Obtener gráfico específico |
| `/reset` | POST | Limpiar datos |

### Ejemplo de uso de la API

```bash
# Generar datos simulados
curl -X POST "http://localhost:8000/simulate" \
     -H "Content-Type: application/json" \
     -d '{
       "n_before": 120,
       "n_after": 130,
       "before_mean": 8.5,
       "after_mean": 6.2,
       "before_std": 2.1,
       "after_std": 1.5,
       "seed": 42
     }'

# Ejecutar análisis
curl "http://localhost:8000/analyze?generate_plots=true&create_dashboard=true"
```

## 📈 Interpretación de resultados

### Significancia estadística
- **p-value < 0.05**: Hay evidencia estadística de mejora
- **p-value ≥ 0.05**: No hay evidencia estadística suficiente

### Tamaño del efecto (Cohen's d)
- **d < 0.2**: Efecto pequeño
- **0.2 ≤ d < 0.5**: Efecto pequeño a mediano
- **0.5 ≤ d < 0.8**: Efecto mediano
- **d ≥ 0.8**: Efecto grande

### Impacto de negocio
- **Reducción absoluta**: Minutos ahorrados por cliente
- **Reducción porcentual**: Porcentaje de mejora
- **Nivel de confianza**: 95% si es estadísticamente significativo

## 🛠️ Tecnologías utilizadas

### Backend
- **Python 3.10+**
- **FastAPI**: Framework web moderno y rápido
- **pandas**: Manipulación de datos
- **numpy**: Computación numérica
- **scipy**: Análisis estadístico
- **matplotlib + seaborn**: Visualizaciones
- **uvicorn**: Servidor ASGI

### Frontend
- **React 18**: Biblioteca de interfaz de usuario
- **Vite**: Build tool rápido
- **Tailwind CSS**: Framework de CSS utilitario
- **Recharts**: Gráficos interactivos
- **Lucide React**: Iconos modernos
- **Axios**: Cliente HTTP
- **React Router**: Navegación

## 🐛 Solución de problemas

### Error: "BoxPlot not found in recharts"
```bash
cd frontend
# Verificar imports en DashboardPage.jsx
# Remover BoxPlot del import de recharts
# Limpiar caché
rm -rf node_modules/.vite
npm run dev
```

### Error: "CORS policy"
- Verificar que el backend esté corriendo en puerto 8000
- Verificar que el frontend esté corriendo en puerto 5173
- La configuración CORS ya está incluida en main.py

### Error: "Module not found"
```bash
# Backend
cd backend
source .venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Error: "Connection refused"
- Verificar que ambos servidores estén corriendo
- Verificar puertos: backend (8000), frontend (5173)
- Verificar firewall y antivirus

## 📝 Desarrollo

### Agregar nuevos análisis estadísticos
1. Editar `backend/src/statistical_analysis.py`
2. Agregar función de análisis
3. Integrar en `comprehensive_analysis()`
4. Actualizar frontend para mostrar resultados

### Agregar nuevas visualizaciones
1. Editar `backend/src/visualization.py`
2. Crear nueva función de gráfico
3. Integrar en `generate_all_plots()`
4. Actualizar frontend para mostrar imagen

### Personalizar parámetros
- Modificar valores por defecto en `SimulationPage.jsx`
- Ajustar rangos de validación en formularios
- Personalizar colores y estilos en `App.css`

## 📊 Casos de uso

### Análisis de cafetería
- Tiempo de preparación de bebidas
- Tiempo de atención en caja
- Tiempo total del proceso

### Otros sectores aplicables

- **Restaurantes**: Tiempo de servicio de mesas
- **Bancos**: Tiempo de atención en ventanilla
- **Hospitales**: Tiempo de espera en consulta
- **Retail**: Tiempo de checkout
- **Call centers**: Tiempo de resolución de llamadas


## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autor

- **Miguel Buelvas** - *Desarrollo completo* - [GitHub](https://github.com/miguelbuelvasdev)

### 📞 Contacto

- **Email**: contacto@miguelbuelvasdev.com
- **LinkedIn**: [miguelbuelvasdev](https://www.linkedin.com/in/miguelbuelvasdev)
- **Instagram**: [@miguelbuelvasdev](https://www.instagram.com/miguelbuelvasdev)
- **GitHub**: [miguelbuelvasdev](https://github.com/miguelbuelvasdev)
