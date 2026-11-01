import { create } from 'apisauce';
import { Auth } from '../Redux/reducers/auth';
import { store } from '../Redux/store';
import { getServer } from '../Utils/url';
import { Error } from '../Redux/reducers/error';

export const GET = 'GET';
export const FIND = 'FIND';
export const SAVE = 'POST';
export const UPDATE = 'PATCH';
export const FILE_SAVE = 'FILE_SAVE';
export const FILE_UPDATE = 'FILE_UPDATE';
export const DELETE = 'DELETE';

export const token = () => store.getState().auth.token;
// Define the api
const API = create({
  baseURL: getServer(),
});
const monitor = response => {
  if (response.status === 401) {
    store.dispatch(Auth.authClear());
  }
  if (!response.ok) {
    if (response.status !== 401) {
      let aExclusions = ['/users'];
      if (aExclusions.indexOf(response.config.url) !== -1) {
        store.dispatch(Error.errorSet(response));
      }
    }
  }
};

API.addMonitor(monitor);

export async function login(email, password) {
  return await API.post('/auth', { email, password, strategy: 'local' });
}

export async function verify(sToken) {
  return await API.get(
    `/verify/${sToken}`,
    {},
    {
      headers: {
        'x-api-key': 'FTQrGvZPbhwI/n1poyJEgDETP4DcBi/SomxN7jQpOR0=',
      },
    }
  );
}

/**
 * Generic function to make api calls
 * @param {ENUM} operation - Consts FIND, GET, SAVE or UPDATE
 * @param {string} model - Model name in API
 * @param {object} payload - Data to send
 * @param {object} params - Object that can contain id of model or queries and skip for find calls.
 */
export async function process(operation, model, payload = {}, params = {}) {
  const { id, queries, limit, skip } = params || {};
  const oAuth = {
    headers: {
      Authorization: `BEARER ${token()}`,
    },
  };

  switch (operation) {
    case FIND:
      return await API.get(
        `/${model}?${queries ? queries + '&' : ''}${
          limit ? '$limit=' + limit : ''
        }&$skip=${skip}`,
        null,
        oAuth
      );
    case GET:
      return await API.get(`/${model}/${id}${queries || ''}`, null, oAuth);
    case SAVE:
      return await API.post(`/${model}`, payload, oAuth);
    case UPDATE:
      return await API.patch(`/${model}/${id}`, payload, oAuth);
    case DELETE:
      return await API.delete(`/${model}/${id}`, null, oAuth);
    case FILE_SAVE:
      return await API.post(`/${model}`, payload, {
        headers: {
          Authorization: `BEARER ${token()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    case FILE_UPDATE:
      return await API.patch(`/${model}/${id}`, payload, {
        headers: {
          Authorization: `BEARER ${token()}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    default:
      return null;
  }
}
