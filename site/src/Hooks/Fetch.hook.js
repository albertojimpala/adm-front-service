import { useCallback, useEffect, useState } from 'react';
import { FIND, GET, process } from '../Service/Api';
import { showError } from '../Utils/errors';

const EMPTY_LIST = { data: [], meta: { total: 0, page: 1, limit: 10 } };

/**
 * Lista paginada de un recurso de la API
 * @returns [data, loading, change(queries), update()]
 */
export const useFetchList = (model, initialQueries = {}, enabled = true) => {
  const [data, setData] = useState(EMPTY_LIST);
  const [loading, setLoading] = useState(false);
  const [queries, setQueries] = useState({
    page: 1,
    limit: 10,
    ...initialQueries,
  });

  const getData = useCallback(async () => {
    if (!enabled || !model) {
      return;
    }
    setLoading(true);
    const response = await process(FIND, model, {}, { queries });
    if (response?.ok) {
      setData(response.data);
    } else {
      showError(response, 'Error al consultar la información');
    }
    setLoading(false);
  }, [model, queries, enabled]);

  useEffect(() => {
    getData();
  }, [getData]);

  // reemplaza los filtros conservando el tamaño de pagina, regresa a la pagina 1
  const change = (oQueries = {}, nPage = 1) =>
    setQueries(oPrev => ({
      limit: oPrev.limit,
      sort: oPrev.sort,
      order: oPrev.order,
      ...oQueries,
      page: nPage,
    }));

  const changePage = (nPage, nLimit) =>
    setQueries(oPrev => ({ ...oPrev, page: nPage, limit: nLimit }));

  return [data, loading, change, getData, { queries, changePage }];
};

/**
 * Un registro (o cualquier GET que no sea lista)
 * @returns [data, loading, update()]
 */
export const useFetchOne = (model, id, queries, enabled = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const sQueries = JSON.stringify(queries || {});

  const getData = useCallback(async () => {
    if (!enabled || !model) {
      return;
    }
    setLoading(true);
    const response = await process(
      GET,
      model,
      {},
      { id, queries: JSON.parse(sQueries) },
    );
    if (response?.ok) {
      setData(response.data);
    } else {
      showError(response, 'Error al consultar la información');
    }
    setLoading(false);
  }, [model, id, sQueries, enabled]);

  useEffect(() => {
    getData();
  }, [getData]);

  return [data, loading, getData];
};

// catalogo activo para llenar selects
export const useCatalog = (model, queries = {}) => {
  const [data, loading] = useFetchList(model, {
    status: 1,
    limit: 100,
    ...queries,
  });
  return [data.data, loading];
};
