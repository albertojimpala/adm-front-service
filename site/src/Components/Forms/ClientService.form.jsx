import PropTypes from 'prop-types';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import dayjs from 'dayjs';
import { moneyInputProps } from '../../Utils/format';
import { RemoteSelect } from '../Atoms/RemoteSelect';

// agregar un servicio a un cliente
export const ClientServiceForm = ({ formRef, onSubmit }) => (
  <Form
    form={formRef}
    initialValues={{ quantity: 1, year: dayjs().year() }}
    layout="vertical"
    name="ClientServiceForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col span={24}>
        <Form.Item
          label="Servicio"
          name="serviceId"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <RemoteSelect
            getLabel={oService => `${oService.description} (${oService.price})`}
            model="services"
            placeholder="Selecciona un servicio"
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="Cantidad" name="quantity">
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          extra="Vacío = precio de catálogo"
          label="Precio"
          name="price"
        >
          <InputNumber {...moneyInputProps} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="A partir del año" name="year">
          <InputNumber max={2100} min={2000} style={{ width: '100%' }} />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

ClientServiceForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
};

// precio de un servicio para un año
export const ServicePriceForm = ({ formRef, onSubmit, initialValues }) => (
  <Form
    form={formRef}
    initialValues={initialValues}
    layout="vertical"
    name="ServicePriceForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col span={10}>
        <Form.Item
          label="Año"
          name="year"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <InputNumber max={2100} min={2000} style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={14}>
        <Form.Item
          label="Precio mensual"
          name="price"
          rules={[{ required: true, message: 'Campo requerido' }]}
        >
          <InputNumber {...moneyInputProps} />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label="Notas" name="notes" rules={[{ max: 250 }]}>
          <Input placeholder="Ej. incremento anual" />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

ServicePriceForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};
