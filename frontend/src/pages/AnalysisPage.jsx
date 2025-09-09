import React, { useState, useEffect } from 'react';
import { Activity, BarChart3, Download, RefreshCw, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import ApiService from '../services/api';

const AnalysisPage = ({ hasData }) => {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [generatePlots, setGeneratePlots] = useState(true);
  const [createDashboard, setCreateDashboard] = useState(true);

  const runAnalysis = async () => {
    if (!hasData) {
      setError('No hay datos disponibles. Genera datos primero en la sección Simulación.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.analyzeData(generatePlots, createDashboard);
      setAnalysisResult(response);
    } catch (err) {
      setError('Error ejecutando análisis: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-ejecutar análisis si hay datos disponibles
    if (hasData && !analysisResult) {
      runAnalysis();
    }
  }, [hasData]);

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend = null }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`inline-flex h-12 w-12 rounded-lg bg-${color}-100 text-${color}-600 items-center justify-center`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {trend > 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          </div>
        )}
      </div>
    </div>
  );

  const ResultCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  if (!hasData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No hay datos disponibles</h2>
        <p className="text-gray-600 mb-6">
          Necesitas generar datos simulados antes de poder ejecutar el análisis estadístico.
        </p>
        <a
          href="/simulation"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Ir a Simulación
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Análisis Estadístico
        </h1>
        <p className="text-lg text-gray-600">
          Evaluación estadística de la efectividad de las mejoras Kaizen
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Configuración del Análisis</h2>
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Analizando...' : 'Ejecutar Análisis'}
          </button>
        </div>

        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={generatePlots}
              onChange={(e) => setGeneratePlots(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Generar gráficos estadísticos</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={createDashboard}
              onChange={(e) => setCreateDashboard(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Crear dashboard completo</span>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Ejecutando análisis estadístico...</p>
          <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
        </div>
      )}

      {/* Results */}
      {analysisResult && analysisResult.data && (
        <div className="space-y-8">
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Media ANTES"
              value={`${analysisResult.data.analysis_results.estadisticas_descriptivas.antes.media.toFixed(2)} min`}
              subtitle={`n = ${analysisResult.data.analysis_results.estadisticas_descriptivas.antes.n}`}
              icon={Activity}
              color="red"
            />
            
            <StatCard
              title="Media DESPUÉS"
              value={`${analysisResult.data.analysis_results.estadisticas_descriptivas.despues.media.toFixed(2)} min`}
              subtitle={`n = ${analysisResult.data.analysis_results.estadisticas_descriptivas.despues.n}`}
              icon={Activity}
              color="green"
            />

            <StatCard
              title="Reducción"
              value={`${analysisResult.data.analysis_results.impacto_negocio.reduccion_absoluta_min.toFixed(2)} min`}
              subtitle={`${analysisResult.data.analysis_results.impacto_negocio.reduccion_porcentual.toFixed(1)}%`}
              icon={TrendingDown}
              color="blue"
              trend={-1}
            />

            <StatCard
              title="P-value"
              value={analysisResult.data.analysis_results.welch_ttest.p_value.toFixed(4)}
              subtitle={analysisResult.data.analysis_results.welch_ttest.is_significant ? 'Significativo' : 'No significativo'}
              icon={BarChart3}
              color={analysisResult.data.analysis_results.welch_ttest.is_significant ? 'green' : 'gray'}
            />
          </div>

          {/* Statistical Tests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Welch t-test */}
            <ResultCard title="Welch t-test">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">t-statistic:</span>
                  <span className="font-medium">{analysisResult.data.analysis_results.welch_ttest.t_statistic.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">p-value:</span>
                  <span className="font-medium">{analysisResult.data.analysis_results.welch_ttest.p_value.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Grados de libertad:</span>
                  <span className="font-medium">{analysisResult.data.analysis_results.welch_ttest.degrees_freedom.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">¿Significativo? (α=0.05):</span>
                  <span className={`font-medium ${analysisResult.data.analysis_results.welch_ttest.is_significant ? 'text-green-600' : 'text-red-600'}`}>
                    {analysisResult.data.analysis_results.welch_ttest.is_significant ? 'SÍ' : 'NO'}
                  </span>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>Interpretación:</strong> {analysisResult.data.analysis_results.welch_ttest.interpretation}
                  </p>
                </div>
              </div>
            </ResultCard>

            {/* Cohen's d */}
            <ResultCard title="Tamaño del Efecto (Cohen's d)">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cohen's d:</span>
                  <span className="font-medium">{analysisResult.data.analysis_results.cohens_d.cohens_d.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Desviación std pooled:</span>
                  <span className="font-medium">{analysisResult.data.analysis_results.cohens_d.pooled_std.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interpretación:</span>
                  <span className="font-medium">{analysisResult.data.analysis_results.cohens_d.effect_size_interpretation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dirección:</span>
                  <span className={`font-medium ${analysisResult.data.analysis_results.cohens_d.direction === 'improvement' ? 'text-green-600' : 'text-red-600'}`}>
                    {analysisResult.data.analysis_results.cohens_d.direction === 'improvement' ? 'Mejora' : 
                     analysisResult.data.analysis_results.cohens_d.direction === 'deterioration' ? 'Deterioro' : 'Sin cambio'}
                  </span>
                </div>

                {/* Effect Size Visual */}
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Magnitud:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          Math.abs(analysisResult.data.analysis_results.cohens_d.cohens_d) < 0.2 ? 'bg-yellow-400' :
                          Math.abs(analysisResult.data.analysis_results.cohens_d.cohens_d) < 0.5 ? 'bg-orange-400' :
                          Math.abs(analysisResult.data.analysis_results.cohens_d.cohens_d) < 0.8 ? 'bg-red-400' : 'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(Math.abs(analysisResult.data.analysis_results.cohens_d.cohens_d) * 50, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </ResultCard>
          </div>

          {/* Business Impact */}
          <ResultCard title="Impacto de Negocio" className="border-l-4 border-blue-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {analysisResult.data.analysis_results.impacto_negocio.reduccion_absoluta_min.toFixed(2)}
                </div>
                <div className="text-sm text-blue-700">minutos ahorrados por cliente</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {analysisResult.data.analysis_results.impacto_negocio.reduccion_porcentual.toFixed(1)}%
                </div>
                <div className="text-sm text-green-700">reducción porcentual</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {analysisResult.data.analysis_results.impacto_negocio.significancia_estadistica ? '95%' : '< 95%'}
                </div>
                <div className="text-sm text-purple-700">nivel de confianza</div>
              </div>
            </div>
          </ResultCard>

          {/* Executive Summary */}
          <ResultCard title="Resumen Ejecutivo" className="border-l-4 border-green-500">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-md font-sans">
                {analysisResult.data.analysis_results.resumen_ejecutivo}
              </pre>
            </div>
          </ResultCard>

          {/* Generated Plots */}
          {analysisResult.plots && Object.keys(analysisResult.plots).length > 0 && (
            <ResultCard title="Visualizaciones Generadas">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analysisResult.plots).map(([plotType, plotUrl]) => (
                  <a
                    key={plotType}
                    href={ApiService.getImageUrl(plotUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-600 capitalize">{plotType}</span>
                    </div>
                  </a>
                ))}
              </div>
            </ResultCard>
          )}

          {/* Dashboard Link */}
          {analysisResult.data.dashboard_url && (
            <div className="text-center">
              <a
                href={ApiService.getImageUrl(analysisResult.data.dashboard_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <Download className="h-5 w-5 mr-2" />
                Ver Dashboard Completo
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
