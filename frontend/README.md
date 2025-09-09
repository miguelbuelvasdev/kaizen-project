# Frontend - Mini Kaizen Cafetería

Interfaz de usuario moderna desarrollada con React para visualización y control del análisis estadístico de mejoras en tiempos de atención.

## 🎨 Tecnologías

- **React 19**: Framework JavaScript moderno
- **Vite**: Herramienta de construcción rápida
- **Tailwind CSS**: Framework CSS utilitario
- **React Router**: Navegación SPA
- **Axios**: Cliente HTTP para APIs
- **Recharts**: Librería de gráficos React
- **Lucide React**: Iconos modernos y consistentes

## 📁 Estructura

```
frontend/
├── public/                   # Archivos públicos estáticos
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes base de UI
│   │   └── layout/         # Componentes de layout
│   ├── pages/              # Páginas principales
│   │   ├── HomePage.jsx    # Página de inicio
│   │   ├── SimulationPage.jsx # Configuración de simulación
│   │   ├── AnalysisPage.jsx # Resultados del análisis
│   │   └── DashboardPage.jsx # Dashboard completo
│   ├── services/           # Servicios y APIs
│   │   └── api.js          # Cliente API
│   ├── utils/              # Utilidades
│   ├── App.jsx             # Componente principal
│   ├── main.jsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── package.json            # Dependencias y scripts
├── vite.config.js          # Configuración Vite
├── tailwind.config.js      # Configuración Tailwind
└── README.md              # Esta documentación
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 16 o superior
- npm o yarn

### Configuración del proyecto

```bash
# Instalar dependencias
npm install

# Verificar instalación
npm run dev
```

## 🏃‍♂️ Ejecución

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### Producción
```bash
# Construir para producción
npm run build

# Vista previa de la build
npm run preview

# O usando Docker
docker build -t kaizen-frontend .
docker run -p 80:80 kaizen-frontend
```

## 🎯 Páginas principales

### HomePage (`/`)
- **Descripción**: Página de bienvenida con navegación principal
- **Funcionalidades**:
  - Introducción al proyecto
  - Navegación a secciones principales
  - Información general sobre Kaizen

### SimulationPage (`/simulation`)
- **Descripción**: Configuración de parámetros de simulación
- **Funcionalidades**:
  - Formulario de configuración
  - Validación de parámetros
  - Ejecución de simulación
  - Navegación a resultados

### AnalysisPage (`/analysis`)
- **Descripción**: Visualización de resultados estadísticos
- **Funcionalidades**:
  - Tabla de resultados numéricos
  - Interpretación de resultados
  - Conclusiones del análisis
  - Navegación entre secciones

### DashboardPage (`/dashboard`)
- **Descripción**: Dashboard completo con visualizaciones
- **Funcionalidades**:
  - Gráficos interactivos
  - Métricas clave
  - Comparaciones visuales
  - Exportación de resultados

## 🔧 Configuración

### Variables de entorno

```bash
# Archivo .env
VITE_API_URL=http://localhost:8000
```

### API Communication

```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Funciones para comunicación con backend
export const apiService = {
  simulate: (params) => axios.post(`${API_BASE_URL}/api/simulate`, params),
  getResults: () => axios.get(`${API_BASE_URL}/api/results`),
  getPlot: (type) => axios.get(`${API_BASE_URL}/api/plots/${type}`, {
    responseType: 'blob'
  })
};
```

## 🎨 Estilos y UI

### Tailwind CSS
- **Configuración**: `tailwind.config.js`
- **Estilos globales**: `src/index.css`
- **Clases utilitarias**: Aplicadas directamente en componentes

### Componentes UI
- **Botones**: Variantes primary, secondary, danger
- **Formularios**: Inputs, selects, validación visual
- **Cards**: Contenedores con sombras y bordes
- **Navegación**: Header con menú responsive

### Tema
- **Colores**: Azul primario (#3B82F6), gris neutro
- **Tipografía**: Sans-serif moderna
- **Espaciado**: Sistema consistente de márgenes y padding

## 📊 Visualizaciones

### Recharts Integration
```jsx
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Componente de gráfico de línea
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <XAxis dataKey="time" />
    <YAxis />
    <Line type="monotone" dataKey="value" stroke="#3B82F6" />
  </LineChart>
</ResponsiveContainer>
```

### Tipos de gráficos
- **Histogramas**: Distribución de frecuencias
- **Box plots**: Resumen estadístico de cinco números
- **Gráficos de línea**: Tendencias temporales
- **Dashboards**: Combinación de múltiples visualizaciones

## 🔄 Estado y datos

### Gestión de estado
- **useState**: Estado local de componentes
- **useEffect**: Efectos secundarios y carga de datos
- **Context API**: Estado global si es necesario

### Carga de datos
```jsx
// Ejemplo de carga de datos
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await apiService.getResults();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

## 🧭 Navegación

### React Router
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Navegación programática
```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navegar a otra página
const handleNavigation = () => {
  navigate('/analysis');
};
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Componentes responsive
```jsx
// Ejemplo de diseño responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Contenido responsive */}
</div>
```

## 🐛 Solución de problemas

### Error de dependencias
```bash
# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error de CORS
```bash
# Verificar que el backend esté corriendo
# Verificar configuración CORS en backend
# Verificar VITE_API_URL en .env
```

### Problemas con Vite
```bash
# Limpiar caché de Vite
rm -rf node_modules/.vite

# Reiniciar servidor de desarrollo
npm run dev
```

### Error de build
```bash
# Verificar sintaxis
npm run lint

# Verificar tipos (si usas TypeScript)
npm run type-check
```

## 🧪 Desarrollo

### Agregar nueva página
1. Crear componente en `src/pages/`
2. Agregar ruta en `App.jsx`
3. Actualizar navegación si es necesario
4. Probar navegación y funcionalidad

### Agregar nuevo componente
1. Crear componente en `src/components/`
2. Definir props y estado
3. Implementar lógica
4. Aplicar estilos con Tailwind
5. Exportar e importar donde se use

### Modificar estilos
1. Editar `tailwind.config.js` para tema global
2. Modificar `src/index.css` para estilos globales
3. Usar clases de Tailwind en componentes
4. Crear componentes de estilo reutilizables

## 🚀 Despliegue

### Build de producción
```bash
# Crear build optimizado
npm run build

# Los archivos se generan en dist/
```

### Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:8000/;
    }
}
```

## 📈 Optimización

### Performance
- **Lazy loading**: Componentes cargados bajo demanda
- **Code splitting**: División del bundle
- **Image optimization**: Imágenes optimizadas
- **Caching**: Estrategias de caché apropiadas

### SEO
- **Meta tags**: Títulos y descripciones apropiadas
- **Open Graph**: Para compartir en redes sociales
- **Structured data**: Datos estructurados para buscadores

## 🔒 Seguridad

### Mejores prácticas
- **Validación de entrada**: En formularios y APIs
- **Sanitización**: De datos del usuario
- **HTTPS**: En producción
- **Content Security Policy**: Headers de seguridad

## 📚 Documentación adicional

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Recharts Documentation](https://recharts.org/)

## 👨‍💻 Autor

**Miguel Buelvas**
- Email: contacto@miguelbuelvasdev.com
- LinkedIn: [linkedin.com/in/miguelbuelvasdev](https://linkedin.com/in/miguelbuelvasdev)
- Instagram: [@miguelbuelvasdev](https://instagram.com/miguelbuelvasdev)
- GitHub: [github.com/miguelbuelvasdev](https://github.com/miguelbuelvasdev)
