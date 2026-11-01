import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { FIND, process } from '../Service/Api';

export const useFetchRegimes = (queries = '', skip = 0, limit = 10) => {
  const [data, setData] = useState({ data: [] });
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ queries, skip, limit });

  const getRegimes = useCallback(async () => {
    setLoading(true);
    const response = await process(FIND, 'regimes', {}, params);
    if (response?.ok) {
      setData(response.data);
    } else {
      message.error('Error al consultar regimenes');
    }
    setLoading(false);
  }, [process, params]);

  useEffect(() => {
    getRegimes();
  }, [getRegimes]);

  const onChangeParams = (q = '', s = 0, l = 10) =>
    setParams({ queries: q, skip: s, limit: l });

  const update = () => getRegimes();

  return [data, loading, onChangeParams, update];
};
