import PropTypes from 'prop-types';
import { Alert, Col, Form, Input, Row, Select } from 'antd';
import { useCatalog } from '../../Hooks';
import { STATUS_OPTIONS } from '../../Utils/constants';
import { ClientSelect, EmployeeSelect } from '../Atoms/RemoteSelect';

export const UserForm = ({
  formRef,
  onSubmit,
  initialValues,
  isEdit,
  selected,
}) => {
  const [roles, loadingRoles] = useCatalog('roles');
  const sRoleId = Form.useWatch('roleId', formRef);
  // los usuarios con rol client son del portal y van ligados a un cliente
  const bClientRole =
    roles.find(oRole => oRole.id === sRoleId)?.tag === 'client';

  return (
    <Form
      form={formRef}
      initialValues={initialValues}
      layout="vertical"
      name="UserForm"
      onFinish={onSubmit}
    >
      <Row gutter={[12, 0]}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Usuario"
            name="username"
            rules={[
              { required: true, message: 'Campo requerido' },
              { max: 20 },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Campo requerido' },
              { type: 'email', message: 'Email no válido' },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            extra={isEdit ? 'Déjala vacía para conservar la actual' : undefined}
            label="Contraseña"
            name="password"
            rules={[
              { required: !isEdit, message: 'Campo requerido' },
              { min: 6, message: 'Mínimo 6 caracteres' },
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            dependencies={['password']}
            label="Repetir contraseña"
            name="confirmPassword"
            rules={[
              ({ getFieldValue }) => ({
                validator: (_, value) =>
                  (value || '') === (getFieldValue('password') || '')
                    ? Promise.resolve()
                    : Promise.reject(new Error('Las contraseñas no coinciden')),
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Rol"
            name="roleId"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <Select
              loading={loadingRoles}
              onChange={() =>
                formRef.setFieldsValue({
                  clientId: undefined,
                  employeeId: undefined,
                })
              }
              options={roles.map(oRole => ({
                value: oRole.id,
                label: oRole.description,
              }))}
              placeholder="Selecciona un rol"
            />
          </Form.Item>
        </Col>
        {isEdit && (
          <Col xs={24} sm={12}>
            <Form.Item label="Estatus" name="status">
              <Select options={STATUS_OPTIONS} />
            </Form.Item>
          </Col>
        )}
        {bClientRole ? (
          <Col xs={24} sm={24}>
            <Alert
              showIcon
              style={{ marginBottom: 12 }}
              title="Usuario del portal: solo verá la información de este cliente y solo podrá cambiar su email y teléfono."
              type="info"
            />
            <Form.Item
              label="Cliente"
              name="clientId"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <ClientSelect
                initialOption={
                  selected?.client
                    ? { value: selected.client.id, label: selected.client.name }
                    : undefined
                }
              />
            </Form.Item>
          </Col>
        ) : (
          <Col xs={24} sm={24}>
            <Form.Item
              extra="Opcional: liga el usuario a un empleado"
              label="Empleado"
              name="employeeId"
            >
              <EmployeeSelect
                initialOption={
                  selected?.employee
                    ? {
                        value: selected.employee.id,
                        label: `${selected.employee.firstName} ${selected.employee.lastName}`,
                      }
                    : undefined
                }
              />
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form>
  );
};

UserForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  isEdit: PropTypes.bool,
  selected: PropTypes.object,
};
