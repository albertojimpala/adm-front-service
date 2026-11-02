import PropTypes from 'prop-types';
import { AutoComplete, Col, Form, Input, Row } from 'antd';
import { GOVERNMENT_PLATFORMS } from '../../Utils/constants';

const PLATFORM_OPTIONS = GOVERNMENT_PLATFORMS.map(({ name, label }) => ({
  value: name,
  label: `${name} · ${label}`,
}));

// cuenta de acceso del cliente a una plataforma; al editar, la contraseña vacía se conserva
export const ClientCredentialForm = ({
  formRef,
  onSubmit,
  initialValues,
  editing,
}) => {
  // al elegir una plataforma conocida se llena el sitio si esta vacio
  const _handlePlatform = sPlatform => {
    const oPlatform = GOVERNMENT_PLATFORMS.find(
      oItem => oItem.name === sPlatform,
    );
    if (oPlatform?.url && !formRef.getFieldValue('url')) {
      formRef.setFieldValue('url', oPlatform.url);
    }
  };

  return (
    <Form
      autoComplete="off"
      form={formRef}
      initialValues={initialValues}
      layout="vertical"
      name="ClientCredentialForm"
      onFinish={onSubmit}
    >
      <Row gutter={[12, 0]}>
        <Col xs={24} sm={10}>
          <Form.Item
            label="Plataforma"
            name="platform"
            rules={[
              { required: true, message: 'Campo requerido' },
              { min: 2, max: 100 },
            ]}
          >
            <AutoComplete
              filterOption={(sInput, oOption) =>
                oOption.label.toLowerCase().includes(sInput.toLowerCase())
              }
              onSelect={_handlePlatform}
              options={PLATFORM_OPTIONS}
              placeholder="SAT, IMSS, INFONAVIT..."
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={14}>
          <Form.Item
            label="Sitio de acceso"
            name="url"
            rules={[{ type: 'url', message: 'URL no válida' }, { max: 500 }]}
          >
            <Input placeholder="https://" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            extra="RFC, NSS, registro patronal, etc."
            label="Usuario"
            name="username"
            rules={[{ max: 250 }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { type: 'email', message: 'Email no válido' },
              { max: 250 },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24}>
          <Form.Item
            extra={editing ? 'Vacío = conservar la contraseña actual' : null}
            label="Contraseña"
            name="password"
            rules={[{ max: 250 }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24}>
          <Form.Item label="Notas" name="notes">
            <Input.TextArea
              placeholder="Ej. vigencia de la e.firma, preguntas de seguridad"
              rows={2}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

ClientCredentialForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  editing: PropTypes.bool,
};
