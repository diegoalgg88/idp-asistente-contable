import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals'

const sendToAnalytics = (metric: Metric) => {
  const body = {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    navigationType: metric.navigationType,
  }

  // Enviar a servicio de analytics (actualmente solo console.log)
  // En producción, enviar a tu servicio de monitoreo
  console.log('[Web Vitals]', metric.name, metric.value, metric.rating)

  // Ejemplo de envío a endpoint de analytics:
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(body),
  // })
}

export function reportWebVitals() {
  onCLS(sendToAnalytics)
  onFCP(sendToAnalytics)
  onLCP(sendToAnalytics)
  onTTFB(sendToAnalytics)
  onINP(sendToAnalytics) // Reemplaza a onFID en web-vitals v4
}

export default reportWebVitals
