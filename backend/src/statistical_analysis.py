"""
Análisis estadístico para proyecto Kaizen - Cafetería
Implementa Welch t-test y Cohen's d para comparar antes vs después
"""

import numpy as np
import pandas as pd
from scipy import stats
from typing import Dict, Any, Tuple
import warnings
warnings.filterwarnings('ignore')

def welch_ttest(before_data: np.ndarray, after_data: np.ndarray, 
                alpha: float = 0.05) -> Dict[str, Any]:
    """
    Realiza Welch t-test para muestras independientes con varianzas desiguales
    
    Args:
        before_data: Array con tiempos antes
        after_data: Array con tiempos después
        alpha: Nivel de significancia (default 0.05)
    
    Returns:
        Diccionario con resultados del test
    """
    # Realizar Welch t-test (equal_var=False)
    t_statistic, p_value = stats.ttest_ind(before_data, after_data, equal_var=False)
    
    # Calcular grados de libertad para Welch t-test
    n1, n2 = len(before_data), len(after_data)
    s1, s2 = np.var(before_data, ddof=1), np.var(after_data, ddof=1)
    
    # Fórmula de Welch para grados de libertad
    numerator = (s1/n1 + s2/n2)**2
    denominator = (s1/n1)**2/(n1-1) + (s2/n2)**2/(n2-1)
    df = numerator / denominator
    
    # Valor crítico
    t_critical = stats.t.ppf(1 - alpha/2, df)
    
    # Intervalo de confianza para la diferencia de medias
    mean_diff = np.mean(before_data) - np.mean(after_data)
    se_diff = np.sqrt(s1/n1 + s2/n2)
    ci_lower = mean_diff - t_critical * se_diff
    ci_upper = mean_diff + t_critical * se_diff
    
    return {
        't_statistic': float(t_statistic),
        'p_value': float(p_value),
        'degrees_freedom': float(df),
        't_critical': float(t_critical),
        'is_significant': p_value < alpha,
        'alpha': alpha,
        'mean_difference': float(mean_diff),
        'se_difference': float(se_diff),
        'ci_lower': float(ci_lower),
        'ci_upper': float(ci_upper),
        'interpretation': interpret_ttest_result(p_value, alpha, mean_diff)
    }

def cohens_d(before_data: np.ndarray, after_data: np.ndarray) -> Dict[str, Any]:
    """
    Calcula Cohen's d para medir el tamaño del efecto
    
    Args:
        before_data: Array con tiempos antes
        after_data: Array con tiempos después
    
    Returns:
        Diccionario con Cohen's d y su interpretación
    """
    # Medias
    mean1, mean2 = np.mean(before_data), np.mean(after_data)
    
    # Desviaciones estándar
    std1, std2 = np.std(before_data, ddof=1), np.std(after_data, ddof=1)
    
    # Tamaños de muestra
    n1, n2 = len(before_data), len(after_data)
    
    # Desviación estándar pooled
    pooled_std = np.sqrt(((n1-1)*std1**2 + (n2-1)*std2**2) / (n1+n2-2))
    
    # Cohen's d
    d = (mean1 - mean2) / pooled_std
    
    return {
        'cohens_d': float(d),
        'pooled_std': float(pooled_std),
        'effect_size_interpretation': interpret_cohens_d(abs(d)),
        'direction': 'improvement' if d > 0 else 'deterioration' if d < 0 else 'no_change'
    }

def interpret_ttest_result(p_value: float, alpha: float, mean_diff: float) -> str:
    """
    Interpreta el resultado del t-test en contexto de negocio
    """
    if p_value < alpha:
        direction = "reducción" if mean_diff > 0 else "aumento"
        return f"Hay evidencia estadísticamente significativa de {direction} en el tiempo de atención (p={p_value:.4f})"
    else:
        return f"No hay evidencia estadísticamente significativa de cambio en el tiempo de atención (p={p_value:.4f})"

def interpret_cohens_d(d_abs: float) -> str:
    """
    Interpreta el tamaño del efecto según Cohen's d
    """
    if d_abs < 0.2:
        return "Efecto pequeño"
    elif d_abs < 0.5:
        return "Efecto pequeño a mediano"
    elif d_abs < 0.8:
        return "Efecto mediano"
    else:
        return "Efecto grande"

def comprehensive_analysis(df_before: pd.DataFrame, df_after: pd.DataFrame) -> Dict[str, Any]:
    """
    Realiza análisis estadístico completo
    
    Args:
        df_before: DataFrame con datos antes
        df_after: DataFrame con datos después
    
    Returns:
        Diccionario con todos los resultados del análisis
    """
    before_times = df_before['tiempo_atencion_min'].values
    after_times = df_after['tiempo_atencion_min'].values
    
    # Estadísticas descriptivas
    descriptive_stats = {
        'antes': {
            'n': len(before_times),
            'media': float(np.mean(before_times)),
            'mediana': float(np.median(before_times)),
            'std': float(np.std(before_times, ddof=1)),
            'var': float(np.var(before_times, ddof=1)),
            'min': float(np.min(before_times)),
            'max': float(np.max(before_times)),
            'q25': float(np.percentile(before_times, 25)),
            'q75': float(np.percentile(before_times, 75)),
            'iqr': float(np.percentile(before_times, 75) - np.percentile(before_times, 25))
        },
        'despues': {
            'n': len(after_times),
            'media': float(np.mean(after_times)),
            'mediana': float(np.median(after_times)),
            'std': float(np.std(after_times, ddof=1)),
            'var': float(np.var(after_times, ddof=1)),
            'min': float(np.min(after_times)),
            'max': float(np.max(after_times)),
            'q25': float(np.percentile(after_times, 25)),
            'q75': float(np.percentile(after_times, 75)),
            'iqr': float(np.percentile(after_times, 75) - np.percentile(after_times, 25))
        }
    }
    
    # Tests estadísticos
    ttest_results = welch_ttest(before_times, after_times)
    cohens_results = cohens_d(before_times, after_times)
    
    # Test de normalidad (Shapiro-Wilk para muestras pequeñas, Anderson-Darling para grandes)
    if len(before_times) <= 50:
        normality_before = stats.shapiro(before_times)
        normality_after = stats.shapiro(after_times)
    else:
        normality_before = stats.anderson(before_times, dist='norm')
        normality_after = stats.anderson(after_times, dist='norm')
    
    # Test de igualdad de varianzas (Levene)
    levene_test = stats.levene(before_times, after_times)
    
    # Cálculos de mejora
    mean_before = descriptive_stats['antes']['media']
    mean_after = descriptive_stats['despues']['media']
    absolute_reduction = mean_before - mean_after
    percentage_reduction = (absolute_reduction / mean_before) * 100
    
    # Conclusiones de negocio
    business_impact = {
        'reduccion_absoluta_min': float(absolute_reduction),
        'reduccion_porcentual': float(percentage_reduction),
        'tiempo_ahorrado_por_cliente': float(absolute_reduction),
        'significancia_estadistica': ttest_results['is_significant'],
        'magnitud_efecto': cohens_results['effect_size_interpretation'],
        'direccion_cambio': cohens_results['direction'],
        'confianza_resultado': 95 if ttest_results['is_significant'] else None
    }
    
    return {
        'estadisticas_descriptivas': descriptive_stats,
        'welch_ttest': ttest_results,
        'cohens_d': cohens_results,
        'normalidad': {
            'antes': {'statistic': float(normality_before[0]), 'p_value': float(normality_before[1])},
            'despues': {'statistic': float(normality_after[0]), 'p_value': float(normality_after[1])}
        },
        'levene_test': {'statistic': float(levene_test[0]), 'p_value': float(levene_test[1])},
        'impacto_negocio': business_impact,
        'resumen_ejecutivo': generate_executive_summary(business_impact, ttest_results, cohens_results)
    }

def generate_executive_summary(business_impact: Dict, ttest_results: Dict, cohens_results: Dict) -> str:
    """
    Genera resumen ejecutivo del análisis
    """
    reduction = business_impact['reduccion_porcentual']
    significance = business_impact['significancia_estadistica']
    effect_size = cohens_results['effect_size_interpretation']
    
    if significance and reduction > 0:
        summary = f"""
RESULTADOS DEL ANÁLISIS KAIZEN - CAFETERÍA

✅ MEJORA CONFIRMADA: Se logró una reducción del {reduction:.1f}% en el tiempo de atención.

📊 EVIDENCIA ESTADÍSTICA:
• Reducción promedio: {business_impact['reduccion_absoluta_min']:.2f} minutos por cliente
• Significancia estadística: p-value = {ttest_results['p_value']:.4f}
• Tamaño del efecto: {effect_size} (Cohen's d = {cohens_results['cohens_d']:.3f})

💼 IMPACTO DE NEGOCIO:
• Cada cliente ahorra {business_impact['tiempo_ahorrado_por_cliente']:.2f} minutos
• La mejora es estadísticamente significativa con 95% de confianza
• La implementación Kaizen ha sido efectiva
        """
    else:
        summary = f"""
RESULTADOS DEL ANÁLISIS KAIZEN - CAFETERÍA

⚠️ MEJORA NO CONFIRMADA: Los datos no muestran evidencia estadística de mejora significativa.

📊 EVIDENCIA ESTADÍSTICA:
• Cambio promedio: {business_impact['reduccion_absoluta_min']:.2f} minutos por cliente
• Significancia estadística: p-value = {ttest_results['p_value']:.4f}
• Tamaño del efecto: {effect_size}

💼 RECOMENDACIÓN:
• Revisar la implementación de las mejoras Kaizen
• Considerar factores adicionales que puedan estar afectando los resultados
• Recolectar más datos o extender el período de análisis
        """
    
    return summary.strip()

