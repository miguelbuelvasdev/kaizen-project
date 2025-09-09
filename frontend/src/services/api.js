/**
 * Servicio para comunicarse con la API del backend
 */

// Configuración para diferentes entornos
const getApiBaseUrl = () => {
  // En Docker Compose, usar el nombre del servicio
  if (process.env.NODE_ENV === 'production') {
    return 'http://localhost:8000'; // O tu dominio en producción
  }
  
  // En desarrollo
  return 'http://localhost:8000';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🔗 API Request: ${url}`);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Response:`, data);
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  // ... resto de métodos igual
}

export default new ApiService();
