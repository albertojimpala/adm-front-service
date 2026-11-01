import React, { useMemo, useState } from 'react';
import {
  Button,
  Col,
  Descriptions,
  Form,
  message,
  notification,
  Popconfirm,
  Row,
  Table,
  Tag,
  Typography,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useFetchClients } from '../../Hooks/Client.hook';
import { AccountActions } from './AccounActions';
import { ClientActions } from './ClientActions';
import { process, SAVE, UPDATE } from '../../Service/Api';
import { SearchBar } from '../Atoms/SearchBar';
import { DrawerInfo } from '../Atoms/DrawerInfo';
import { generateQueries } from '../../Utils/query';
import { aSearchElements, oInitState } from './ClientConstants';

const { Paragraph } = Typography;

export const ClientTable = () => {
  const [modal, setModal] = useState(false);
  const [modalA, setModalA] = useState(false);
  const [modalALoading, setModalALoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [search, setSearch] = useState(oInitState);
  const [clients, loading, change, updater] = useFetchClients();

  const fnSearchElements = useMemo(() => {
    return aSearchElements();
  });
  const [formRef] = Form.useForm();

  const Datos = () => {
    return (
      <>
        <div>
          <Descriptions
            title="Datos Personales"
            bordered
            column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 1, xs: 1 }}
          >
            {selected.person_type === 'F' ? (
              <>
                <Descriptions.Item label="Nombre(s)">
                  <Paragraph copyable>{selected.name}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Apellido Paterno">
                  <Paragraph copyable>{selected.last_name}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Apellido Materno">
                  <Paragraph copyable>{selected.mother_name}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="RFC">
                  <Paragraph copyable>{selected.rfc}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="CURP">
                  <Paragraph copyable>{selected.curp}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Registro Patronal">
                  <Paragraph copyable>{selected.regpat}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="CIEC">
                  <Paragraph copyable>{selected.ciec}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <Paragraph copyable>{selected.email}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Telefono">
                  <Paragraph copyable>{selected.phone}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Celular">
                  <Paragraph copyable>{selected.movil}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Regimen Fiscal">
                  <Paragraph copyable>{selected.regimen_id}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Razon Social">
                  <Paragraph copyable>
                    {selected.trade_name.toUpperCase()}
                  </Paragraph>
                </Descriptions.Item>
              </>
            ) : (
              <>
                <Descriptions.Item label="Razon Social">
                  <Paragraph copyable>
                    {selected.trade_name.toUpperCase()}
                  </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="RFC">
                  <Paragraph copyable>{selected.rfc}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Registro Patronal">
                  <Paragraph copyable>{selected.regpat}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="CIEC">
                  <Paragraph copyable>{selected.ciec}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <Paragraph copyable>{selected.email}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Telefono">
                  <Paragraph copyable>{selected.phone}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Celular">
                  <Paragraph copyable>{selected.movil}</Paragraph>
                </Descriptions.Item>
                <Descriptions.Item label="Regimen Fiscal">
                  <Paragraph copyable>{selected.regimen_id}</Paragraph>
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        </div>
      </>
    );
  };

  const _handleDeactivate = async sId => {
    const response = await process(
      UPDATE,
      'clients',
      { status: 0 },
      { id: sId }
    );
    if (response?.ok) {
      message.success('Desactivado correctamente');
      updater();
    } else {
      message.error('Error al desactivar');
    }
  };

  const columns = [
    {
      dataIndex: 'trade_name',
      title: 'Razon Social',
      render: trade_name => <Paragraph copyable>{trade_name}</Paragraph>,
    },
    {
      dataIndex: 'rfc',
      title: 'RFC',
      render: rfc => <Paragraph copyable>{rfc}</Paragraph>,
    },
    {
      dataIndex: 'ciec',
      title: 'CIEC',
      render: ciec => <Paragraph copyable>{ciec}</Paragraph>,
    },
    {
      dataIndex: 'db_name',
      title: 'Base de Datos',
    },
    {
      dataIndex: 'phone',
      title: 'Telefono',
    },
    {
      dataIndex: 'person_type',
      title: 'Tipo de Persona',
      render: person_type =>
        person_type === 'F' ? (
          <Tag color="#3F51CA">Fisica</Tag>
        ) : (
          <Tag color="#3FB7CA">Moral</Tag>
        ),
    },
    {
      dataIndex: 'status',
      title: 'Estatus',
      render: status =>
        status ? (
          <Tag color="#87d068">Activo</Tag>
        ) : (
          <Tag color="#f50">Inactivo</Tag>
        ),
    },
    {
      dataIndex: 'id',
      title: 'Acciones',
      render: (_, row) => {
        return (
          <Row>
            <Col>
              <Button
                onClick={() => {
                  setSelected(row);
                  formRef.setFieldsValue(row);
                  setModal(true);
                }}
              >
                <EditOutlined />
              </Button>
              <Popconfirm
                onConfirm={() => _handleDeactivate(row.id)}
                title="Está seguro de desactivar este Cliente?"
              >
                <Button>
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        );
      },
    },
  ];

  const _handleReset = () => {
    setSearch(oInitState);
    change();
  };

  const _handleSearch = () => change(generateQueries(search, fnSearchElements));
  const _handleAccount = async values => {
    console.log(values);
  };
  const _handleSubmit = async values => {
    setModalLoading(true);
    let response;
    if (selected?.id) {
      response = await process(UPDATE, 'clients', values, {
        id: selected.id,
      });
    } else {
      let oSend = { ...values };
      response = await process(SAVE, 'clients', oSend);
    }
    setModalLoading(false);
    if (response?.ok) {
      message.success('Exito');
      formRef.resetFields();
      setSelected({});
      setModal(false);
      updater();
    } else {
      const { data } = response;
      if (data?.code === 400) {
        let sErrors = '';
        if (Array.isArray(data.errors)) {
          for (const oError of data.errors) {
            if (oError.type === 'unique violation') {
              sErrors += `El valor ${oError.path} ya existe en BD\n`;
            }
          }
        } else {
          for (const sKey in data?.errors) {
            sErrors += data.errors[sKey] + '\n';
          }
        }
        message.error(data?.message);
        if (sErrors !== '') {
          notification.error({
            message: sErrors,
            title: 'Errores',
          });
        }
      } else if (data?.code === 409) {
        message.error('Valor duplicado');
      } else {
        message.error('Error en usuarios');
      }
    }
    setModalLoading(false);
  };

  return (
    <div>
      <Row justify="space-between">
        <Col>
          <h3>Clientes</h3>
        </Col>
        <Col>
          <Button onClick={() => setModal(true)} type="primary">
            Crear
          </Button>
        </Col>
      </Row>
      <ClientActions
        fn={{
          handler: setModalLoading,
          handlerSelected: setSelected,
          selected: selected,
        }}
        modal={{
          form: formRef,
          handler: setModal,
          loading: modalLoading,
          submit: _handleSubmit,
          visible: modal,
        }}
      />

      <AccountActions
        fn={{
          handler: setModalALoading,
          handlerSelected: setSelected,
          selected: selected,
        }}
        modal={{
          form: formRef,
          handler: setModalA,
          loading: modalALoading,
          submit: _handleAccount,
          visible: modalA,
        }}
      />

      <SearchBar
        elements={fnSearchElements}
        handleReset={_handleReset}
        handleSearch={_handleSearch}
        {...{ search, setSearch }}
      />
      <DrawerInfo
        titulo={selected.trade_name}
        position={'left'}
        size={'large'}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        information={<Datos />}
      />
      <Table
        columns={columns}
        dataSource={clients?.data}
        loading={loading}
        pagination={{
          current: clients.skip / 10 + 1,
          onChange: e => change(clients.queries, (e - 1) * 10),
          pageSizeOptions: [10],
          total: clients.total,
        }}
        rowKey={row => row.id}
      />
    </div>
  );
};
