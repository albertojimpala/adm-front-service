import PropTypes from 'prop-types';
import { Col, DatePicker, Form, Input, Row } from 'antd';
import dayjs from 'dayjs';
import { ClientSelect } from '../Atoms/RemoteSelect';

// edicion de un cargo: solo vencimiento y notas, los montos no se modifican
export const ChargeForm = ({ formRef, onSubmit, initialValues }) => (
  <Form
    form={formRef}
    initialValues={initialValues}
    layout="vertical"
    name="ChargeForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col span={12}>
        <Form.Item
          label="Fecha de vencimiento"
          name="dueDate"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Notas" name="notes">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

ChargeForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};

export const chargeToForm = row => ({
  dueDate: row.dueDate ? dayjs(row.dueDate) : undefined,
  notes: row.notes,
});

export const chargeToPayload = ({ dueDate, notes }) => ({
  dueDate: dueDate?.format('YYYY-MM-DD'),
  notes: notes || undefined,
});

export const GenerateChargesForm = ({ formRef, onSubmit }) => (
  <Form
    form={formRef}
    initialValues={{ period: dayjs() }}
    layout="vertical"
    name="GenerateChargesForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col span={10}>
        <Form.Item
          label="Periodo"
          name="period"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <DatePicker
            format="MMMM YYYY"
            picker="month"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Col>
      <Col span={14}>
        <Form.Item
          extra="Vacío = todos los clientes activos"
          label="Cliente"
          name="clientId"
        >
          <ClientSelect placeholder="Todos" />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

GenerateChargesForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
};
