import React from 'react';
import { Select } from 'antd';

export const aSearchElements = (aClients = []) => [
  {
    label: 'Tipo',
    name: 'type',
    placeholder: 'Todos',
    type: 'select',
    values: () => (
      <>
        <Select.Option value={0}>FIEL</Select.Option>
        <Select.Option value={1}>IDSE</Select.Option>
        <Select.Option value={2}>Escritorio Virtual IMSS</Select.Option>
        <Select.Option value={3}>REPSE</Select.Option>
        <Select.Option value={4}>INFONAVIT</Select.Option>
        <Select.Option value={5}>CSD</Select.Option>
        <Select.Option value={6}>Facturacion</Select.Option>
        <Select.Option value={7}>Otro</Select.Option>
      </>
    ),
  },
  {
    label: 'Cliente',
    name: 'client_id',
    placeholder: 'Todos',
    type: 'select',
    values: () => (
      <>
        {aClients?.map(oClient => (
          <Select.Option value={oClient.id} key={oClient.id}>
            {oClient.trade_name}
          </Select.Option>
        ))}
      </>
    ),
  },
  {
    label: 'Estatus',
    name: 'status',
    placeholder: 'Todos',
    type: 'select',
    values: () => (
      <>
        <Select.Option value={1}>Activo</Select.Option>
        <Select.Option value={0}>Inactivo</Select.Option>
      </>
    ),
  },
];

export const oInitState = {
  status: '',
};
