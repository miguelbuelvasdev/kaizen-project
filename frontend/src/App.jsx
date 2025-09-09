import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { BarChart3, Activity, Home, Settings } from 'lucide-react'

// Importar páginas
import HomePage from './pages/HomePage'
import SimulationPage from './pages/SimulationPage'
import AnalysisPage from './pages/AnalysisPage'
import DashboardPage from './pages/DashboardPage'

// Importar estilos
import './App.css'

function App() {
  const [hasData, setHasData] = useState(false)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">
                    Mini Kaizen
                  </span>
                </div>
                
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link
                    to="/"
                    className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <Home className="inline h-4 w-4 mr-1" />
                    Inicio
                  </Link>
                  
                  <Link
                    to="/simulation"
                    className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <Settings className="inline h-4 w-4 mr-1" />
                    Simulación
                  </Link>
                  
                  <Link
                    to="/analysis"
                    className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <Activity className="inline h-4 w-4 mr-1" />
                    Análisis
                  </Link>
                  
                  <Link
                    to="/dashboard"
                    className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <BarChart3 className="inline h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                </div>
              </div>
              
              {/* Status indicator */}
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${hasData ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-600">
                    {hasData ? 'Datos cargados' : 'Sin datos'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/simulation" element={<SimulationPage setHasData={setHasData} />} />
            <Route path="/analysis" element={<AnalysisPage hasData={hasData} />} />
            <Route path="/dashboard" element={<DashboardPage hasData={hasData} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-gray-500">
              <p>Mini Kaizen - Análisis de mejoras en cafetería © 2024</p>
              <p className="mt-1">Desarrollado con React + FastAPI</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App

