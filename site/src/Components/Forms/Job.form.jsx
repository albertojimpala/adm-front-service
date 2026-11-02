import PropTypes from 'prop-types';
import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { JOB_PROGRESS, toOptions } from '../../Utils/constants';
import {
  ClientSelect,
  EmployeeSelect,
  RemoteSelect,
} from '../Atoms/RemoteSelect';

export const JobForm = ({
  formRef,
  onSubmit,
  initialValues,
  isEdit,
  selected,
}) => (
  <Form
    form={formRef}
    initialValues={initialValues || { progress: 'started' }}
    layout="vertical"
    name="JobForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col span={24}>
        <Form.Item
          label="Cliente"
          name="clientId"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <ClientSelect
            disabled={isEdit}
            initialOption={
              selected?.client
                ? { value: selected.client.id, label: selected.client.name }
                : undefined
            }
          />
        </Form.Item>
      </Col>
      <Col span={16}>
        <Form.Item
          label="Trabajo"
          name="title"
          rules={[{ required: true, message: 'Campo requerido' }, { max: 200 }]}
        >
          <Input placeholder="Ej. Contabilidad de octubre" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Periodo" name="period">
          <DatePicker
            format="MMMM YYYY"
            picker="month"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          extra={isEdit ? undefined : 'Vacío = el encargado del cliente'}
          label="Responsable"
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
      <Col span={12}>
        <Form.Item label="Servicio" name="serviceId">
          <RemoteSelect
            initialOption={
              selected?.service
                ? {
                    value: selected.service.id,
                    label: selected.service.description,
                  }
                : undefined
            }
            model="services"
            placeholder="Opcional"
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Inicio" name="startDate">
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Fecha compromiso" name="dueDate">
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      {!isEdit && (
        <Col span={8}>
          <Form.Item label="Avance" name="progress">
            <Select options={toOptions(JOB_PROGRESS)} />
          </Form.Item>
        </Col>
      )}
      <Col span={24}>
        <Form.Item label="Descripción" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

JobForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  isEdit: PropTypes.bool,
  selected: PropTypes.object,
};

const toDay = sDate => (sDate ? dayjs(sDate) : undefined);

export const jobToForm = row => ({
  clientId: row.clientId,
  title: row.title,
  description: row.description,
  employeeId: row.employeeId,
  serviceId: row.serviceId,
  period: row.period ? dayjs(`${row.period}-01`) : undefined,
  startDate: toDay(row.startDate),
  dueDate: toDay(row.dueDate),
});

// al editar los vacios van en null para poder borrarlos
export const jobToPayload = (values, selected) => {
  const empty = selected ? null : undefined;
  const oPayload = {
    title: values.title,
    description: values.description || empty,
    employeeId: values.employeeId || empty,
    serviceId: values.serviceId || empty,
    period: values.period ? values.period.format('YYYY-MM') : empty,
    startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : empty,
    dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : empty,
  };
  return selected
    ? oPayload
    : { ...oPayload, clientId: values.clientId, progress: values.progress };
};
