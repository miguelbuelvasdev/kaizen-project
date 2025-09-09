import React, { useState } from 'react';
import { Settings, Play, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import ApiService from '../services/api';

const SimulationPage = ({ setHasData }) => {
  const [formData, setFormData] = useState({
    n_before: 100,
    n_after: 100,
    before_mean: 8.5,
    after_mean: 6.2,
    before_std: 2.1,
    after_std: 1.5,
    seed: 42
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'seed' ? (value === '' ? null : parseInt(value)) : parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.simulateData(formData);
      setResult(response);
      setHasData(true);
    } catch (err) {
      setError('Error generando datos simulados: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      n_before: 100,
      n_after: 100,
      before_mean: 8.5,
      after_mean: 6.2,
      before_std: 2.1,
      after_std: 1.5,
      seed: 42
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Simulación de Datos
        </h1>
        <p className="text-lg text-gray-600">
          Genera datos simulados de tiempos de atención antes y después de implementar mejoras Kaizen
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <Settings className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Parámetros de Simulación</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sample Sizes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones ANTES
                </label>
                <input
                  type="number"
                  name="n_before"
                  value={formData.n_before}
                  onChange={handleInputChange}
                  min="10"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones DESPUÉS
                </label>
                <input
                  type="number"
                  name="n_after"
                  value={formData.n_after}
                  onChange={handleInputChange}
                  min="10"
                  max="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Means */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media ANTES (min)
                </label>
                <input
                  type="number"
                  name="before_mean"
                  value={formData.before_mean}
                                  onChange={handleInputChange}
                  step="0.1"
                  min="1"
                  max="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media DESPUÉS (min)
                </label>
                <input
                  type="number"
                  name="after_mean"
                  value={formData.after_mean}
                  onChange={handleInputChange}
                  step="0.1"
                  min="1"
                  max="30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Standard Deviations */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desviación Std ANTES
                </label>
                <input
                  type="number"
                  name="before_std"
                  value={formData.before_std}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0.1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desviación Std DESPUÉS
                </label>
                <input
                  type="number"
                  name="after_std"
                  value={formData.after_std}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0.1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Seed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semilla (para reproducibilidad)
              </label>
              <input
                type="number"
                name="seed"
                value={formData.seed || ''}
                onChange={handleInputChange}
                placeholder="Opcional - ej: 42"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Usa la misma semilla para obtener resultados reproducibles
              </p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Generando...' : 'Generar Datos'}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-2 inline" />
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Preview Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa de Parámetros</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de observaciones:</span>
                <span className="font-medium">{formData.n_before + formData.n_after}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mejora esperada:</span>
                <span className="font-medium text-green-600">
                  {((formData.before_mean - formData.after_mean) / formData.before_mean * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Diferencia de medias:</span>
                <span className="font-medium">
                  {(formData.before_mean - formData.after_mean).toFixed(1)} min
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-800">Datos Generados Exitosamente</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>{result.message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Summary */}
          {result && result.data && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Datos Generados</h3>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Before Stats */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-3">ANTES de Kaizen</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Observaciones:</span>
                      <span className="font-medium">{result.data.summary.antes.n_observaciones}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Media:</span>
                      <span className="font-medium">{result.data.summary.antes.media.toFixed(2)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mediana:</span>
                      <span className="font-medium">{result.data.summary.antes.mediana.toFixed(2)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Desv. Std:</span>
                      <span className="font-medium">{result.data.summary.antes.std.toFixed(2)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rango:</span>
                      <span className="font-medium">
                        {result.data.summary.antes.min.toFixed(1)} - {result.data.summary.antes.max.toFixed(1)} min
                      </span>
                    </div>
                  </div>
                </div>

                {/* After Stats */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-3">DESPUÉS de Kaizen</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Observaciones:</span>
                      <span className="font-medium">{result.data.summary.despues.n_observaciones}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Media:</span>
                      <span className="font-medium">{result.data.summary.despues.media.toFixed(2)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mediana:</span>
                      <span className="font-medium">{result.data.summary.despues.mediana.toFixed(2)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Desv. Std:</span>
                      <span className="font-medium">{result.data.summary.despues.std.toFixed(2)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rango:</span>
                      <span className="font-medium">
                        {result.data.summary.despues.min.toFixed(1)} - {result.data.summary.despues.max.toFixed(1)} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Improvement Summary */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-3">Mejora Simulada</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {(result.data.summary.antes.media - result.data.summary.despues.media).toFixed(2)}
                    </div>
                    <div className="text-sm text-blue-700">min reducidos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {(((result.data.summary.antes.media - result.data.summary.despues.media) / result.data.summary.antes.media) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-700">reducción</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.data.total_records.before + result.data.total_records.after}
                    </div>
                    <div className="text-sm text-blue-700">registros total</div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="font-medium text-yellow-800 mb-2">Próximos Pasos</h4>
                <p className="text-sm text-yellow-700">
                  Los datos han sido generados exitosamente. Ahora puedes ir a la sección de 
                  <strong> Análisis</strong> para ejecutar las pruebas estadísticas y generar visualizaciones.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Guía de Parámetros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Observaciones:</h4>
            <p>Número de mediciones de tiempo. Más observaciones = mayor precisión estadística.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Media:</h4>
            <p>Tiempo promedio de atención en minutos. Típicamente entre 5-15 minutos para cafeterías.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Desviación Estándar:</h4>
            <p>Variabilidad en los tiempos. Mayor valor = más dispersión en los datos.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Semilla:</h4>
            <p>Número para generar los mismos datos aleatorios. Útil para comparaciones reproducibles.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;
