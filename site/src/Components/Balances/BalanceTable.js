import React, { useState } from 'react';
import {
  Button,
  Col,
  Form,
  message,
  notification,
  Popconfirm,
  Row,
  Table,
  Tag,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { BalanceActions } from './BalanceActions';
import { process, SAVE, FILE_SAVE, UPDATE } from '../../Service/Api';
import { SearchBar } from '../Atoms/SearchBar';
import { generateQueries } from '../../Utils/query';
import { aSearchElements, oInitState } from './BalanceConstants';
import { useFetchBalances } from '../../Hooks/Balance.hook';
import { useFetchClients } from '../../Hooks/Client.hook';

export const BalanceTable = () => {
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [search, setSearch] = useState(oInitState);
  const [balances, loading, change, updater] = useFetchBalances();
  const [clients] = useFetchClients();

  const [formRef] = Form.useForm();

  const _handleDeactivate = async sId => {
    const response = await process(
      UPDATE,
      'balances',
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
      dataIndex: 'client',
      title: 'Cliente',
    },
    {
      dataIndex: 'account',
      title: 'Cuenta',
    },

    {
      dataIndex: 'init_balance',
      title: 'Saldo Inicial',
    },
    {
      dataIndex: 'amount_14',
      title: 'Saldo Final',
    },
    {
      dataIndex: 'year',
      title: 'Ejercicio',
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
                shape="circle"
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
                title="Está seguro de desactivar esta Saldo?"
              >
                <Button shape="circle">
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

  const _handleSearch = () =>
    change(generateQueries(search, aSearchElements(clients?.data)));

  const _handleSubmit = async values => {
    if (values.files) {
      setModalLoading(true);
      let response;
      const oBody = new FormData();
      oBody.append('type', 1);
      oBody.append('client_id', values.client_id);
      oBody.append('files', values.files[0].originFileObj);

      response = await process(FILE_SAVE, 'masivo', oBody);
      debugger; // eslint-disable-line no-debugger
      if (response?.ok) {
        message.success('Exito Masivo');
        formRef.resetFields();
        setSelected({});
        setModal(false);
        updater();
      } else {
        message.error('error al cargar');
      }
      setModalLoading(false);
    } else {
      setModalLoading(true);
      let response;
      if (selected?.id) {
        response = await process(UPDATE, 'balances', values, {
          id: selected.id,
        });
      } else {
        let oSend = { ...values };
        delete oSend.client_id;
        response = await process(SAVE, 'balances', oSend);
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
          message.error('Error en Movimientos');
        }
      }

      setModalLoading(false);
    }
  };

  return (
    <div>
      <Row gutter={[16, 8]} justify="space-between">
        <Col span={16}>
          <h3>Saldos de Cuentas Contables</h3>
        </Col>
      </Row>
      <BalanceActions
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
      <SearchBar
        elements={aSearchElements(clients?.data)}
        handleReset={_handleReset}
        handleSearch={_handleSearch}
        {...{ search, setSearch }}
      />
      <Table
        columns={columns}
        dataSource={balances?.data}
        loading={loading}
        pagination={{
          current: balances.skip / 10 + 1,
          onChange: e => change(balances.queries, (e - 1) * 10),
          pageSizeOptions: [10],
          total: balances.total,
        }}
        rowKey={row => row.id}
      />
    </div>
  );
};
