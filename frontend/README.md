# Frontend - Mini Kaizen Cafetería

Interfaz web moderna desarrollada con **React + Vite** para análisis estadístico de mejoras en tiempos de atención usando metodología Kaizen.

## 🚀 Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Build tool ultrarrápido para desarrollo moderno
- **Tailwind CSS** - Framework CSS utilitario
- **React Router DOM** - Navegación SPA
- **Recharts** - Gráficos interactivos y visualizaciones
- **Axios** - Cliente HTTP para comunicación con API
- **Lucide React** - Iconos modernos y consistentes
- **React Hooks** - Gestión de estado y efectos

## 📁 Estructura del Frontend

```
frontend/
├── public/                    # 📂 Archivos públicos estáticos
│   └── vite.svg              # 🚀 Logo de Vite
├── src/                      # 📂 Código fuente principal
│   ├── App.jsx               # 🎯 Componente principal de la aplicación
│   ├── main.jsx              # 🚀 Punto de entrada de React
│   ├── index.css             # 🎨 Estilos globales y Tailwind
│   ├── App.css               # 🎨 Estilos específicos de la app
│   ├── assets/               # 🖼️ Recursos estáticos (imágenes, iconos)
│   │   └── react.svg         # ⚛️ Logo de React
│   ├── components/           # 🧩 Componentes reutilizables
│   │   ├── ui/              # 🎨 Componentes de UI básicos
│   │   └── layout/          # 📐 Componentes de layout
│   ├── pages/               # 📄 Páginas principales de la aplicación
│   │   ├── HomePage.jsx     # 🏠 Página de inicio
│   │   ├── SimulationPage.jsx # 🎲 Página de simulación de datos
│   │   ├── AnalysisPage.jsx # 📊 Página de análisis estadístico
│   │   └── DashboardPage.jsx # 📈 Dashboard con visualizaciones
│   ├── services/            # 🔗 Servicios y comunicación con API
│   │   └── api.js           # 🌐 Configuración de Axios y endpoints
│   ├── hooks/               # 🪝 Hooks personalizados de React
│   └── utils/               # 🛠️ Utilidades y helpers
├── dist/                    # 📦 Archivos de producción (generados)
├── node_modules/           # 📚 Dependencias instaladas
├── package.json            # 📦 Configuración del proyecto y dependencias
├── package-lock.json       # 🔒 Lockfile de dependencias
├── vite.config.js          # ⚙️ Configuración de Vite
├── tailwind.config.js      # 🎨 Configuración de Tailwind CSS
├── postcss.config.js       # ⚙️ Configuración de PostCSS
├── eslint.config.js        # 🔍 Configuración de ESLint
├── index.html              # 🌐 HTML principal
├── nginx.conf              # 🌐 Configuración de Nginx para producción
├── Dockerfile              # 🐳 Configuración Docker
└── .dockerignore          # 🚫 Archivos excluidos del build Docker
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
# Instalar dependencias
npm install

# Verificar instalación
npm list react-router-dom recharts axios lucide-react

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en: http://localhost:5173
```

### Opción 3: Build de Producción

```bash
# Crear build optimizado
npm run build

# Vista previa del build
npm run preview

# Servir con servidor estático
npx serve dist
```

## 🎯 Funcionalidades Principales

### 1. 🏠 Página de Inicio (HomePage)
- **Ubicación**: `src/pages/HomePage.jsx`
- **Función**: Página de bienvenida con navegación principal
- **Características**:
  - Introducción al proyecto Kaizen
  - Navegación intuitiva a todas las secciones
  - Diseño responsive con Tailwind CSS

### 2. 🎲 Simulación de Datos (SimulationPage)
- **Ubicación**: `src/pages/SimulationPage.jsx`
- **Función**: Configuración y generación de datos simulados
- **Características**:
  - Formulario interactivo para parámetros
  - Validación en tiempo real
  - Generación de datos estadísticos realistas
  - Visualización previa de parámetros

### 3. 📊 Análisis Estadístico (AnalysisPage)
- **Ubicación**: `src/pages/AnalysisPage.jsx`
- **Función**: Visualización de resultados estadísticos
- **Características**:
  - Resultados del Welch t-test
  - Cálculo de Cohen's d
  - Interpretación de significancia estadística
  - Impacto de negocio cuantificado

### 4. 📈 Dashboard Completo (DashboardPage)
- **Ubicación**: `src/pages/DashboardPage.jsx`
- **Función**: Visualizaciones interactivas y dashboard completo
- **Características**:
  - Múltiples tipos de gráficos (histogramas, box plots)
  - Dashboard responsivo con pestañas
  - Exportación de imágenes
  - Interactividad con Recharts

## 🔗 Comunicación con API

### Configuración de Axios
- **Archivo**: `src/services/api.js`
- **Base URL**: `http://localhost:8000` (desarrollo) / API_URL (producción)
- **Configuración**:
  - Timeouts apropiados
  - Headers por defecto
  - Interceptores de error

### Endpoints Utilizados

```javascript
// Simulación de datos
POST /simulate
GET /data/current
POST /reset

// Análisis estadístico
GET /analyze

// Visualizaciones
GET /plots/histogram
GET /plots/boxplot
GET /plots/dashboard
```

## 🎨 Diseño y UI/UX

### Tailwind CSS
- **Configuración**: `tailwind.config.js`
- **Estilos globales**: `src/index.css`
- **Componentes**: Diseño utilitario y consistente
- **Responsive**: Mobile-first approach

### Componentes Reutilizables
- **Ubicación**: `src/components/`
- **Tipos**:
  - Componentes de UI básicos (botones, inputs, cards)
  - Componentes de layout (header, footer, sidebar)
  - Componentes específicos de la aplicación

### Iconos
- **Librería**: Lucide React
- **Uso**: Iconos consistentes y modernos
- **Ejemplos**: `Play`, `BarChart3`, `TrendingUp`, `Download`

## 🔄 Estado y Gestión de Datos

### React Hooks Utilizados
- **`useState`**: Gestión de estado local
- **`useEffect`**: Efectos secundarios y ciclo de vida
- **`useContext`**: Estado global (si es necesario)

### Flujo de Datos
1. **Usuario configura parámetros** → SimulationPage
2. **Envío a API** → services/api.js
3. **Procesamiento backend** → Análisis estadístico
4. **Recepción de resultados** → AnalysisPage/DashboardPage
5. **Visualización interactiva** → Recharts components

## 📊 Visualizaciones con Recharts

### Tipos de Gráficos
- **Histogramas**: Distribución de frecuencias
- **Box Plots**: Comparación de distribuciones
- **Gráficos de densidad**: Curvas de distribución
- **Dashboard combinado**: Múltiples visualizaciones

### Configuración de Gráficos
```jsx
<ResponsiveContainer width="100%" height={400}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#8884d8" />
  </BarChart>
</ResponsiveContainer>
```

## ⚙️ Configuración de Desarrollo

### Vite Configuration
- **Archivo**: `vite.config.js`
- **Características**:
  - Servidor de desarrollo rápido
  - Hot Module Replacement (HMR)
  - Optimización de build
  - Configuración de paths

### ESLint Configuration
- **Archivo**: `eslint.config.js`
- **Reglas**: Configuración moderna para React
- **Integración**: Con VS Code y otros editores

### PostCSS Configuration
- **Archivo**: `postcss.config.js`
- **Plugins**: Tailwind CSS y autoprefixer

## 🌐 Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | URL base de la API |

### Archivo `.env`
```bash
# Desarrollo
VITE_API_URL=http://localhost:8000

# Producción
VITE_API_URL=https://api.tu-dominio.com
```

## 🐛 Solución de Problemas

### Error: "Module not found"
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Tailwind CSS not working"
```bash
# Verificar configuración
npm run build  # Debería procesar Tailwind correctamente
```

### Error: "API connection failed"
```bash
# Verificar que el backend esté ejecutándose
curl http://localhost:8000/health

# Verificar configuración de CORS en el backend
```

### Error: "Recharts component not rendering"
```bash
# Verificar imports correctos
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
```

## 🚀 Optimización y Rendimiento

### Build de Producción
- **Optimización automática**: Vite optimiza el bundle
- **Code splitting**: División automática de código
- **Tree shaking**: Eliminación de código no utilizado
- **Minificación**: CSS y JS minificados

### Imágenes y Assets
- **Optimización**: Vite procesa y optimiza imágenes
- **Lazy loading**: Carga diferida de componentes
- **Caching**: Headers apropiados para caching

## 🔧 Desarrollo y Contribución

### Agregar Nueva Página
1. Crear componente en `src/pages/`
2. Agregar ruta en `src/App.jsx`
3. Actualizar navegación si es necesario

### Agregar Nuevo Componente
1. Crear en `src/components/` (UI) o ubicación apropiada
2. Exportar desde `src/components/index.js` (opcional)
3. Usar en páginas o otros componentes

### Agregar Nueva Visualización
1. Instalar dependencias de gráficos si es necesario
2. Crear componente con Recharts
3. Integrar en DashboardPage o página correspondiente

### Mejores Prácticas
- Usar functional components con hooks
- Mantener componentes pequeños y reutilizables
- Usar Tailwind para estilos consistentes
- Documentar props con PropTypes o TypeScript
- Seguir convención de nomenclatura

## 📱 Responsive Design

### Breakpoints de Tailwind
- **sm**: 640px+
- **md**: 768px+
- **lg**: 1024px+
- **xl**: 1280px+

### Diseño Mobile-First
- Componentes adaptables automáticamente
- Navegación touch-friendly
- Optimización de rendimiento en móviles

## 🧪 Testing

### Ejecutar Tests
```bash
# Si hay tests configurados
npm run test

# Ejecutar ESLint
npm run lint
```

### Configuración de Tests
- **Framework**: Jest + React Testing Library (recomendado)
- **Configuración**: En `package.json` o archivo separado

## 📞 Soporte

Para soporte técnico:
- 📧 Email: contacto@miguelbuelvasdev.com
- 🔗 LinkedIn: [miguelbuelvasdev](https://linkedin.com/in/miguelbuelvasdev)
- 📱 Instagram: [@miguelbuelvasdev](https://instagram.com/miguelbuelvasdev)
- 💻 GitHub: [miguelbuelvasdev](https://github.com/miguelbuelvasdev)

---

**🚀 Aplicación Lista**: `http://localhost:5173`
