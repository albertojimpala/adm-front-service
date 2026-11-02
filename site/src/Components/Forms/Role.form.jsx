import PropTypes from 'prop-types';
import { Checkbox, Col, Form, Input, Row, Select, Table } from 'antd';
import {
  PERMISSION_ACTIONS,
  PERMISSION_MODULES,
  STATUS_OPTIONS,
} from '../../Utils/constants';

// matriz modulo x accion para el JSON de permisos del rol
const PermissionsMatrix = ({ value = {}, onChange }) => {
  const toggle = (sModule, sAction, bChecked) =>
    onChange({
      ...value,
      [sModule]: { ...(value[sModule] || {}), [sAction]: bChecked },
    });

  const toggleModule = (sModule, bChecked) =>
    onChange({
      ...value,
      [sModule]: Object.keys(PERMISSION_ACTIONS).reduce(
        (oActions, sAction) => ({ ...oActions, [sAction]: bChecked }),
        {},
      ),
    });

  const columns = [
    {
      dataIndex: 'label',
      title: 'Módulo',
      render: (sLabel, { key }) => {
        const aChecked = Object.keys(PERMISSION_ACTIONS).filter(
          sAction => value[key]?.[sAction],
        );
        return (
          <Checkbox
            checked={aChecked.length === Object.keys(PERMISSION_ACTIONS).length}
            indeterminate={
              aChecked.length > 0 &&
              aChecked.length < Object.keys(PERMISSION_ACTIONS).length
            }
            onChange={e => toggleModule(key, e.target.checked)}
          >
            {sLabel}
          </Checkbox>
        );
      },
    },
    ...Object.entries(PERMISSION_ACTIONS).map(([sAction, sLabel]) => ({
      key: sAction,
      title: sLabel,
      align: 'center',
      render: (_, { key }) => (
        <Checkbox
          checked={Boolean(value[key]?.[sAction])}
          onChange={e => toggle(key, sAction, e.target.checked)}
        />
      ),
    })),
  ];

  return (
    <Table
      columns={columns}
      dataSource={Object.entries(PERMISSION_MODULES).map(([key, label]) => ({
        key,
        label,
      }))}
      pagination={false}
      size="small"
    />
  );
};

PermissionsMatrix.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
};

export const RoleForm = ({ formRef, onSubmit, initialValues, isEdit }) => (
  <Form
    form={formRef}
    initialValues={initialValues || { permissions: {} }}
    layout="vertical"
    name="RoleForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col span={12}>
        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={isEdit ? 6 : 12}>
        <Form.Item
          extra="La API valida admin o users"
          label="Tag"
          name="tag"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <Input />
        </Form.Item>
      </Col>
      {isEdit && (
        <Col span={6}>
          <Form.Item label="Estatus" name="status">
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
        </Col>
      )}
      <Col span={24}>
        <Form.Item label="Permisos" name="permissions">
          <PermissionsMatrix />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

RoleForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  isEdit: PropTypes.bool,
};

export const parseRolePermissions = aPermissions => {
  try {
    return JSON.parse(aPermissions?.[0] || '{}');
  } catch {
    return {};
  }
};
