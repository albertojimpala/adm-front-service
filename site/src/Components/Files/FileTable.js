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
import {
  DeleteOutlined,
  FileAddOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { FileActions } from './FileActions';
import { process, UPDATE, FILE_SAVE, DELETE } from '../../Service/Api';
import { SearchBar } from '../Atoms/SearchBar';
import { generateQueries } from '../../Utils/query';
import { aSearchElements, oInitState } from './FileConstants';
import { useFetchFiles } from '../../Hooks/Files.hook';
import { useFetchClients } from '../../Hooks/Client.hook';
import { getServer } from '../../Utils/url';

export const FileTable = () => {
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState({});
  const [modalLoading, setModalLoading] = useState(false);
  const [search, setSearch] = useState(oInitState);
  const [access, loading, change, updater] = useFetchFiles();
  const [clients] = useFetchClients();

  const [formRef] = Form.useForm();
  const aTypes = ['certificado', 'llave_privada', 'acta_constitutiva', 'otros'];

  const _handleDeactivate = async sId => {
    const response = await process(DELETE, 'multimedia', null, { id: sId });
    if (response?.ok) {
      message.success('Archivo eliminado correctamente');
      updater();
    } else {
      message.error('Error al desactivar');
    }
  };

  const columns = [
    {
      dataIndex: 'description',
      title: 'Descripcion',
    },
    {
      dataIndex: 'client',
      title: 'Cliente',
      render: client => {
        return <p>{client.trade_name}</p>;
      },
    },
    {
      dataIndex: 'type',
      title: 'Tipo de Archivo',
      render: type => {
        return <p>{aTypes[type]}</p>;
      },
    },
    {
      dataIndex: 'real_file_path',
      title: 'Descargar',
      render: real_file_path => {
        return (
          <a
            target="_blank"
            href={`${getServer()}` + `/` + `${real_file_path}`}
            rel="noreferrer"
          >
            Descargar <DownloadOutlined />
          </a>
        );
      },
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
              <Popconfirm
                onConfirm={() => _handleDeactivate(row.id)}
                title="Está seguro de eliminar el archivo permanentemente?"
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

  const _handleSearch = () =>
    change(generateQueries(search, aSearchElements(clients.data)));

  const _handleSubmit = async values => {
    setModalLoading(true);
    let response;
    if (selected?.id) {
      response = await process(UPDATE, 'multimedia', values, {
        id: selected.id,
      });
    } else {
      const oBody = new FormData();
      oBody.append('type', values.type);
      oBody.append('client_id', values.client_id);
      oBody.append('status', values.status);
      oBody.append('description', values.description);
      oBody.append('files', values.file[0].originFileObj);

      response = await process(FILE_SAVE, 'multimedia', oBody);
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
        message.error('Error en Archivos');
      }
    }
    setModalLoading(false);
  };

  return (
    <div>
      <Row justify="space-between">
        <Col>
          <h3>Archivos de Clientes</h3>
        </Col>
        <Col>
          <Button onClick={() => setModal(true)} type="primary">
            Subir
            <FileAddOutlined />
          </Button>
        </Col>
      </Row>
      <FileActions
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
        elements={aSearchElements(clients.data)}
        handleReset={_handleReset}
        handleSearch={_handleSearch}
        {...{ search, setSearch }}
      />
      <Table
        columns={columns}
        dataSource={access?.data}
        loading={loading}
        pagination={{
          current: access.skip / 10 + 1,
          onChange: e => change(access.queries, (e - 1) * 10),
          pageSizeOptions: [10],
          total: access.total,
        }}
        rowKey={row => row.id}
      />
    </div>
  );
};
