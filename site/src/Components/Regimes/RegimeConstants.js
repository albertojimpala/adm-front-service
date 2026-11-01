import React from 'react';
import { Select } from 'antd';

export const aSearchElements = [
  {
    label: 'Descripcion',
    name: 'description',
    or: 'true',
    type: 'input',
  },
  {
    label: 'Nivel',
    name: 'type',
    placeholder: 'Todos',
    type: 'select',
    values: () => (
      <>
        <Select.Option value={0}>Fisicas</Select.Option>
        <Select.Option value={1}>Morales</Select.Option>
        <Select.Option value={2}>Ambos</Select.Option>
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
  code: '',
  description: '',
  type: '',
  status: '',
};
