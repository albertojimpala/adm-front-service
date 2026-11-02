import PropTypes from 'prop-types';
import { Col, Form, Input, Row, Select } from 'antd';
import { STATUS_OPTIONS } from '../../Utils/constants';
import { CompanySelect } from '../Atoms/RemoteSelect';

export const PositionForm = ({
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
    name="PositionForm"
    onFinish={onSubmit}
  >
    <Row gutter={[12, 0]}>
      <Col span={24}>
        <Form.Item
          label="Puesto"
          name="description"
          rules={[{ required: true, message: 'Campo requerido' }, { max: 250 }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={isEdit ? 14 : 24}>
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
      {isEdit && (
        <Col span={10}>
          <Form.Item label="Estatus" name="status">
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
        </Col>
      )}
    </Row>
  </Form>
);

PositionForm.propTypes = {
  formRef: PropTypes.object,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  isEdit: PropTypes.bool,
  selected: PropTypes.object,
};
