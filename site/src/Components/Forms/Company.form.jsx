import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, Col, Flex, Form, Input, Row, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFile } from '../../Service/Api';
import { feedback } from '../../Utils/feedback';
import { showError } from '../../Utils/errors';
import { CompanyLogo } from '../Atoms/CompanyLogo';
import { STATUS_OPTIONS } from '../../Utils/constants';
import { RemoteSelect } from '../Atoms/RemoteSelect';

const RFC_PATTERN = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;

export const CompanyForm = ({
  formRef,
  onSubmit,
  initialValues,
  isEdit,
  selected,
}) => (
  <Form
    form={formRef}
    initialValues={initialValues}
    layout="vertical"
    name="CompanyForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col span={16}>
        <Form.Item
          label="Razón social"
          name="name"
          rules={[{ required: true, message: 'Campo requerido' }, { max: 250 }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="RFC"
          name="rfc"
          rules={[{ pattern: RFC_PATTERN, message: 'RFC no válido' }]}
        >
          <Input style={{ textTransform: 'uppercase' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label="Nombre comercial" name="tradeName">
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
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
      <Col span={24}>
        <Form.Item label="Dirección" name="address">
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          extra="Folio de los recibos, ej. HAY → HAY-000123"
          label="Prefijo de folio"
          name="receiptPrefix"
          rules={[
            {
              pattern: /^[A-Z0-9]{1,10}$/i,
              message: 'Solo letras y números, máximo 10',
            },
          ]}
        >
          <Input maxLength={10} style={{ textTransform: 'uppercase' }} />
        </Form.Item>
      </Col>
      {isEdit && (
        <Col span={12}>
          <Form.Item label="Estatus" name="status">
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
        </Col>
      )}
      {isEdit && (
        <Col span={24}>
          <Form.Item
            extra="PNG o JPG, máximo 2 MB. Aparece en los recibos de pago."
            label="Logo"
          >
            <LogoUploader companyId={selected.id} />
          </Form.Item>
        </Col>
      )}
    </Row>
  </Form>
);

// el logo se sube directo a la API (no forma parte del formulario)
const LogoUploader = ({ companyId }) => {
  const [nVersion, setVersion] = useState(0);

  const customRequest = async ({ file, onSuccess, onError }) => {
    const response = await uploadFile(`companies/${companyId}/logo`, file);
    if (response?.ok) {
      feedback.message.success('Logo actualizado');
      setVersion(n => n + 1);
      onSuccess(response.data);
    } else {
      showError(response, 'No se pudo subir el logo');
      onError(new Error('upload failed'));
    }
  };

  return (
    <Flex align="center" gap={16}>
      <CompanyLogo companyId={companyId} refreshKey={nVersion} size={64} />
      <Upload
        accept="image/png,image/jpeg"
        customRequest={customRequest}
        maxCount={1}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Cambiar logo</Button>
      </Upload>
    </Flex>
  );
};

LogoUploader.propTypes = {
  companyId: PropTypes.string.isRequired,
};

CompanyForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  isEdit: PropTypes.bool,
  selected: PropTypes.object,
};

// quita vacios al crear y los manda como null al editar
export const cleanPayload = (oValues, aFields, selected) =>
  aFields.reduce((oPayload, sField) => {
    const value = oValues[sField];
    if (value === undefined || value === '' || value === null) {
      return selected ? { ...oPayload, [sField]: null } : oPayload;
    }
    return { ...oPayload, [sField]: value };
  }, {});

export const companyToPayload = (values, selected) => {
  const oPayload = cleanPayload(
    values,
    [
      'name',
      'tradeName',
      'rfc',
      'email',
      'phone',
      'address',
      'regimeId',
      'receiptPrefix',
    ],
    selected,
  );
  ['rfc', 'receiptPrefix'].forEach(sField => {
    if (oPayload[sField]) {
      oPayload[sField] = oPayload[sField].toUpperCase();
    }
  });
  return selected ? { ...oPayload, status: values.status } : oPayload;
};
