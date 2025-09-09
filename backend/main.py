"""
API FastAPI para análisis Kaizen - Cafetería
Endpoints para simulación de datos y análisis estadístico
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import pandas as pd
import os
import json
from datetime import datetime

# Importar módulos locales
from src.generate_data import generate_simulation_data, get_simulation_summary, save_simulation_to_csv
from src.statistical_analysis import comprehensive_analysis
from src.visualization import generate_all_plots, create_combined_dashboard

# Crear instancia de FastAPI
app = FastAPI(
    title="Mini Kaizen - Análisis de Cafetería",
    description="API para análisis estadístico de mejoras en tiempo de atención usando metodología Kaizen",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS para permitir requests desde frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar archivos estáticos para servir gráficos
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/reports", StaticFiles(directory="reports"), name="reports")

# Modelos Pydantic para requests
class SimulationRequest(BaseModel):
    n_before: int = 100
    n_after: int = 100
    before_mean: float = 8.5
    after_mean: float = 6.2
    before_std: float = 2.1
    after_std: float = 1.5
    seed: Optional[int] = None

class AnalysisResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    plots: Optional[Dict[str, str]] = None
    timestamp: str

# Variables globales para almacenar datos actuales
current_data_before = None
current_data_after = None

@app.get("/")
async def root():
    """Endpoint raíz con información de la API"""
    return {
        "message": "Mini Kaizen - API de Análisis de Cafetería",
        "version": "1.0.0",
        "endpoints": {
            "simulate": "/simulate - Generar datos simulados",
            "analyze": "/analyze - Realizar análisis estadístico",
            "health": "/health - Estado de la API",
            "docs": "/docs - Documentación interactiva"
        },
        "status": "active",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Endpoint de health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "kaizen-analysis-api"
    }

@app.post("/simulate", response_model=AnalysisResponse)
async def simulate_data(request: SimulationRequest):
    """
    Genera datos simulados de tiempos de atención antes y después de Kaizen
    """
    global current_data_before, current_data_after
    
    try:
        # Generar datos simulados
        df_before, df_after = generate_simulation_data(
            n_before=request.n_before,
            n_after=request.n_after,
            before_mean=request.before_mean,
            after_mean=request.after_mean,
            before_std=request.before_std,
            after_std=request.after_std,
            seed=request.seed
        )
        
        # Almacenar datos globalmente
        current_data_before = df_before
        current_data_after = df_after
        
        # Guardar datos en CSV
        csv_path = save_simulation_to_csv(df_before, df_after, "reports/simulation_data.csv")
        
        # Obtener resumen estadístico
        summary = get_simulation_summary(df_before, df_after)
        
        # Preparar respuesta
        response_data = {
            "simulation_parameters": request.dict(),
            "summary": summary,
            "csv_file": csv_path,
            "data_before": df_before.to_dict('records')[:10],  # Solo primeros 10 registros
            "data_after": df_after.to_dict('records')[:10],    # Solo primeros 10 registros
            "total_records": {
                "before": len(df_before),
                "after": len(df_after)
            }
        }
        
        return AnalysisResponse(
            success=True,
            message=f"Datos simulados generados exitosamente. {len(df_before)} registros antes, {len(df_after)} registros después.",
            data=response_data,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando datos simulados: {str(e)}")

@app.get("/analyze", response_model=AnalysisResponse)
async def analyze_data(
    generate_plots: bool = Query(True, description="Generar gráficos estadísticos"),
    create_dashboard: bool = Query(True, description="Crear dashboard completo")
):
    """
    Realiza análisis estadístico completo de los datos simulados
    """
    global current_data_before, current_data_after
    
    try:
        # Verificar que existan datos
        if current_data_before is None or current_data_after is None:
            raise HTTPException(
                status_code=400, 
                detail="No hay datos disponibles. Primero ejecuta /simulate para generar datos."
            )
        
        # Realizar análisis estadístico completo
        analysis_results = comprehensive_analysis(current_data_before, current_data_after)
        
        plot_paths = {}
        dashboard_path = None
        
        # Generar gráficos si se solicita
        if generate_plots:
            plot_paths = generate_all_plots(current_data_before, current_data_after, analysis_results)
            
            # Convertir rutas locales a URLs del servidor
            plot_urls = {}
            for plot_type, path in plot_paths.items():
                # Convertir path local a URL del servidor
                url_path = path.replace("reports/", "/reports/").replace("static/", "/static/")
                plot_urls[plot_type] = url_path
            plot_paths = plot_urls
        
        # Crear dashboard completo si se solicita
        if create_dashboard:
            dashboard_path = create_combined_dashboard(
                current_data_before, 
                current_data_after, 
                analysis_results
            )
            dashboard_path = dashboard_path.replace("reports/", "/reports/")
        
        # Preparar respuesta completa
        response_data = {
            "analysis_results": analysis_results,
            "data_info": {
                "before_count": len(current_data_before),
                "after_count": len(current_data_after),
                "before_period": f"{current_data_before['fecha'].min().strftime('%Y-%m-%d')} a {current_data_before['fecha'].max().strftime('%Y-%m-%d')}",
                "after_period": f"{current_data_after['fecha'].min().strftime('%Y-%m-%d')} a {current_data_after['fecha'].max().strftime('%Y-%m-%d')}"
            },
            "dashboard_url": dashboard_path
        }
        
        return AnalysisResponse(
            success=True,
            message="Análisis estadístico completado exitosamente.",
            data=response_data,
            plots=plot_paths,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en análisis estadístico: {str(e)}")

@app.get("/data/current")
async def get_current_data():
    """
    Retorna los datos actuales en formato JSON
    """
    global current_data_before, current_data_after
    
    if current_data_before is None or current_data_after is None:
        raise HTTPException(
            status_code=404, 
            detail="No hay datos disponibles. Ejecuta /simulate primero."
        )
    
    return {
        "before": current_data_before.to_dict('records'),
        "after": current_data_after.to_dict('records'),
        "summary": get_simulation_summary(current_data_before, current_data_after)
    }

@app.get("/data/download")
async def download_data():
    """
    Descarga los datos actuales como archivo CSV
    """
    global current_data_before, current_data_after
    
    if current_data_before is None or current_data_after is None:
        raise HTTPException(
            status_code=404, 
            detail="No hay datos disponibles. Ejecuta /simulate primero."
        )
    
    csv_path = "reports/simulation_data.csv"
    if not os.path.exists(csv_path):
        # Generar CSV si no existe
        save_simulation_to_csv(current_data_before, current_data_after, csv_path)
    
    return FileResponse(
        path=csv_path,
        filename="kaizen_simulation_data.csv",
        media_type="text/csv"
    )

@app.get("/plots/{plot_type}")
async def get_plot(plot_type: str):
    """
    Retorna un gráfico específico
    """
    plot_files = {
        "histogram": "reports/histogram_comparison.png",
        "boxplot": "reports/boxplot_comparison.png", 
        "timeline": "reports/timeline_analysis.png",
        "summary": "reports/statistical_summary.png",
        "dashboard": "reports/dashboard_completo.png"
    }
    
    if plot_type not in plot_files:
        raise HTTPException(
            status_code=404,
            detail=f"Tipo de gráfico '{plot_type}' no encontrado. Disponibles: {list(plot_files.keys())}"
        )
    
    file_path = plot_files[plot_type]
    
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail=f"Gráfico '{plot_type}' no encontrado. Ejecuta /analyze primero."
        )
    
    return FileResponse(
        path=file_path,
        media_type="image/png"
    )

@app.post("/reset")
async def reset_data():
    """
    Limpia todos los datos y archivos generados
    """
    global current_data_before, current_data_after
    
    try:
        # Limpiar variables globales
        current_data_before = None
        current_data_after = None
        
        # Limpiar archivos generados (opcional)
        files_to_clean = [
            "reports/simulation_data.csv",
            "reports/histogram_comparison.png",
            "reports/boxplot_comparison.png",
            "reports/timeline_analysis.png", 
            "reports/statistical_summary.png",
            "reports/dashboard_completo.png"
        ]
        
        cleaned_files = []
        for file_path in files_to_clean:
            if os.path.exists(file_path):
                os.remove(file_path)
                cleaned_files.append(file_path)
        
        return {
            "success": True,
            "message": "Datos y archivos limpiados exitosamente.",
            "cleaned_files": cleaned_files,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error limpiando datos: {str(e)}")

@app.get("/status")
async def get_status():
    """
    Retorna el estado actual del sistema
    """
    global current_data_before, current_data_after
    
    has_data = current_data_before is not None and current_data_after is not None
    
    # Verificar archivos existentes
    files_status = {}
    check_files = [
        "reports/simulation_data.csv",
        "reports/histogram_comparison.png", 
        "reports/boxplot_comparison.png",
        "reports/dashboard_completo.png"
    ]
    
    for file_path in check_files:
        files_status[os.path.basename(file_path)] = os.path.exists(file_path)
    
    return {
        "has_data": has_data,
        "data_counts": {
            "before": len(current_data_before) if current_data_before is not None else 0,
            "after": len(current_data_after) if current_data_after is not None else 0
        },
        "files_available": files_status,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    
    # Crear directorios necesarios
    os.makedirs("reports", exist_ok=True)
    os.makedirs("static", exist_ok=True)
    
    print("🚀 Iniciando servidor FastAPI...")
    print("📊 Mini Kaizen - Análisis de Cafetería")
    print("🔗 Documentación: http://localhost:8000/docs")
    print("🔗 API: http://localhost:8000")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

