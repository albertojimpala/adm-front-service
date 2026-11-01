import React from 'react';
import { Select } from 'antd';

export const aSearchElements = (aRoles = []) => [
  {
    label: 'Nombre/Email',
    name: 'full_name,email',
    or: true,
    type: 'input',
  },
  {
    label: 'Role',
    name: 'rol_id',
    placeholder: 'Todos',
    type: 'select',
    values: () => (
      <>
        {aRoles.map(oRole => (
          <Select.Option key={oRole.id} value={oRole.id}>
            {oRole.name}
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
  'full_name,email': '',
  rol_id: undefined,
  status: undefined,
};
