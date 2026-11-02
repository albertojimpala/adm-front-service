import { feedback } from './feedback';

// muestra el error que regresa la API (NestJS manda message como string o arreglo)
export const showError = (response, sFallback = 'Ocurrió un error') => {
  const oData = response?.data;
  const message = oData?.message;

  if (!response?.status) {
    feedback.message.error('No se pudo conectar con el servidor');
  } else if (Array.isArray(message)) {
    feedback.notification.error({
      title: sFallback,
      description: message.map(sError => `• ${sError}`).join('\n'),
      style: { whiteSpace: 'pre-line' },
    });
  } else {
    feedback.message.error(message || sFallback);
  }
};
