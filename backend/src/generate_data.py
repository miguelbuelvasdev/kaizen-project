"""
Generador de datos simulados para análisis Kaizen - Cafetería
Simula tiempos de atención antes y después de implementar mejoras
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
from typing import Tuple, Dict, Any

def generate_simulation_data(
    n_before: int = 100,
    n_after: int = 100,
    before_mean: float = 8.5,
    after_mean: float = 6.2,
    before_std: float = 2.1,
    after_std: float = 1.5,
    seed: int = None
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Genera datos simulados de tiempos de atención antes y después de mejoras Kaizen
    
    Args:
        n_before: Número de observaciones antes
        n_after: Número de observaciones después
        before_mean: Media de tiempo antes (minutos)
        after_mean: Media de tiempo después (minutos)
        before_std: Desviación estándar antes
        after_std: Desviación estándar después
        seed: Semilla para reproducibilidad
    
    Returns:
        Tuple con DataFrames (antes, después)
    """
    if seed:
        np.random.seed(seed)
        random.seed(seed)
    
    # Generar fechas realistas
    start_date_before = datetime(2024, 1, 1)
    end_date_before = datetime(2024, 3, 31)
    start_date_after = datetime(2024, 4, 1)
    end_date_after = datetime(2024, 6, 30)
    
    # Datos ANTES de la mejora Kaizen
    before_times = np.maximum(
        np.random.normal(before_mean, before_std, n_before),
        1.0  # Tiempo mínimo 1 minuto
    )
    
    before_dates = [
        start_date_before + timedelta(
            days=random.randint(0, (end_date_before - start_date_before).days)
        ) for _ in range(n_before)
    ]
    
    before_hours = [
        random.choice(['07:00-09:00', '09:00-11:00', '11:00-13:00', 
                      '13:00-15:00', '15:00-17:00', '17:00-19:00'])
        for _ in range(n_before)
    ]
    
    df_before = pd.DataFrame({
        'fecha': before_dates,
        'periodo': 'antes',
        'tiempo_atencion_min': np.round(before_times, 2),
        'franja_horaria': before_hours,
        'dia_semana': [date.strftime('%A') for date in before_dates],
        'servidor': [f'Servidor_{random.randint(1, 3)}' for _ in range(n_before)]
    })
    
    # Datos DESPUÉS de la mejora Kaizen
    after_times = np.maximum(
        np.random.normal(after_mean, after_std, n_after),
        1.0  # Tiempo mínimo 1 minuto
    )
    
    after_dates = [
        start_date_after + timedelta(
            days=random.randint(0, (end_date_after - start_date_after).days)
        ) for _ in range(n_after)
    ]
    
    after_hours = [
        random.choice(['07:00-09:00', '09:00-11:00', '11:00-13:00', 
                      '13:00-15:00', '15:00-17:00', '17:00-19:00'])
        for _ in range(n_after)
    ]
    
    df_after = pd.DataFrame({
        'fecha': after_dates,
        'periodo': 'despues',
        'tiempo_atencion_min': np.round(after_times, 2),
        'franja_horaria': after_hours,
        'dia_semana': [date.strftime('%A') for date in after_dates],
        'servidor': [f'Servidor_{random.randint(1, 3)}' for _ in range(n_after)]
    })
    
    return df_before, df_after

def save_simulation_to_csv(df_before: pd.DataFrame, df_after: pd.DataFrame, 
                          output_path: str = "simulation_data.csv") -> str:
    """
    Guarda los datos simulados en un archivo CSV
    
    Args:
        df_before: DataFrame con datos antes
        df_after: DataFrame con datos después
        output_path: Ruta del archivo de salida
    
    Returns:
        Ruta del archivo guardado
    """
    # Combinar ambos datasets
    df_combined = pd.concat([df_before, df_after], ignore_index=True)
    
    # Ordenar por fecha
    df_combined = df_combined.sort_values('fecha')
    
    # Guardar CSV
    df_combined.to_csv(output_path, index=False)
    
    return output_path

def get_simulation_summary(df_before: pd.DataFrame, df_after: pd.DataFrame) -> Dict[str, Any]:
    """
    Genera resumen estadístico de la simulación
    
    Args:
        df_before: DataFrame con datos antes
        df_after: DataFrame con datos después
    
    Returns:
        Diccionario con estadísticas descriptivas
    """
    return {
        'antes': {
            'n_observaciones': len(df_before),
            'media': float(df_before['tiempo_atencion_min'].mean()),
            'mediana': float(df_before['tiempo_atencion_min'].median()),
            'std': float(df_before['tiempo_atencion_min'].std()),
            'min': float(df_before['tiempo_atencion_min'].min()),
            'max': float(df_before['tiempo_atencion_min'].max()),
            'fecha_inicio': df_before['fecha'].min().strftime('%Y-%m-%d'),
            'fecha_fin': df_before['fecha'].max().strftime('%Y-%m-%d')
        },
        'despues': {
            'n_observaciones': len(df_after),
            'media': float(df_after['tiempo_atencion_min'].mean()),
            'mediana': float(df_after['tiempo_atencion_min'].median()),
            'std': float(df_after['tiempo_atencion_min'].std()),
            'min': float(df_after['tiempo_atencion_min'].min()),
            'max': float(df_after['tiempo_atencion_min'].max()),
            'fecha_inicio': df_after['fecha'].min().strftime('%Y-%m-%d'),
            'fecha_fin': df_after['fecha'].max().strftime('%Y-%m-%d')
        }
    }

if __name__ == "__main__":
    # Ejemplo de uso
    print("Generando datos simulados...")
    
    df_before, df_after = generate_simulation_data(
        n_before=120,
        n_after=130,
        seed=42
    )
    
    print(f"Datos antes: {len(df_before)} observaciones")
    print(f"Datos después: {len(df_after)} observaciones")
    
    # Guardar datos
    csv_path = save_simulation_to_csv(df_before, df_after, "reports/simulation_data.csv")
    print(f"Datos guardados en: {csv_path}")
    
    # Mostrar resumen
    summary = get_simulation_summary(df_before, df_after)
    print("\nResumen estadístico:")
    print(f"Antes - Media: {summary['antes']['media']:.2f} min, Std: {summary['antes']['std']:.2f}")
    print(f"Después - Media: {summary['despues']['media']:.2f} min, Std: {summary['despues']['std']:.2f}")

