import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, RefreshCw, AlertTriangle, BarChart3, TrendingDown, Activity, Target } from 'lucide-react';
import ApiService from '../services/api';

const DashboardPage = ({ hasData }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (hasData) {
      loadDashboardData();
    }
  }, [hasData]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Cargar análisis y datos actuales
      const [analysisResponse, currentDataResponse] = await Promise.all([
        ApiService.analyzeData(true, true),
        ApiService.getCurrentData()
      ]);

      setDashboardData({
        analysis: analysisResponse.data.analysis_results,
        currentData: currentDataResponse,
        plots: analysisResponse.plots,
        dashboardUrl: analysisResponse.data.dashboard_url
      });
    } catch (err) {
      setError('Error cargando datos del dashboard: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Preparar datos para gráficos de Recharts
  const prepareChartData = () => {
    if (!dashboardData?.currentData) return null;

    const beforeData = dashboardData.currentData.before.map(item => ({
      ...item,
      periodo: 'Antes',
      tiempo: item.tiempo_atencion_min
    }));

    const afterData = dashboardData.currentData.after.map(item => ({
      ...item,
      periodo: 'Después', 
      tiempo: item.tiempo_atencion_min
    }));

    // Datos para comparación de medias
    const comparisonData = [
      {
        periodo: 'Antes',
        media: dashboardData.analysis.estadisticas_descriptivas.antes.media,
        mediana: dashboardData.analysis.estadisticas_descriptivas.antes.mediana,
        std: dashboardData.analysis.estadisticas_descriptivas.antes.std,
        n: dashboardData.analysis.estadisticas_descriptivas.antes.n
      },
      {
        periodo: 'Después',
        media: dashboardData.analysis.estadisticas_descriptivas.despues.media,
        mediana: dashboardData.analysis.estadisticas_descriptivas.despues.mediana,
        std: dashboardData.analysis.estadisticas_descriptivas.despues.std,
        n: dashboardData.analysis.estadisticas_descriptivas.despues.n
      }
    ];

    // Datos para distribución por franja horaria
    const timeSlotData = {};
    [...beforeData, ...afterData].forEach(item => {
      const key = `${item.franja_horaria}-${item.periodo}`;
      if (!timeSlotData[key]) {
        timeSlotData[key] = {
          franja: item.franja_horaria,
          periodo: item.periodo,
          tiempos: []
        };
      }
      timeSlotData[key].tiempos.push(item.tiempo);
    });

    const timeSlotSummary = Object.values(timeSlotData).map(slot => ({
      franja: slot.franja,
      periodo: slot.periodo,
      media: slot.tiempos.reduce((a, b) => a + b, 0) / slot.tiempos.length,
      count: slot.tiempos.length
    }));

    return {
      comparison: comparisonData,
      timeSlots: timeSlotSummary,
      allData: [...beforeData, ...afterData]
    };
  };

  const chartData = prepareChartData();

  const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'blue', change = null }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`inline-flex h-12 w-12 rounded-lg bg-${color}-100 text-${color}-600 items-center justify-center`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          {change && (
            <div className={`flex items-center mt-1 ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingDown className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{change.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  if (!hasData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No hay datos disponibles</h2>
        <p className="text-gray-600 mb-6">
          Necesitas generar datos simulados y ejecutar el análisis antes de ver el dashboard.
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error cargando dashboard</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={loadDashboardData}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <button
          onClick={loadDashboardData}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Cargar Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Kaizen</h1>
          <p className="text-lg text-gray-600">Análisis completo de mejoras en tiempo de atención</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={loadDashboardData}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </button>
          {dashboardData.dashboardUrl && (
            <a
              href={ApiService.getImageUrl(dashboardData.dashboardUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </a>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Reducción Promedio"
          value={`${dashboardData.analysis.impacto_negocio.reduccion_absoluta_min.toFixed(2)} min`}
          subtitle={`${dashboardData.analysis.impacto_negocio.reduccion_porcentual.toFixed(1)}% de mejora`}
          icon={TrendingDown}
          color="green"
          change={{
            positive: dashboardData.analysis.impacto_negocio.reduccion_absoluta_min > 0,
            text: `${dashboardData.analysis.impacto_negocio.reduccion_porcentual.toFixed(1)}% reducción`
          }}
        />

        <MetricCard
          title="Significancia Estadística"
          value={dashboardData.analysis.welch_ttest.is_significant ? 'SÍ' : 'NO'}
          subtitle={`p-value: ${dashboardData.analysis.welch_ttest.p_value.toFixed(4)}`}
          icon={BarChart3}
          color={dashboardData.analysis.welch_ttest.is_significant ? 'green' : 'red'}
        />

        <MetricCard
          title="Tamaño del Efecto"
          value={dashboardData.analysis.cohens_d.effect_size_interpretation}
          subtitle={`Cohen's d: ${dashboardData.analysis.cohens_d.cohens_d.toFixed(3)}`}
          icon={Target}
          color="purple"
        />

        <MetricCard
          title="Total Observaciones"
          value={dashboardData.analysis.estadisticas_descriptivas.antes.n + dashboardData.analysis.estadisticas_descriptivas.despues.n}
          subtitle={`${dashboardData.analysis.estadisticas_descriptivas.antes.n} antes, ${dashboardData.analysis.estadisticas_descriptivas.despues.n} después`}
          icon={Activity}
          color="blue"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex space-x-4">
            <TabButton
              id="overview"
              label="Resumen"
              active={activeTab === 'overview'}
              onClick={setActiveTab}
            />
            <TabButton
              id="charts"
              label="Gráficos Interactivos"
              active={activeTab === 'charts'}
              onClick={setActiveTab}
            />
            <TabButton
              id="statistics"
              label="Estadísticas Detalladas"
              active={activeTab === 'statistics'}
              onClick={setActiveTab}
            />
            <TabButton
              id="images"
              label="Visualizaciones"
              active={activeTab === 'images'}
              onClick={setActiveTab}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Resumen Ejecutivo</h3>
                <pre className="whitespace-pre-wrap text-sm text-blue-800 font-sans">
                  {dashboardData.analysis.resumen_ejecutivo}
                </pre>
              </div>

              {/* Quick Stats Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-red-800 mb-4">ANTES de Kaizen</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Media:</span>
                      <span className="font-medium">{dashboardData.analysis.estadisticas_descriptivas.antes.media.toFixed(2)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mediana:</span>
                      <span className="font-medium">{dashboardData.analysis.estadisticas_descriptivas.antes.mediana.toFixed(2)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Desv. Estándar:</span>
                      <span className="font-medium">{dashboardData.analysis.estadisticas_descriptivas.antes.std.toFixed(2)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rango:</span>
                      <span className="font-medium">
                        {dashboardData.analysis.estadisticas_descriptivas.antes.min.toFixed(1)} - {dashboardData.analysis.estadisticas_descriptivas.antes.max.toFixed(1)} min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-green-800 mb-4">DESPUÉS de Kaizen</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Media:</span>
                      <span className="font-medium">{dashboardData.analysis.estadisticas_descriptivas.despues.media.toFixed(2)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mediana:</span>
                      <span className="font-medium">{dashboardData.analysis.estadisticas_descriptivas.despues.mediana.toFixed(2)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Desv. Estándar:</span>
                      <span className="font-medium">{dashboardData.analysis.estadisticas_descriptivas.despues.std.toFixed(2)} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rango:</span>
                      <span className="font-medium">
                        {dashboardData.analysis.estadisticas_descriptivas.despues.min.toFixed(1)} - {dashboardData.analysis.estadisticas_descriptivas.despues.max.toFixed(1)} min
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charts Tab */}
          {activeTab === 'charts' && chartData && (
            <div className="space-y-8">
              {/* Comparison Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparación de Medias</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.comparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis label={{ value: 'Tiempo (min)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="media" fill="#3B82F6" name="Media" />
                    <Bar dataKey="mediana" fill="#10B981" name="Mediana" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Time Slot Analysis */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis por Franja Horaria</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData.timeSlots}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="franja" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: 'Tiempo Promedio (min)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="media" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      dot={{ fill: '#EF4444' }}
                      name="Antes"
                      data={chartData.timeSlots.filter(d => d.periodo === 'Antes')}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="media" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981' }}
                      name="Después"
                      data={chartData.timeSlots.filter(d => d.periodo === 'Después')}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'statistics' && (
            <div className="space-y-6">
              {/* Welch t-test */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Welch t-test</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-gray-900">
                      {dashboardData.analysis.welch_ttest.t_statistic.toFixed(3)}
                    </div>
                    <div className="text-sm text-gray-600">t-statistic</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-gray-900">
                      {dashboardData.analysis.welch_ttest.p_value.toFixed(4)}
                    </div>
                    <div className="text-sm text-gray-600">p-value</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-2xl font-bold text-gray-900">
                      {dashboardData.analysis.welch_ttest.degrees_freedom.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Grados libertad</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className={`text-2xl font-bold ${dashboardData.analysis.welch_ttest.is_significant ? 'text-green-600' : 'text-red-600'}`}>
                      {dashboardData.analysis.welch_ttest.is_significant ? 'SÍ' : 'NO'}
                    </div>
                    <div className="text-sm text-gray-600">Significativo</div>
                  </div>
                </div>
              </div>

              {/* Effect Size */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tamaño del Efecto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardData.analysis.cohens_d.cohens_d.toFixed(3)}
                    </div>
                    <div className="text-sm text-blue-700">Cohen's d</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-lg font-semibold text-purple-600">
                      {dashboardData.analysis.cohens_d.effect_size_interpretation}
                    </div>
                    <div className="text-sm text-purple-700">Interpretación</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-lg font-semibold text-green-600">
                      {dashboardData.analysis.cohens_d.direction === 'improvement' ? 'Mejora' : 
                       dashboardData.analysis.cohens_d.direction === 'deterioration' ? 'Deterioro' : 'Sin cambio'}
                    </div>
                    <div className="text-sm text-green-700">Dirección</div>
                  </div>
                </div>
              </div>

              {/* Normality Tests */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pruebas de Normalidad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 rounded">
                    <h4 className="font-medium text-red-800 mb-2">ANTES</h4>
                    <div className="text-sm space-y-1">
                      <div>Statistic: {dashboardData.analysis.normalidad.antes.statistic.toFixed(4)}</div>
                      <div>p-value: {dashboardData.analysis.normalidad.antes.p_value.toFixed(4)}</div>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded">
                    <h4 className="font-medium text-green-800 mb-2">DESPUÉS</h4>
                    <div className="text-sm space-y-1">
                      <div>Statistic: {dashboardData.analysis.normalidad.despues.statistic.toFixed(4)}</div>
                      <div>p-value: {dashboardData.analysis.normalidad.despues.p_value.toFixed(4)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Visualizaciones Generadas</h3>
              {dashboardData.plots && Object.keys(dashboardData.plots).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(dashboardData.plots).map(([plotType, plotUrl]) => (
                    <div key={plotType} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b">
                        <h4 className="font-medium text-gray-900 capitalize">{plotType.replace('_', ' ')}</h4>
                      </div>
                      <div className="p-4">
                        <a
                          href={ApiService.getImageUrl(plotUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:opacity-75 transition-opacity"
                        >
                          <img
                            src={ApiService.getImageUrl(plotUrl)}
                            alt={`${plotType} chart`}
                            className="w-full h-auto rounded border"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <div style={{ display: 'none' }} className="text-center py-8 text-gray-500">
                            <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                            <p>Imagen no disponible</p>
                            <p className="text-sm">Haz clic para intentar cargarla</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>No hay visualizaciones disponibles</p>
                  <p className="text-sm">Ejecuta el análisis para generar gráficos</p>
                </div>
              )}

              {/* Full Dashboard */}
              {dashboardData.dashboardUrl && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <h4 className="font-medium text-gray-900">Dashboard Completo</h4>
                  </div>
                  <div className="p-4">
                    <a
                      href={ApiService.getImageUrl(dashboardData.dashboardUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:opacity-75 transition-opacity"
                    >
                      <img
                        src={ApiService.getImageUrl(dashboardData.dashboardUrl)}
                        alt="Dashboard completo"
                        className="w-full h-auto rounded border"
                      />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;