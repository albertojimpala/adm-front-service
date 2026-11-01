import React from 'react';
import PropTypes from 'prop-types';
import { Col, Form, Input, Row, Select, TreeSelect } from 'antd';

const { Option } = Select;

const actions = ['get', 'find', 'patch', 'create', 'manage'];
const subject = ['forgot', 'version', 'config', 'users', 'verify'];

const getTreeData = () => {
  return actions.map(oAction => ({
    title: oAction,
    value: `${oAction}.all`,
    children: subject.map(oSubject => ({
      title: oSubject,
      value: `${oAction}.${oSubject}`,
    })),
  }));
};

export const RoleForm = ({ formRef, isNew, selectLoading, onSubmit }) => {
  return (
    <Form form={formRef} layout="vertical" name="RoleForm" onFinish={onSubmit}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <Form.Item label="Nombre" name="name">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Grupo" name="group">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <Form.Item label="Permisos" name="permissions">
            <TreeSelect
              allowClear
              treeData={getTreeData()}
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              placeholder="Seleccione los permisos del rol"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Estatus" name="status" initialValue={1}>
            <Select disabled={isNew} loading={selectLoading}>
              <Option value={1}>Activo</Option>
              <Option value={0}>Inactivo</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

RoleForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  isNew: PropTypes.bool,
  selectLoading: PropTypes.bool,
};
