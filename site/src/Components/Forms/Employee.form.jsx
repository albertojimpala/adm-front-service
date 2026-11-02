import PropTypes from 'prop-types';
import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { STATUS_OPTIONS } from '../../Utils/constants';
import { CompanySelect, RemoteSelect } from '../Atoms/RemoteSelect';
import { cleanPayload } from './Company.form';

export const EmployeeForm = ({
  formRef,
  onSubmit,
  initialValues,
  isEdit,
  selected,
}) => {
  const sCompanyId = Form.useWatch('companyId', formRef);

  return (
    <Form
      form={formRef}
      initialValues={initialValues}
      layout="vertical"
      name="EmployeeForm"
      onFinish={onSubmit}
    >
      <Row gutter={[12, 0]}>
        <Col span={10}>
          <Form.Item
            label="Nombre(s)"
            name="firstName"
            rules={[
              { required: true, message: 'Campo requerido' },
              { max: 100 },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={14}>
          <Form.Item
            label="Apellidos"
            name="lastName"
            rules={[
              { required: true, message: 'Campo requerido' },
              { max: 150 },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Compañía"
            name="companyId"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <CompanySelect
              initialOption={
                selected?.company
                  ? { value: selected.company.id, label: selected.company.name }
                  : undefined
              }
              onChange={() => formRef.setFieldsValue({ positionId: undefined })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Puesto" name="positionId">
            {/* key recarga los puestos al cambiar de compañia */}
            <RemoteSelect
              disabled={!sCompanyId}
              initialOption={
                selected?.position
                  ? {
                      value: selected.position.id,
                      label: selected.position.description,
                    }
                  : undefined
              }
              key={sCompanyId || 'none'}
              model="positions"
              placeholder="Selecciona un puesto"
              queries={{ companyId: sCompanyId }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Email no válido' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Teléfono" name="phone" rules={[{ max: 20 }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="RFC"
            name="rfc"
            rules={[
              {
                pattern: /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/i,
                message: 'RFC no válido',
              },
            ]}
          >
            <Input style={{ textTransform: 'uppercase' }} />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="CURP"
            name="curp"
            rules={[{ len: 18, message: 'La CURP tiene 18 caracteres' }]}
          >
            <Input maxLength={18} style={{ textTransform: 'uppercase' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Ingreso" name="hireDate">
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {isEdit && (
          <Col span={12}>
            <Form.Item label="Estatus" name="status">
              <Select options={STATUS_OPTIONS} />
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form>
  );
};

EmployeeForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  isEdit: PropTypes.bool,
  selected: PropTypes.object,
};

const EMPLOYEE_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'rfc',
  'curp',
  'companyId',
  'positionId',
];

export const employeeToForm = row => ({
  ...EMPLOYEE_FIELDS.reduce(
    (o, sField) => ({ ...o, [sField]: row[sField] }),
    {},
  ),
  status: row.status,
  hireDate: row.hireDate ? dayjs(row.hireDate) : undefined,
});

export const employeeToPayload = (values, selected) => {
  const oPayload = cleanPayload(values, EMPLOYEE_FIELDS, selected);
  ['rfc', 'curp'].forEach(sField => {
    if (oPayload[sField]) {
      oPayload[sField] = oPayload[sField].toUpperCase();
    }
  });
  oPayload.hireDate = values.hireDate
    ? values.hireDate.format('YYYY-MM-DD')
    : selected
      ? null
      : undefined;
  return selected ? { ...oPayload, status: values.status } : oPayload;
};
