import PropTypes from 'prop-types';
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { STATUS_OPTIONS } from '../../Utils/constants';
import { moneyInputProps } from '../../Utils/format';
import {
  CompanySelect,
  EmployeeSelect,
  RemoteSelect,
} from '../Atoms/RemoteSelect';

const RFC_PATTERN = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;

// empleados de la compañia elegida; se recarga al cambiar de compañia
const ManagerSelect = ({ formRef, selected, ...props }) => {
  const sCompanyId = Form.useWatch('companyId', formRef);
  return (
    <EmployeeSelect
      disabled={!sCompanyId}
      initialOption={
        selected?.manager
          ? {
              value: selected.manager.id,
              label: `${selected.manager.firstName} ${selected.manager.lastName}`,
            }
          : undefined
      }
      key={sCompanyId || 'none'}
      placeholder="Sin encargado"
      queries={{ companyId: sCompanyId }}
      {...props}
    />
  );
};

ManagerSelect.propTypes = {
  formRef: PropTypes.object,
  selected: PropTypes.object,
};

export const ClientForm = ({
  formRef,
  onSubmit,
  initialValues,
  isEdit,
  selected,
}) => (
  <Form
    form={formRef}
    initialValues={initialValues || { billingDay: 1, services: [] }}
    layout="vertical"
    name="ClientForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col xs={24} sm={24}>
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
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={16}>
        <Form.Item
          label="Nombre o razón social"
          name="name"
          rules={[{ required: true, message: 'Campo requerido' }, { max: 250 }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col xs={24} sm={8}>
        <Form.Item
          label="RFC"
          name="rfc"
          rules={[{ pattern: RFC_PATTERN, message: 'RFC no válido' }]}
        >
          <Input style={{ textTransform: 'uppercase' }} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Nombre comercial"
          name="tradeName"
          rules={[{ max: 250 }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item label="Régimen fiscal" name="regimeId">
          <RemoteSelect
            getLabel={oRegime => `${oRegime.code} - ${oRegime.description}`}
            initialOption={
              selected?.regime
                ? {
                    value: selected.regime.id,
                    label: `${selected.regime.code} - ${selected.regime.description}`,
                  }
                : undefined
            }
            model="regimes"
            placeholder="Selecciona un régimen"
          />
        </Form.Item>
      </Col>
    </Row>

    <Divider titlePlacement="start">Cobranza</Divider>
    <Row gutter={[12, 0]}>
      <Col xs={24} sm={24}>
        <Form.Item
          extra="Empleado responsable de atender al cliente (de la misma compañía)"
          label="Encargado"
          name="managerId"
        >
          <ManagerSelect formRef={formRef} selected={selected} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item label="Tipo de suscripción" name="subscriptionTypeId">
          <RemoteSelect
            initialOption={
              selected?.subscriptionType
                ? {
                    value: selected.subscriptionType.id,
                    label: selected.subscriptionType.description,
                  }
                : undefined
            }
            model="subscription-types"
            placeholder="Selecciona un tipo"
          />
        </Form.Item>
      </Col>
      <Col xs={24} sm={6}>
        <Form.Item
          extra="Día de vencimiento (1-28)"
          label="Día de pago"
          name="billingDay"
        >
          <InputNumber max={28} min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col xs={24} sm={6}>
        <Form.Item label="Fecha de alta" name="startDate">
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      {isEdit && (
        <Col xs={24} sm={6}>
          <Form.Item label="Estatus" name="status">
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
        </Col>
      )}
    </Row>

    <Divider titlePlacement="start">Contacto</Divider>
    <Row gutter={[12, 0]}>
      <Col xs={24} sm={12}>
        <Form.Item label="Contacto" name="contactName" rules={[{ max: 250 }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: 'email', message: 'Email no válido' }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item label="Teléfono" name="phone" rules={[{ max: 20 }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item label="Código postal" name="zipCode" rules={[{ max: 10 }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24}>
        <Form.Item label="Dirección" name="address">
          <Input />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item label="Ciudad" name="city" rules={[{ max: 100 }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item label="Estado" name="state" rules={[{ max: 100 }]}>
          <Input />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24}>
        <Form.Item label="Notas" name="notes">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Col>
    </Row>

    {!isEdit && (
      <>
        <Divider titlePlacement="start">Servicios contratados</Divider>
        <Form.List name="services">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <Space align="start" key={key} style={{ display: 'flex' }}>
                  <Form.Item
                    name={[name, 'serviceId']}
                    rules={[
                      { required: true, message: 'Selecciona un servicio' },
                    ]}
                    style={{ width: 240 }}
                  >
                    <RemoteSelect
                      getLabel={oService =>
                        `${oService.description} (${oService.price})`
                      }
                      model="services"
                      placeholder="Servicio"
                    />
                  </Form.Item>
                  <Form.Item name={[name, 'quantity']} initialValue={1}>
                    <InputNumber
                      min={1}
                      placeholder="Cant."
                      style={{ width: 80 }}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'price']}
                    tooltip="Vacío = precio de catálogo"
                  >
                    <InputNumber
                      {...moneyInputProps}
                      placeholder="Precio"
                      style={{ width: 130 }}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'year']}
                    initialValue={dayjs().year()}
                  >
                    <InputNumber
                      max={2100}
                      min={2000}
                      placeholder="Año"
                      style={{ width: 90 }}
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    style={{ marginTop: 8 }}
                  />
                </Space>
              ))}
              <Button
                block
                icon={<PlusOutlined />}
                onClick={() => add()}
                type="dashed"
              >
                Agregar servicio
              </Button>
            </>
          )}
        </Form.List>
      </>
    )}
  </Form>
);

ClientForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  isEdit: PropTypes.bool,
  selected: PropTypes.object,
};

const CLIENT_FIELDS = [
  'name',
  'tradeName',
  'rfc',
  'email',
  'phone',
  'contactName',
  'address',
  'zipCode',
  'city',
  'state',
  'notes',
  'billingDay',
  'regimeId',
  'subscriptionTypeId',
  'companyId',
  'managerId',
  'status',
];

export const clientToForm = row => ({
  ...CLIENT_FIELDS.reduce(
    (oValues, sField) => ({ ...oValues, [sField]: row[sField] }),
    {},
  ),
  startDate: row.startDate ? dayjs(row.startDate) : undefined,
});

// los campos vacios se mandan como null al editar (para borrarlos) y se omiten al crear
export const clientToPayload = (values, selected) => {
  const oPayload = CLIENT_FIELDS.reduce((oValues, sField) => {
    const value = values[sField];
    if (value === undefined || value === '' || value === null) {
      return selected ? { ...oValues, [sField]: null } : oValues;
    }
    return { ...oValues, [sField]: value };
  }, {});

  // billingDay y status no aceptan null
  if (oPayload.billingDay === null) {
    delete oPayload.billingDay;
  }
  if (oPayload.status === null) {
    delete oPayload.status;
  }
  if (oPayload.rfc) {
    oPayload.rfc = oPayload.rfc.toUpperCase();
  }
  oPayload.startDate = values.startDate
    ? values.startDate.format('YYYY-MM-DD')
    : selected
      ? null
      : undefined;

  if (!selected && values.services?.length) {
    oPayload.services = values.services.map(
      ({ serviceId, quantity, price, year }) => ({
        serviceId,
        quantity: quantity || 1,
        ...(price !== undefined && price !== null ? { price } : {}),
        ...(year ? { year } : {}),
      }),
    );
  }
  return oPayload;
};
