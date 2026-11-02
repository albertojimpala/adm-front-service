import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Badge,
  Button,
  Col,
  DatePicker,
  Form,
  Grid,
  Input,
  Row,
  Select,
  Tooltip,
} from 'antd';
import {
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { RemoteSelect } from './RemoteSelect';

const { RangePicker } = DatePicker;

// convierte los valores del formulario a los filtros de la API
const toQueries = (elements, values) =>
  elements.reduce((oQueries, { name, names, type }) => {
    const value = values[name];
    if (value === undefined || value === null || value === '') {
      return oQueries;
    }
    if (type === 'range') {
      const [sFrom = 'from', sTo = 'to'] = names || [];
      oQueries[sFrom] = value[0]?.format('YYYY-MM-DD');
      oQueries[sTo] = value[1]?.format('YYYY-MM-DD');
    } else if (type === 'month') {
      oQueries[name] = value.format('YYYY-MM');
    } else if (type === 'date') {
      oQueries[name] = value.format('YYYY-MM-DD');
    } else {
      oQueries[name] = value;
    }
    return oQueries;
  }, {});

/**
 * Filtros de una tabla
 * elements: [{ label, name, type: input|select|remote|range|month|date, options, span, props, render }]
 */
export const SearchBar = ({ elements, handleSearch, initialValues = {} }) => {
  const [form] = Form.useForm();
  const [isExpanded, setExpanded] = useState(false);
  // en movil solo se muestra el primer filtro, los demas con el boton de filtros
  const screens = Grid.useBreakpoint();
  const bCollapsible = !screens.md && elements.length > 1;
  const nHidden = elements.slice(1).filter(({ name }) => {
    const value = form.getFieldValue(name);
    return value !== undefined && value !== null && value !== '';
  }).length;

  const onFinish = values => handleSearch(toQueries(elements, values));

  const onReset = () => {
    form.resetFields();
    handleSearch(toQueries(elements, form.getFieldsValue()));
  };

  const renderField = ({ type, options, placeholder, props = {}, render }) => {
    if (render) {
      return render();
    }
    switch (type) {
      case 'select':
        return (
          <Select
            allowClear
            options={options}
            placeholder={placeholder || 'Todos'}
            {...props}
          />
        );
      case 'remote':
        return <RemoteSelect placeholder={placeholder || 'Todos'} {...props} />;
      case 'range':
        return <RangePicker style={{ width: '100%' }} {...props} />;
      case 'month':
        return (
          <DatePicker picker="month" style={{ width: '100%' }} {...props} />
        );
      case 'date':
        return <DatePicker style={{ width: '100%' }} {...props} />;
      default:
        return <Input allowClear placeholder={placeholder} {...props} />;
    }
  };

  return (
    <Form
      className="search-bar"
      form={form}
      initialValues={initialValues}
      layout="vertical"
      onFinish={onFinish}
    >
      <Row gutter={[12, 0]} align="bottom">
        {elements.map((oElement, nIndex) => (
          <Col
            key={oElement.name}
            md={oElement.span || 6}
            sm={12}
            style={
              bCollapsible && !isExpanded && nIndex > 0
                ? { display: 'none' }
                : undefined
            }
            xs={24}
          >
            <Form.Item label={oElement.label} name={oElement.name}>
              {renderField(oElement)}
            </Form.Item>
          </Col>
        ))}
        <Col>
          <Form.Item>
            <Tooltip title="Buscar">
              <Button
                htmlType="submit"
                icon={<SearchOutlined />}
                shape="circle"
                type="primary"
              />
            </Tooltip>
            <Tooltip title="Limpiar filtros">
              <Button
                danger
                icon={<ReloadOutlined />}
                onClick={onReset}
                shape="circle"
                style={{ marginLeft: 8 }}
              />
            </Tooltip>
            {bCollapsible && (
              <Badge count={isExpanded ? 0 : nHidden} size="small">
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setExpanded(!isExpanded)}
                  style={{ marginLeft: 8 }}
                >
                  {isExpanded ? 'Menos filtros' : 'Más filtros'}
                </Button>
              </Badge>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

SearchBar.propTypes = {
  elements: PropTypes.array.isRequired,
  handleSearch: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};
