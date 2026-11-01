import React, { useState } from 'react';
import {
  Button,
  Col,
  message,
  notification,
  Tooltip,
  Form,
  Row,
  Space,
  Table,
  Tag,
  Tree,
  Popconfirm,
} from 'antd';
import {
  DeleteOutlined,
  UpOutlined,
  EditOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import { useFetchRoles } from '../../Hooks';
import { SearchBar } from '../Atoms/SearchBar';
import { aSearchElements, oInitState } from './RoleConstants';
import { RoleActions } from './RoleActions';
import { generateQueries } from '../../Utils/query';
import { process, SAVE, UPDATE } from '../../Service/Api';

export const RoleTable = () => {
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [search, setSearch] = useState(oInitState);
  const [roles, loading, change, updater] = useFetchRoles();
  const [formRef] = Form.useForm();

  const _handleDeactivate = async sId => {
    const response = await process(UPDATE, 'roles', { status: 0 }, { id: sId });
    if (response?.ok) {
      message.success('Desactivado correctamente');
      updater();
    } else {
      message.error('Error al desactivar');
    }
  };

  const columns = [
    {
      dataIndex: 'name',
      title: 'Nombre',
    },
    {
      dataIndex: 'group',
      title: 'Grupo',
    },
    {
      dataIndex: 'permissions',
      title: 'Permisos',
      render: permissions => {
        let oData = permissions.map((oPermission, index) => ({
          title: oPermission.actions.join(', '),
          key: `0-${index}`,
          children: [
            {
              title: oPermission.subject.join(', '),
              key: `0-0-${index}`,
            },
          ],
        }));

        let tree = () => (
          <Tree
            treeData={oData}
            showLine
            defaultExpandedKeys={[...new Array(permissions?.length)].map(
              (_, index) => `0-0-${index}`
            )}
          />
        );

        return (
          <Tooltip title={tree} color="#FFF">
            <a>
              <Space>
                Permisos <UpOutlined />
              </Space>
            </a>
          </Tooltip>
        );
      },
    },
    {
      dataIndex: 'status',
      title: 'Estatus',
      render: value =>
        value ? (
          <Tag color="#87d068">Activo</Tag>
        ) : (
          <Tag color="#f50">Inactivo</Tag>
        ),
    },
    {
      dataIndex: 'id',
      title: 'Acciones',
      render: (sId, row) => {
        return (
          <Row>
            <Col>
              <Button
                onClick={() => {
                  let oTmp = { ...row };
                  if (oTmp.permissions) {
                    let aValues = [];
                    [...oTmp.permissions]
                      .map(({ actions, subject }) =>
                        subject.map(oSubject => `${actions[0]}.${oSubject}`)
                      )
                      .forEach(aOptions =>
                        aOptions.forEach(option => aValues.push(option))
                      );
                    oTmp.permissions = aValues;
                  }
                  setSelected(oTmp);
                  formRef.setFieldsValue(oTmp);
                  setModal(true);
                }}
              >
                <EditOutlined />
              </Button>
              <Popconfirm
                onConfirm={() => _handleDeactivate(sId)}
                title="Está seguro de desactivar este Rol?"
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

  const _handleSubmit = async values => {
    let oSend = { ...values };
    let response;
    let isUpdating = false;
    setModalLoading(true);
    // ? Separating actions and subject
    let dataToTransorm = oSend.permissions
      ?.map(oPermission => oPermission.split('.'))
      .map(([action, subject]) => {
        return {
          actions: action,
          subject: subject,
        };
      });

    // ? Subjects merge in the same action
    oSend.permissions = [...new Set(dataToTransorm.map(d => d.actions))].map(
      action => {
        return {
          actions: [action],
          subject: dataToTransorm
            .filter(d => d.actions === action)
            .map(d => d.subject),
        };
      }
    );

    if (!oSend?.status) {
      oSend.status = 1;
    }

    if (selected?.id) {
      response = await process(UPDATE, 'roles', oSend, {
        id: selected.id,
      });
      isUpdating = true;
    } else {
      response = await process(SAVE, 'roles', oSend);
    }
    if (response?.ok) {
      message.success(
        `Rol ${isUpdating ? 'actualizado' : 'creado'} exitosamente`
      );
      isUpdating = false;
      formRef.resetFields();
      setSelected({});
      setModal(false);
      updater();
    } else {
      const { data } = response;
      if (data?.code === 400) {
        let sErrors = '';
        if (Array.isArray(data?.errors)) {
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
        message.error('Error en roles');
      }
    }
    setModalLoading(false);
  };

  const _handleReset = () => {
    setSearch(oInitState);
    change();
  };

  const _handleSearch = () => change(generateQueries(search, aSearchElements));

  return (
    <div>
      <Row justify="space-between">
        <Col>
          <h3>Roles</h3>
        </Col>
        <Col>
          <Button
            icon={<PlusCircleFilled />}
            onClick={() => setModal(true)}
            type="primary"
          >
            Nuevo Rol
          </Button>
        </Col>
      </Row>
      <RoleActions
        fn={{
          handler: setModalLoading,
          handlerSelected: setSelected,
          selected: selected,
        }}
        modal={{
          form: formRef,
          handler: setModal,
          loading: modalLoading,
          selectLoading: loading,
          submit: _handleSubmit,
          visible: modal,
        }}
      />
      <SearchBar
        elements={aSearchElements}
        handleReset={_handleReset}
        handleSearch={_handleSearch}
        {...{ search, setSearch }}
      />
      <Table
        columns={columns}
        dataSource={roles?.data}
        loading={loading}
        pagination={{
          current: roles.skip / 10 + 1,
          onChange: e => change(roles.queries, (e - 1) * 10),
          pageSizeOptions: [10],
          total: roles.total,
        }}
        rowKey={row => row.id}
      />
    </div>
  );
};
