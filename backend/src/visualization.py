"""
Módulo de visualización para análisis Kaizen - Cafetería
Genera gráficos estadísticos y los guarda como archivos PNG
"""

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple
import os
from datetime import datetime

# Configurar estilo de matplotlib
plt.style.use('default')
sns.set_palette("husl")

def setup_plot_style():
    """Configura el estilo global de los gráficos"""
    plt.rcParams.update({
        'figure.figsize': (12, 8),
        'font.size': 11,
        'axes.titlesize': 14,
        'axes.labelsize': 12,
        'xtick.labelsize': 10,
        'ytick.labelsize': 10,
        'legend.fontsize': 11,
        'figure.dpi': 100,
        'savefig.dpi': 300,
        'savefig.bbox': 'tight'
    })

def create_comparison_histogram(df_before: pd.DataFrame, df_after: pd.DataFrame, 
                              output_path: str = "reports/histogram_comparison.png") -> str:
    """
    Crea histograma comparativo de tiempos antes vs después
    """
    setup_plot_style()
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
    
    before_times = df_before['tiempo_atencion_min']
    after_times = df_after['tiempo_atencion_min']
    
    # Histograma ANTES
    ax1.hist(before_times, bins=20, alpha=0.7, color='#ff6b6b', edgecolor='black', linewidth=0.5)
    ax1.axvline(before_times.mean(), color='red', linestyle='--', linewidth=2, 
                label=f'Media: {before_times.mean():.2f} min')
    ax1.set_title('Distribución ANTES de Kaizen', fontweight='bold')
    ax1.set_xlabel('Tiempo de atención (minutos)')
    ax1.set_ylabel('Frecuencia')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Histograma DESPUÉS
    ax2.hist(after_times, bins=20, alpha=0.7, color='#4ecdc4', edgecolor='black', linewidth=0.5)
    ax2.axvline(after_times.mean(), color='teal', linestyle='--', linewidth=2,
                label=f'Media: {after_times.mean():.2f} min')
    ax2.set_title('Distribución DESPUÉS de Kaizen', fontweight='bold')
    ax2.set_xlabel('Tiempo de atención (minutos)')
    ax2.set_ylabel('Frecuencia')
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    plt.suptitle('Comparación de Tiempos de Atención - Análisis Kaizen', 
                 fontsize=16, fontweight='bold', y=1.02)
    plt.tight_layout()
    
    # Crear directorio si no existe
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    return output_path

def create_boxplot_comparison(df_before: pd.DataFrame, df_after: pd.DataFrame,
                            output_path: str = "reports/boxplot_comparison.png") -> str:
    """
    Crea boxplot comparativo de tiempos antes vs después
    """
    setup_plot_style()
    
    # Combinar datos para boxplot
    df_combined = pd.concat([
        df_before[['tiempo_atencion_min']].assign(periodo='Antes'),
        df_after[['tiempo_atencion_min']].assign(periodo='Después')
    ])
    
    fig, ax = plt.subplots(figsize=(10, 8))
    
    # Crear boxplot
    box_plot = ax.boxplot([df_before['tiempo_atencion_min'], df_after['tiempo_atencion_min']], 
                         labels=['Antes', 'Después'], patch_artist=True)
    
    # Personalizar colores
    colors = ['#ff6b6b', '#4ecdc4']
    for patch, color in zip(box_plot['boxes'], colors):
        patch.set_facecolor(color)
        patch.set_alpha(0.7)
    
    # Agregar puntos de media
    means = [df_before['tiempo_atencion_min'].mean(), df_after['tiempo_atencion_min'].mean()]
    ax.scatter([1, 2], means, color='red', s=100, zorder=3, marker='D', label='Media')
    
    # Agregar valores de media como texto
    for i, mean in enumerate(means):
        ax.text(i+1, mean+0.3, f'{mean:.2f} min', ha='center', fontweight='bold')
    
    ax.set_title('Comparación de Tiempos de Atención - Boxplot\nAnálisis Kaizen Cafetería', 
                 fontsize=14, fontweight='bold')
    ax.set_ylabel('Tiempo de atención (minutos)')
    ax.grid(True, alpha=0.3)
    ax.legend()
    
    # Agregar estadísticas en el gráfico
    reduction = means[0] - means[1]
    percentage = (reduction / means[0]) * 100
    ax.text(0.02, 0.98, f'Reducción: {reduction:.2f} min ({percentage:.1f}%)', 
            transform=ax.transAxes, fontsize=12, fontweight='bold',
            bbox=dict(boxstyle="round,pad=0.3", facecolor="yellow", alpha=0.7),
            verticalalignment='top')
    
    plt.tight_layout()
    
    # Crear directorio si no existe
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    return output_path

def create_timeline_plot(df_before: pd.DataFrame, df_after: pd.DataFrame,
                        output_path: str = "reports/timeline_analysis.png") -> str:
    """
    Crea gráfico de línea temporal mostrando evolución de tiempos
    """
    setup_plot_style()
    
    # Combinar datos
    df_combined = pd.concat([df_before, df_after])
    df_combined['fecha'] = pd.to_datetime(df_combined['fecha'])
    
    # Agrupar por semana
    df_combined['semana'] = df_combined['fecha'].dt.to_period('W')
    weekly_stats = df_combined.groupby(['semana', 'periodo'])['tiempo_atencion_min'].agg(['mean', 'std']).reset_index()
    
    fig, ax = plt.subplots(figsize=(14, 8))
    
    # Separar datos por período
    before_data = weekly_stats[weekly_stats['periodo'] == 'antes']
    after_data = weekly_stats[weekly_stats['periodo'] == 'despues']
    
    # Plotear líneas
    if not before_data.empty:
        ax.plot(before_data['semana'].astype(str), before_data['mean'], 
                marker='o', linewidth=2, color='#ff6b6b', label='Antes de Kaizen')
        ax.fill_between(before_data['semana'].astype(str), 
                       before_data['mean'] - before_data['std'],
                       before_data['mean'] + before_data['std'],
                       alpha=0.2, color='#ff6b6b')
    
    if not after_data.empty:
        ax.plot(after_data['semana'].astype(str), after_data['mean'], 
                marker='s', linewidth=2, color='#4ecdc4', label='Después de Kaizen')
        ax.fill_between(after_data['semana'].astype(str), 
                       after_data['mean'] - after_data['std'],
                       after_data['mean'] + after_data['std'],
                       alpha=0.2, color='#4ecdc4')
    
    ax.set_title('Evolución Temporal de Tiempos de Atención\nAnálisis Kaizen Cafetería', 
                 fontsize=14, fontweight='bold')
    ax.set_xlabel('Semana')
    ax.set_ylabel('Tiempo promedio de atención (minutos)')
    ax.legend()
    ax.grid(True, alpha=0.3)
    
    # Rotar etiquetas del eje x
    plt.xticks(rotation=45)
    plt.tight_layout()
    
    # Crear directorio si no existe
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    return output_path

def create_statistical_summary_plot(analysis_results: Dict[str, Any],
                                  output_path: str = "reports/statistical_summary.png") -> str:
    """
    Crea gráfico resumen con estadísticas principales
    """
    setup_plot_style()
    
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 12))
    
    # Extraer datos
    stats_antes = analysis_results['estadisticas_descriptivas']['antes']
    stats_despues = analysis_results['estadisticas_descriptivas']['despues']
    ttest = analysis_results['welch_ttest']
    cohens = analysis_results['cohens_d']
    
    # 1. Comparación de medias
    categories = ['Antes', 'Después']
    means = [stats_antes['media'], stats_despues['media']]
    stds = [stats_antes['std'], stats_despues['std']]
    
    bars = ax1.bar(categories, means, yerr=stds, capsize=5, 
                   color=['#ff6b6b', '#4ecdc4'], alpha=0.7, edgecolor='black')
    ax1.set_title('Comparación de Medias ± Desviación Estándar', fontweight='bold')
    ax1.set_ylabel('Tiempo (minutos)')
    
    # Agregar valores en las barras
    for bar, mean in zip(bars, means):
        ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
                f'{mean:.2f}', ha='center', fontweight='bold')
    
    # 2. Estadísticas del t-test
    ax2.text(0.1, 0.8, f"Welch t-test Results", fontsize=14, fontweight='bold', transform=ax2.transAxes)
    ax2.text(0.1, 0.7, f"t-statistic: {ttest['t_statistic']:.3f}", fontsize=12, transform=ax2.transAxes)
    ax2.text(0.1, 0.6, f"p-value: {ttest['p_value']:.4f}", fontsize=12, transform=ax2.transAxes)
    ax2.text(0.1, 0.5, f"Degrees of freedom: {ttest['degrees_freedom']:.1f}", fontsize=12, transform=ax2.transAxes)
    
    significance = "SÍ" if ttest['is_significant'] else "NO"
    color = "green" if ttest['is_significant'] else "red"
    ax2.text(0.1, 0.4, f"¿Significativo?: {significance}", fontsize=12, fontweight='bold', 
             color=color, transform=ax2.transAxes)
    
    ax2.text(0.1, 0.2, f"Cohen's d: {cohens['cohens_d']:.3f}", fontsize=12, transform=ax2.transAxes)
    ax2.text(0.1, 0.1, f"Tamaño del efecto: {cohens['effect_size_interpretation']}", 
             fontsize=12, transform=ax2.transAxes)
    
    ax2.set_xlim(0, 1)
    ax2.set_ylim(0, 1)
    ax2.axis('off')
    
    # 3. Distribución de datos
    data_comparison = [stats_antes['media'], stats_despues['media']]
    ax3.pie([stats_antes['n'], stats_despues['n']], 
            labels=[f'Antes (n={stats_antes["n"]})', f'Después (n={stats_despues["n"]})'],
            colors=['#ff6b6b', '#4ecdc4'], autopct='%1.1f%%', startangle=90)
    ax3.set_title('Distribución de Observaciones', fontweight='bold')
    
    # 4. Impacto de negocio
    business = analysis_results['impacto_negocio']
    reduction_abs = business['reduccion_absoluta_min']
    reduction_pct = business['reduccion_porcentual']
    
    ax4.text(0.1, 0.8, "IMPACTO DE NEGOCIO", fontsize=14, fontweight='bold', transform=ax4.transAxes)
    ax4.text(0.1, 0.7, f"Reducción absoluta: {reduction_abs:.2f} min", fontsize=12, transform=ax4.transAxes)
    ax4.text(0.1, 0.6, f"Reducción porcentual: {reduction_pct:.1f}%", fontsize=12, transform=ax4.transAxes)
    ax4.text(0.1, 0.5, f"Ahorro por cliente: {business['tiempo_ahorrado_por_cliente']:.2f} min", 
             fontsize=12, transform=ax4.transAxes)
    
    # Indicador visual de mejora
    if reduction_pct > 0:
        ax4.text(0.1, 0.3, "✅ MEJORA CONFIRMADA", fontsize=14, fontweight='bold', 
                color='green', transform=ax4.transAxes)
    else:
        ax4.text(0.1, 0.3, "❌ SIN MEJORA CLARA", fontsize=14, fontweight='bold', 
                color='red', transform=ax4.transAxes)
    
    ax4.set_xlim(0, 1)
    ax4.set_ylim(0, 1)
    ax4.axis('off')
    
    plt.suptitle('Resumen Estadístico - Análisis Kaizen Cafetería', 
                 fontsize=16, fontweight='bold')
    plt.tight_layout()
    
    # Crear directorio si no existe
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    return output_path

def generate_all_plots(df_before: pd.DataFrame, df_after: pd.DataFrame, 
                      analysis_results: Dict[str, Any]) -> Dict[str, str]:
    """
    Genera todos los gráficos y retorna las rutas de los archivos
    
    Args:
        df_before: DataFrame con datos antes
        df_after: DataFrame con datos después  
        analysis_results: Resultados del análisis estadístico
    
    Returns:
        Diccionario con rutas de todos los gráficos generados
    """
    plot_paths = {}
    
    try:
        # Crear todos los gráficos
        plot_paths['histogram'] = create_comparison_histogram(df_before, df_after)
        plot_paths['boxplot'] = create_boxplot_comparison(df_before, df_after)
        plot_paths['timeline'] = create_timeline_plot(df_before, df_after)
        plot_paths['summary'] = create_statistical_summary_plot(analysis_results)
        
        print(f"✅ Gráficos generados exitosamente:")
        for plot_type, path in plot_paths.items():
            print(f"  - {plot_type}: {path}")
            
    except Exception as e:
        print(f"❌ Error generando gráficos: {e}")
        
    return plot_paths

def create_combined_dashboard(df_before: pd.DataFrame, df_after: pd.DataFrame,
                            analysis_results: Dict[str, Any],
                            output_path: str = "reports/dashboard_completo.png") -> str:
    """
    Crea un dashboard completo con todos los análisis en una sola imagen
    """
    setup_plot_style()
    
    fig = plt.figure(figsize=(20, 16))
    
    # Configurar grid de subplots
    gs = fig.add_gridspec(3, 3, hspace=0.3, wspace=0.3)
    
    # 1. Histogramas comparativos (2 columnas)
    ax1 = fig.add_subplot(gs[0, :2])
    before_times = df_before['tiempo_atencion_min']
    after_times = df_after['tiempo_atencion_min']
    
    bins = np.linspace(min(before_times.min(), after_times.min()), 
                      max(before_times.max(), after_times.max()), 25)
    
    ax1.hist(before_times, bins=bins, alpha=0.6, label='Antes', color='#ff6b6b', density=True)
    ax1.hist(after_times, bins=bins, alpha=0.6, label='Después', color='#4ecdc4', density=True)
    ax1.axvline(before_times.mean(), color='red', linestyle='--', linewidth=2)
    ax1.axvline(after_times.mean(), color='teal', linestyle='--', linewidth=2)
    ax1.set_title('Distribución de Tiempos de Atención', fontweight='bold', fontsize=14)
    ax1.set_xlabel('Tiempo (minutos)')
    ax1.set_ylabel('Densidad')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # 2. Estadísticas clave (1 columna)
    ax2 = fig.add_subplot(gs[0, 2])
    stats = analysis_results['estadisticas_descriptivas']
    business = analysis_results['impacto_negocio']
    
    info_text = f"""ESTADÍSTICAS CLAVE
    
Antes:
• Media: {stats['antes']['media']:.2f} min
• Std: {stats['antes']['std']:.2f} min
• n = {stats['antes']['n']}

Después:
• Media: {stats['despues']['media']:.2f} min  
• Std: {stats['despues']['std']:.2f} min
• n = {stats['despues']['n']}

MEJORA:
• {business['reduccion_absoluta_min']:.2f} min
• {business['reduccion_porcentual']:.1f}%"""
    
    ax2.text(0.05, 0.95, info_text, transform=ax2.transAxes, fontsize=11,
             verticalalignment='top', fontfamily='monospace',
             bbox=dict(boxstyle="round,pad=0.5", facecolor="lightgray", alpha=0.8))
    ax2.set_xlim(0, 1)
    ax2.set_ylim(0, 1)
    ax2.axis('off')
    
    # 3. Boxplot comparativo
    ax3 = fig.add_subplot(gs[1, 0])
    box_data = [before_times, after_times]
    box_plot = ax3.boxplot(box_data, labels=['Antes', 'Después'], patch_artist=True)
    colors = ['#ff6b6b', '#4ecdc4']
    for patch, color in zip(box_plot['boxes'], colors):
        patch.set_facecolor(color)
        patch.set_alpha(0.7)
    ax3.set_title('Comparación Boxplot', fontweight='bold')
    ax3.set_ylabel('Tiempo (min)')
    ax3.grid(True, alpha=0.3)
    
    # 4. Test estadístico
    ax4 = fig.add_subplot(gs[1, 1])
    ttest = analysis_results['welch_ttest']
    cohens = analysis_results['cohens_d']
    
    test_text = f"""PRUEBA ESTADÍSTICA
    
Welch t-test:
• t = {ttest['t_statistic']:.3f}
• p = {ttest['p_value']:.4f}
• df = {ttest['degrees_freedom']:.1f}

Cohen's d:
• d = {cohens['cohens_d']:.3f}
• Efecto: {cohens['effect_size_interpretation']}

Significativo: {'SÍ' if ttest['is_significant'] else 'NO'}"""
    
    ax4.text(0.05, 0.95, test_text, transform=ax4.transAxes, fontsize=11,
             verticalalignment='top', fontfamily='monospace',
             bbox=dict(boxstyle="round,pad=0.5", facecolor="lightblue", alpha=0.8))
    ax4.set_xlim(0, 1)
    ax4.set_ylim(0, 1)
    ax4.axis('off')
    
    # 5. Gráfico de barras de comparación
    ax5 = fig.add_subplot(gs[1, 2])
    categories = ['Antes', 'Después']
    means = [stats['antes']['media'], stats['despues']['media']]
    bars = ax5.bar(categories, means, color=['#ff6b6b', '#4ecdc4'], alpha=0.7)
    ax5.set_title('Medias Comparadas', fontweight='bold')
    ax5.set_ylabel('Tiempo (min)')
    for bar, mean in zip(bars, means):
        ax5.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
                f'{mean:.2f}', ha='center', fontweight='bold')
    
    # 6. Resumen ejecutivo (span 3 columns)
    ax6 = fig.add_subplot(gs[2, :])
    executive_summary = analysis_results['resumen_ejecutivo']
    ax6.text(0.02, 0.98, executive_summary, transform=ax6.transAxes, fontsize=12,
             verticalalignment='top', wrap=True,
             bbox=dict(boxstyle="round,pad=0.5", facecolor="lightyellow", alpha=0.9))
    ax6.set_xlim(0, 1)
    ax6.set_ylim(0, 1)
    ax6.axis('off')
    
    # Título principal
    fig.suptitle('DASHBOARD COMPLETO - ANÁLISIS KAIZEN CAFETERÍA', 
                 fontsize=20, fontweight='bold', y=0.98)
    
    # Crear directorio si no existe
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    return output_path

if __name__ == "__main__":
    # Ejemplo de uso para testing
    from backend.src.generate_data import generate_simulation_data
    from backend.src.statistical_analysis import comprehensive_analysis
    
    print("Generando datos de prueba...")
    df_before, df_after = generate_simulation_data(seed=42)
    
    print("Realizando análisis...")
    analysis = comprehensive_analysis(df_before, df_after)
    
    print("Generando gráficos...")
    plots = generate_all_plots(df_before, df_after, analysis)
    
    print("Generando dashboard completo...")
    dashboard = create_combined_dashboard(df_before, df_after, analysis)
    
    print(f"✅ Dashboard completo generado: {dashboard}")

