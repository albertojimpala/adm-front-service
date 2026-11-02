import { create } from 'apisauce';
import dayjs from 'dayjs';
import { store } from '../Redux/store';
import { authClear } from '../Redux/reducers/auth';

export const GET = 'GET';
export const FIND = 'FIND';
export const SAVE = 'POST';
export const UPDATE = 'PATCH';
export const PUT = 'PUT';
export const DELETE = 'DELETE';

export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const API = create({ baseURL: API_URL });

// agrega el token a todas las peticiones
API.addRequestTransform(request => {
  const { token } = store.getState().auth;
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
});

// si el token ya no es valido se cierra la sesion
API.addMonitor(response => {
  if (response.status === 401 && store.getState().auth.token) {
    store.dispatch(authClear());
  }
});

// quita filtros vacios y convierte fechas dayjs a YYYY-MM-DD
export const cleanParams = (params = {}) =>
  Object.entries(params).reduce((oParams, [sKey, value]) => {
    if (value === undefined || value === null || value === '') {
      return oParams;
    }
    oParams[sKey] = dayjs.isDayjs(value) ? value.format('YYYY-MM-DD') : value;
    return oParams;
  }, {});

export async function login(email, password) {
  return await API.post('/auth/login', { email, password });
}

export async function logout() {
  return await API.post('/auth/logout');
}

// descarga un archivo protegido (PDF, imagen) como blob con el token de la sesion
export async function getFile(path) {
  return await API.get(`/${path}`, {}, { responseType: 'blob' });
}

// sube un archivo como multipart/form-data en el campo "file"
export async function uploadFile(path, file) {
  const oData = new FormData();
  oData.append('file', file);
  return await API.post(`/${path}`, oData);
}

// abre un PDF de la API en otra pestaña; si el navegador la bloquea se descarga
export async function openPdf(path, fileName = 'documento.pdf') {
  // la pestaña se abre antes de la peticion para que no la bloquee el navegador
  const oTab = window.open('', '_blank');
  const response = await getFile(path);
  if (!response?.ok) {
    oTab?.close();
    return response;
  }
  const sUrl = URL.createObjectURL(
    new Blob([response.data], { type: 'application/pdf' }),
  );
  if (oTab) {
    oTab.location.href = sUrl;
  } else {
    const oLink = document.createElement('a');
    oLink.href = sUrl;
    oLink.download = fileName;
    oLink.click();
  }
  setTimeout(() => URL.revokeObjectURL(sUrl), 60000);
  return response;
}

/**
 * Funcion generica para llamar a la API
 * @param {ENUM} operation - FIND, GET, SAVE, UPDATE, PUT o DELETE
 * @param {string} model - ruta del recurso en la API (ej. clients, clients/:id/services)
 * @param {object} payload - datos a enviar
 * @param {object} params - id del recurso y/o queries (filtros y paginacion)
 */
export async function process(operation, model, payload = {}, params = {}) {
  const { id, queries } = params || {};
  const sUrl = id ? `/${model}/${id}` : `/${model}`;

  switch (operation) {
    case FIND:
    case GET:
      return await API.get(sUrl, cleanParams(queries));
    case SAVE:
      return await API.post(sUrl, payload);
    case UPDATE:
      return await API.patch(sUrl, payload);
    case PUT:
      return await API.put(sUrl, payload);
    case DELETE:
      return await API.delete(sUrl, {}, { data: payload });
    default:
      return null;
  }
}
