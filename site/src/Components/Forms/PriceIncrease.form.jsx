import PropTypes from 'prop-types';
import { Col, Form, Input, InputNumber, Radio, Row, Switch } from 'antd';
import dayjs from 'dayjs';
import { moneyInputProps } from '../../Utils/format';
import { ClientSelect, RemoteSelect } from '../Atoms/RemoteSelect';

const MODES = {
  percent: {
    label: 'Porcentaje',
    extra: 'Sobre el precio vigente del año anterior. Ej. 10 = +10%',
  },
  amount: {
    label: 'Monto fijo',
    extra: 'Pesos a sumar al precio vigente del año anterior',
  },
  price: { label: 'Precio nuevo', extra: 'Precio fijo para el año' },
};

export const PriceIncreaseForm = ({ formRef, onSubmit }) => {
  const sMode = Form.useWatch('mode', formRef) || 'percent';

  return (
    <Form
      form={formRef}
      initialValues={{
        year: dayjs().year() + 1,
        mode: 'percent',
        overwrite: false,
      }}
      layout="vertical"
      name="PriceIncreaseForm"
      onFinish={onSubmit}
    >
      <Row gutter={[12, 0]}>
        <Col xs={24} sm={8}>
          <Form.Item
            label="Año"
            name="year"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            <InputNumber max={2100} min={2000} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={16}>
          <Form.Item label="Tipo de incremento" name="mode">
            <Radio.Group
              optionType="button"
              options={Object.entries(MODES).map(([value, { label }]) => ({
                value,
                label,
              }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            extra={MODES[sMode].extra}
            label={MODES[sMode].label}
            name="value"
            rules={[{ required: true, message: 'Campo requerido' }]}
          >
            {sMode === 'percent' ? (
              <InputNumber
                min={-100}
                precision={2}
                style={{ width: '100%' }}
                suffix="%"
              />
            ) : (
              <InputNumber
                {...moneyInputProps}
                min={sMode === 'price' ? 0 : undefined}
              />
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            extra="Si ya tiene precio capturado para ese año"
            label="Reemplazar precios existentes"
            name="overwrite"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            extra="Vacío = todos los servicios"
            label="Servicio"
            name="serviceId"
          >
            <RemoteSelect model="services" placeholder="Todos" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            extra="Vacío = todos los clientes activos"
            label="Cliente"
            name="clientId"
          >
            <ClientSelect placeholder="Todos" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24}>
          <Form.Item label="Notas" name="notes" rules={[{ max: 250 }]}>
            <Input placeholder="Ej. incremento anual 2027" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

PriceIncreaseForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
};

export const priceIncreaseToPayload = ({
  year,
  mode,
  value,
  overwrite,
  serviceId,
  clientId,
  notes,
}) => ({
  year,
  [mode]: value,
  overwrite,
  ...(serviceId ? { serviceId } : {}),
  ...(clientId ? { clientId } : {}),
  ...(notes ? { notes } : {}),
});
