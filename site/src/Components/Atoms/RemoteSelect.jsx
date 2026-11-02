import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { useFetchList } from '../../Hooks';

/**
 * Select que carga sus opciones de un recurso de la API
 * searchParam: nombre del filtro de la API para buscar en el servidor (ej. search)
 */
export const RemoteSelect = ({
  model,
  getLabel = oItem => oItem.description,
  queries = {},
  searchParam,
  initialOption,
  ...props
}) => {
  const [sSearch, setSearch] = useState('');
  const sLastSearch = useRef('');
  const [data, loading, change] = useFetchList(model, {
    status: 1,
    limit: 100,
    ...queries,
  });

  // busqueda en el servidor con un pequeño retraso
  useEffect(() => {
    if (!searchParam || sSearch === sLastSearch.current) {
      return undefined;
    }
    const nTimeout = setTimeout(() => {
      sLastSearch.current = sSearch;
      change({ status: 1, limit: 100, ...queries, [searchParam]: sSearch });
    }, 400);
    return () => clearTimeout(nTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sSearch, searchParam]);

  const aOptions = useMemo(() => {
    const aItems = data.data.map(oItem => ({
      value: oItem.id,
      label: getLabel(oItem),
      item: oItem,
    }));
    if (initialOption && !aItems.some(o => o.value === initialOption.value)) {
      aItems.unshift(initialOption);
    }
    return aItems;
  }, [data, getLabel, initialOption]);

  return (
    <Select
      allowClear
      loading={loading}
      options={aOptions}
      showSearch={
        searchParam
          ? { filterOption: false, onSearch: setSearch }
          : { optionFilterProp: 'label' }
      }
      style={{ width: '100%' }}
      {...props}
    />
  );
};

RemoteSelect.propTypes = {
  model: PropTypes.string.isRequired,
  getLabel: PropTypes.func,
  queries: PropTypes.object,
  searchParam: PropTypes.string,
  initialOption: PropTypes.object,
};

export const ClientSelect = props => (
  <RemoteSelect
    getLabel={oClient =>
      `${oClient.name}${oClient.rfc ? ` (${oClient.rfc})` : ''}`
    }
    model="clients"
    placeholder="Buscar cliente"
    searchParam="search"
    {...props}
  />
);

export const AccountSelect = ({ queries, ...props }) => (
  <RemoteSelect
    getLabel={oAccount =>
      `${oAccount.name} - ${oAccount.type === 'bank' ? 'Banco' : 'Caja chica'}`
    }
    model="accounts"
    placeholder="Selecciona una cuenta"
    queries={queries}
    {...props}
  />
);

AccountSelect.propTypes = { queries: PropTypes.object };

export const CompanySelect = props => (
  <RemoteSelect
    getLabel={oCompany => oCompany.tradeName || oCompany.name}
    model="companies"
    placeholder="Selecciona una compañía"
    {...props}
  />
);

export const EmployeeSelect = props => (
  <RemoteSelect
    getLabel={oEmployee => `${oEmployee.firstName} ${oEmployee.lastName}`}
    model="employees"
    placeholder="Buscar empleado"
    searchParam="search"
    {...props}
  />
);
