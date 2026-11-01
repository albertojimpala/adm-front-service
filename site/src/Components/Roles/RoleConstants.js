import React from 'react';
import { Select } from 'antd';

export const aSearchElements = [
  {
    label: 'Nombre',
    name: 'name',
    or: 'true',
    type: 'input',
  },
  {
    label: 'Grupo',
    name: 'group',
    or: 'true',
    type: 'input',
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
  name: '',
  group_2: '',
};
