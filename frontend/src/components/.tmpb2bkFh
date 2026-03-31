import * as Sentry from '@sentry/react';

/**
 * Componente para probar la integración con Sentry
 *
 * SOLO USAR EN DESARROLLO - Este componente permite generar
 * errores de prueba para verificar que Sentry está capturando
 * correctamente los errores.
 *
 * @example
 * // En tu componente de Settings o Debug:
 * {process.env.NODE_ENV === 'development' && <TestError />}
 */
export function TestError() {
  const throwReactError = () => {
    throw new Error('Error de prueba para Sentry - React Error Boundary');
  };

  const captureJsError = () => {
    try {
      // Simular un error en un try-catch
      throw new Error('Error capturado manualmente con captureException');
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          section: 'test-error',
          action: 'captureJsError',
        },
        extra: {
          timestamp: new Date().toISOString(),
        },
      });
      alert('Error capturado y enviado a Sentry (revisa la consola y Sentry dashboard)');
    }
  };

  const sendWarning = () => {
    Sentry.captureMessage('Esto es una advertencia de prueba', 'warning');
    Sentry.setTag('test_category', 'sentry-testing');
    alert('Advertencia enviada a Sentry');
  };

  const sendInfo = () => {
    Sentry.captureMessage('Mensaje informativo de prueba', 'info');
    alert('Mensaje informativo enviado a Sentry');
  };

  return (
    <div className="p-4 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50">
      <h3 className="text-sm font-semibold text-orange-800 mb-2">
        🧪 Sentry Testing Panel (Solo Dev)
      </h3>
      <p className="text-xs text-orange-600 mb-3">
        Usa estos botones para probar la integración con Sentry
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={throwReactError}
          className="px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
        >
          Lanzar Error React
        </button>
        <button
          onClick={captureJsError}
          className="px-3 py-1.5 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
        >
          Capturar Error JS
        </button>
        <button
          onClick={sendWarning}
          className="px-3 py-1.5 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors"
        >
          Enviar Warning
        </button>
        <button
          onClick={sendInfo}
          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
        >
          Enviar Info
        </button>
      </div>
      <p className="text-xs text-orange-500 mt-2">
        Nota: En desarrollo, los errores se muestran en consola pero no se envían a Sentry
      </p>
    </div>
  );
}

export default TestError;
