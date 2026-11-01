import React from 'react';
import { Select } from 'antd';

export const aSearchElements = () => [
  {
    label: 'Nombre/Email',
    name: 'trade_name,email',
    or: true,
    type: 'input',
  },
  {
    label: 'RFC/CURP',
    name: 'rfc,curp',
    or: true,
    type: 'input',
  },
  {
    label: 'Tipo de Persona',
    name: 'person_type',
    placeholder: 'Todos',
    type: 'select',
    values: () => (
      <>
        <Select.Option key="F" value="F">
          Fisica
        </Select.Option>
        <Select.Option key="M" value="M">
          Moral
        </Select.Option>
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
  'trade_name,email': '',
  'rfc,curp': '',
  person_type: undefined,
  status: undefined,
};
