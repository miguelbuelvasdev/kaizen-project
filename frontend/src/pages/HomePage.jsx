import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Activity, Settings, Download, RefreshCw } from 'lucide-react';
import ApiService from '../services/api';

const HomePage = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      setLoading(true);
      const statusData = await ApiService.getStatus();
      setStatus(statusData);
      setError(null);
    } catch (err) {
      setError('Error conectando con el servidor');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await ApiService.resetData();
      await checkStatus(); // Refresh status
    } catch (err) {
      setError('Error reseteando datos');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Mini Kaizen - Análisis de Cafetería
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Herramienta de análisis estadístico para medir la efectividad de mejoras 
          en el tiempo de atención usando metodología Kaizen.
        </p>
      </div>

      {/* Status Card */}
      {status && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Estado del Sistema</h2>
            <button
              onClick={checkStatus}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Actualizar estado"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`inline-flex h-12 w-12 rounded-full items-center justify-center mb-2 ${
                status.has_data ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <BarChart3 className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-900">Datos Cargados</p>
              <p className={`text-lg font-semibold ${status.has_data ? 'text-green-600' : 'text-gray-400'}`}>
                {status.has_data ? 'Sí' : 'No'}
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="inline-flex h-12 w-12 rounded-full bg-blue-100 text-blue-600 items-center justify-center mb-2">
                <Activity className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-900">Registros Antes</p>
              <p className="text-lg font-semibold text-blue-600">
                {status.data_counts.before}
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="inline-flex h-12 w-12 rounded-full bg-purple-100 text-purple-600 items-center justify-center mb-2">
                <Activity className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-900">Registros Después</p>
              <p className="text-lg font-semibold text-purple-600">
                {status.data_counts.after}
              </p>
            </div>
          </div>

          {/* Files Status */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Archivos Generados</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(status.files_available).map(([filename, exists]) => (
                <div key={filename} className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${exists ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-600">{filename}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Simulation Card */}
        <Link to="/simulation" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex h-12 w-12 rounded-lg bg-blue-100 text-blue-600 items-center justify-center">
                <Settings className="h-6 w-6" />
              </div>
              <span className="text-blue-600 group-hover:text-blue-700">→</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Generar Datos</h3>
            <p className="text-gray-600">
              Simula datos de tiempos de atención antes y después de implementar mejoras Kaizen.
            </p>
          </div>
        </Link>

        {/* Analysis Card */}
        <Link to="/analysis" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex h-12 w-12 rounded-lg bg-green-100 text-green-600 items-center justify-center">
                <Activity className="h-6 w-6" />
              </div>
              <span className="text-green-600 group-hover:text-green-700">→</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Análisis Estadístico</h3>
            <p className="text-gray-600">
              Realiza Welch t-test, Cohen's d y genera visualizaciones estadísticas.
            </p>
          </div>
        </Link>

        {/* Dashboard Card */}
        <Link to="/dashboard" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex h-12 w-12 rounded-lg bg-purple-100 text-purple-600 items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
              <span className="text-purple-600 group-hover:text-purple-700">→</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard</h3>
            <p className="text-gray-600">
              Visualiza resultados completos con gráficos interactivos y conclusiones.
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      {status?.has_data && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="flex flex-wrap gap-4">
            <a
              href={ApiService.getDownloadUrl()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar CSV
            </a>
            
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Datos
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Cómo usar la herramienta</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Comienza en <strong>Simulación</strong> para generar datos de prueba</li>
          <li>Ve a <strong>Análisis</strong> para ejecutar las pruebas estadísticas</li>
          <li>Revisa el <strong>Dashboard</strong> para ver resultados completos</li>
          <li>Descarga los datos y gráficos para tu reporte</li>
        </ol>
      </div>
    </div>
  );
};

export default HomePage;

