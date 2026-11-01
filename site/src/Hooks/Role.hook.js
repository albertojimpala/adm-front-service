import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { FIND, process } from '../Service/Api';

export const useFetchRoles = (queries = '', skip = 0, limit = 10) => {
  const [data, setData] = useState({ data: [] });
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({ queries, skip, limit });

  const getRoles = useCallback(async () => {
    setLoading(true);
    const response = await process(FIND, 'roles', {}, params);
    if (response?.ok) {
      setData(response.data);
    } else {
      message.error('Error al consultar roles');
    }
    setLoading(false);
  }, [process, params]);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  const onChangeParams = (q = '', s = 0, l = 10) =>
    setParams({ queries: q, skip: s, limit: l });

  const update = () => getRoles();

  return [data, loading, onChangeParams, update];
};
