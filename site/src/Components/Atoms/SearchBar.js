import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Col,
  DatePicker,
  Tooltip,
  Form,
  Input,
  Row,
  Select,
} from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';

const { RangePicker } = DatePicker;

export const SearchBar = ({
  elements,
  handleReset,
  handleSearch,
  search,
  setSearch,
}) => {
  const aVisibles = elements.filter(({ visible = true }) => visible);
  const nFieldsSize = Math.round(16 / aVisibles.length);

  const getDateForm = ({ name, value }) => {
    setSearch({
      ...search,
      [name]: value,
    });
  };

  const handleDates = aDates => {
    if (aDates) {
      setSearch({
        ...search,
        date_ini: aDates[0],
        date_end: aDates[1],
      });
    }
  };

  return (
    <Form layout="vertical">
      <Row
        gutter={[20, 20]}
        style={{ flexDirection: 'row-reverse', justifyContent: 'start' }}
      >
        <Col>
          <Form.Item label="&nbsp;">
            <Tooltip title="Buscar">
              <Button onClick={handleSearch} type="primary" shape="circle">
                <SearchOutlined />
              </Button>
            </Tooltip>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="&nbsp;">
            {handleReset && (
              <Tooltip title="Limpiar Filtros">
                <Button
                  onClick={handleReset}
                  style={{
                    color: '#FFFFFF',
                    background: '#F05249',
                    marginLeft: 10,
                  }}
                  shape="circle"
                >
                  <ReloadOutlined />
                </Button>
              </Tooltip>
            )}
          </Form.Item>
        </Col>
        {elements
          .filter(({ visible = true }) => visible)
          .reverse()
          .map(
            (
              {
                label,
                name,
                placeholder = '',
                sizes = { small: 12, normal: 0 },
                type,
                values,
              },
              nIndex
            ) => (
              <Col
                key={nIndex}
                md={sizes.normal || nFieldsSize}
                sm={sizes.small || 12}
                xs={24}
              >
                <Form.Item label={label}>
                  {type === 'input' || type === 'input-fixed' ? (
                    <Input
                      name={name}
                      onChange={({ target }) => {
                        getDateForm(target);
                        handleSearch();
                      }}
                      placeholder={placeholder}
                      type="text"
                      value={search[name]}
                    />
                  ) : type === 'select' ? (
                    <Select
                      name={name}
                      onChange={value => getDateForm({ name, value })}
                      placeholder={placeholder}
                      style={{ width: '100%' }}
                      value={search[name]}
                    >
                      {typeof values === 'function' && values()}
                    </Select>
                  ) : type === 'date' ? (
                    <RangePicker
                      locale={locale}
                      onChange={handleDates}
                      style={{ width: '100%' }}
                      value={[search?.date_ini, search?.date_end]}
                    />
                  ) : null}
                </Form.Item>
              </Col>
            )
          )}
      </Row>
    </Form>
  );
};

SearchBar.propTypes = {
  elements: PropTypes.array.isRequired,
  handleReset: PropTypes.func,
  handleSearch: PropTypes.func.isRequired,
  search: PropTypes.object.isRequired,
  setSearch: PropTypes.func.isRequired,
};
