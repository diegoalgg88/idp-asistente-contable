"""
Servicio de Pronóstico de Impuestos (Prophet) para la Fase 10.
"""
import pandas as pd
import logging
from typing import List, Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)

try:
    from prophet import Prophet
except ImportError:
    Prophet = None
    logger.warning("Prophet not installed. Fallback simple average will be used.")

try:
    import holidays
except ImportError:
    holidays = None
    logger.warning("Holidays missing, MX holidays will not be applied to the forecaster.")

class TaxForecaster:
    """
    Forecasting de Impuestos Mensuales (IVA/ISR) usando Prophet 
    con Estacionalidad Mexicana.
    """
    def __init__(self):
        self.mx_holidays = None
        if holidays is not None:
            # Extraer años de iteración básica para holidays mex (2020 a 2030 aprox)
            self.mx_holidays = holidays.MX(years=[x for x in range(2020, 2031)])

    def predict_tax(self, history_data: List[Dict[str, Any]], months_ahead: int = 3) -> Dict[str, Any]:
        """
        Produce proyecciones de impuestos dada una historia.
        Genera proyecciones de IVA e ISR simulando una tendencia generalizada.

        El dataset histórico esperado `history_data` contiene:
        {'ds': 'YYYY-MM-DD', 'y': 1000.0}
        """
        if Prophet is None:
            # Fallback trivial en caso de no instalar dependencias
            return self._predict_fallback(history_data, months_ahead)

        if not history_data or len(history_data) < 2:
            # Usar fallback en lugar de lanzar error
            logger.info("Histórico insuficiente (< 2 puntos), usando fallback")
            return self._predict_fallback(history_data, months_ahead)

        df = pd.DataFrame(history_data)
        df['ds'] = pd.to_datetime(df['ds'])
        
        # Iniciar modelo
        m = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            seasonality_mode='multiplicative'
        )
        
        # Añadir holidays si están disponibles
        if self.mx_holidays:
            holiday_df = pd.DataFrame(
                list(self.mx_holidays.items()),
                columns=['ds', 'holiday']
            )
            holiday_df['ds'] = pd.to_datetime(holiday_df['ds'])
            # Prophet requires specific column names 'holiday' and 'ds'
            # To add them correctly we use add_country_holidays
            m.add_country_holidays(country_name='MX')

        try:
            m.fit(df)
            future = m.make_future_dataframe(periods=months_ahead, freq='M')
            forecast = m.predict(future)
            
            # Limpiar forecast para retorno en JSON
            forecast_recent = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(months_ahead)
            
            results = []
            for _, row in forecast_recent.iterrows():
                results.append({
                    "date": row['ds'].strftime('%Y-%m-%d'),
                    "predicted_amount": round(float(row['yhat']), 2),
                    "lower_bound": round(float(row['yhat_lower']), 2),
                    "upper_bound": round(float(row['yhat_upper']), 2)
                })
                
            return {
                "status": "success",
                "months_projected": months_ahead,
                "forecast": results
            }
        except Exception as e:
            logger.error(f"Prophet failed to fit/predict: {e}")
            return self._predict_fallback(history_data, months_ahead)

    def _predict_fallback(self, history_data: List[Dict[str, Any]], months: int) -> Dict[str, Any]:
        """
        Calcula un promedio simple + 5% heurístico transitorio para cuando no corre Prophet.
        """
        logger.info("Usando Fallback (promedios móviles) para proyección de Impuestos.")
        
        if not history_data:
            average = 0.0
        else:
            average = sum(item['y'] for item in history_data) / len(history_data)
            
        last_date = pd.to_datetime(history_data[-1]['ds']) if history_data else pd.to_datetime(datetime.utcnow())
        
        results = []
        for i in range(1, months + 1):
            future_date = last_date + pd.DateOffset(months=i)
            inflation_factor = 1.0 + (0.01 * i)
            pred = average * inflation_factor
            
            results.append({
                "date": future_date.strftime('%Y-%m-%d'),
                "predicted_amount": round(pred, 2),
                "lower_bound": round(pred * 0.9, 2),
                "upper_bound": round(pred * 1.1, 2)
            })
            
        return {
            "status": "success_fallback",
            "months_projected": months,
            "forecast": results
        }
