import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  PlusOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { DELETE, GET, SAVE, UPDATE, process } from '../../Service/Api';
import { useFetchOne, usePermissions } from '../../Hooks';
import { feedback } from '../../Utils/feedback';
import { showError } from '../../Utils/errors';
import { StatusTag } from '../Atoms/StatusTag';
import { ClientCredentialForm } from '../Forms';

// la contraseña solo se pide a la API cuando se quiere ver
const PasswordCell = ({ model, credential }) => {
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!credential.hasPassword) {
    return <Typography.Text type="secondary">—</Typography.Text>;
  }

  const toggle = async () => {
    if (password !== null) {
      setPassword(null);
      return;
    }
    setLoading(true);
    const response = await process(GET, `${model}/${credential.id}/password`);
    setLoading(false);
    if (response?.ok) {
      setPassword(response.data.password ?? '');
    } else {
      showError(response, 'Error al consultar la contraseña');
    }
  };

  return (
    <Space size="small">
      {password !== null ? (
        <Typography.Text code copyable={{ text: password }}>
          {password}
        </Typography.Text>
      ) : (
        <Typography.Text>••••••••</Typography.Text>
      )}
      <Tooltip title={password !== null ? 'Ocultar' : 'Mostrar'}>
        <Button
          icon={password !== null ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          loading={loading}
          onClick={toggle}
          size="small"
          type="text"
        />
      </Tooltip>
    </Space>
  );
};

PasswordCell.propTypes = {
  model: PropTypes.string.isRequired,
  credential: PropTypes.object.isRequired,
};

// cuentas de acceso del cliente a plataformas de gobierno (SAT, IMSS, etc.)
export const ClientCredentials = ({ clientId }) => {
  const { can } = usePermissions();
  const bCanCreate = can('credentials', 'create');
  const bCanEdit = can('credentials', 'update');
  const bCanDelete = can('credentials', 'delete');
  const sBase = `clients/${clientId}/credentials`;

  const [sSearch, setSearch] = useState('');
  const [credentials, loading, update] = useFetchOne(sBase, undefined, {
    search: sSearch,
  });
  const [modal, setModal] = useState(null); // add | edit
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formRef] = Form.useForm();

  const open = (sModal, oRow = null) => {
    setSelected(oRow);
    setModal(sModal);
  };

  const close = () => {
    setModal(null);
    setSelected(null);
  };

  const run = async (promise, sSuccess, sError) => {
    setSaving(true);
    const response = await promise;
    setSaving(false);
    if (response?.ok) {
      feedback.message.success(sSuccess);
      close();
      update();
    } else {
      showError(response, sError);
    }
  };

  // los campos vacios no se mandan; al editar, vacio limpia el campo (salvo la contraseña)
  const _handleSubmit = values => {
    const oPayload = Object.fromEntries(
      Object.entries(values)
        .filter(([sKey, value]) =>
          modal === 'edit' ? sKey !== 'password' || value : value,
        )
        .map(([sKey, value]) => [sKey, value || null]),
    );

    if (modal === 'add') {
      return run(
        process(SAVE, sBase, oPayload),
        'Cuenta agregada',
        'Error al agregar la cuenta',
      );
    }
    return run(
      process(UPDATE, sBase, oPayload, { id: selected.id }),
      'Cuenta actualizada',
      'Error al actualizar la cuenta',
    );
  };

  const changeStatus = (oRow, nStatus) =>
    run(
      nStatus === 0
        ? process(DELETE, sBase, {}, { id: oRow.id })
        : process(UPDATE, sBase, { status: 1 }, { id: oRow.id }),
      nStatus === 0 ? 'Cuenta dada de baja' : 'Cuenta reactivada',
      'Error al cambiar el estatus',
    );

  const columns = [
    {
      dataIndex: 'platform',
      title: 'Plataforma',
      render: (sPlatform, row) =>
        row.url ? (
          <Typography.Link href={row.url} rel="noreferrer" target="_blank">
            {sPlatform}
          </Typography.Link>
        ) : (
          sPlatform
        ),
    },
    {
      dataIndex: 'username',
      title: 'Usuario',
      render: sValue =>
        sValue ? <Typography.Text copyable>{sValue}</Typography.Text> : '—',
    },
    {
      dataIndex: 'email',
      title: 'Email',
      render: sValue =>
        sValue ? <Typography.Text copyable>{sValue}</Typography.Text> : '—',
    },
    {
      key: 'password',
      title: 'Contraseña',
      render: (_, row) => <PasswordCell credential={row} model={sBase} />,
    },
    { dataIndex: 'notes', title: 'Notas', ellipsis: true },
    {
      dataIndex: 'status',
      title: 'Estatus',
      render: nStatus => <StatusTag status={nStatus} />,
    },
    ...(bCanEdit || bCanDelete
      ? [
          {
            key: 'actions',
            width: 1,
            render: (_, row) => (
              <Space size="small">
                {bCanEdit && (
                  <Tooltip title="Editar">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => open('edit', row)}
                    />
                  </Tooltip>
                )}
                {row.status === 1
                  ? bCanDelete && (
                      <Popconfirm
                        cancelText="Cancelar"
                        okText="Sí"
                        onConfirm={() => changeStatus(row, 0)}
                        title="¿Dar de baja la cuenta?"
                      >
                        <Tooltip title="Dar de baja">
                          <Button danger icon={<DeleteOutlined />} />
                        </Tooltip>
                      </Popconfirm>
                    )
                  : bCanEdit && (
                      <Tooltip title="Reactivar">
                        <Button
                          icon={<UndoOutlined />}
                          onClick={() => changeStatus(row, 1)}
                        />
                      </Tooltip>
                    )}
              </Space>
            ),
          },
        ]
      : []),
  ];

  if (!credentials) {
    return <Spin />;
  }

  return (
    <div>
      <Input.Search
        allowClear
        onSearch={setSearch}
        placeholder="Buscar por plataforma, usuario o email"
        style={{ marginBottom: 12, maxWidth: 360 }}
      />
      <Table
        columns={columns}
        dataSource={credentials}
        footer={
          bCanCreate
            ? () => (
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => open('add')}
                  type="dashed"
                >
                  Agregar cuenta
                </Button>
              )
            : undefined
        }
        loading={loading}
        locale={{ emptyText: 'Sin cuentas registradas' }}
        pagination={false}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        size="small"
      />

      <Modal
        cancelText="Cancelar"
        centered
        destroyOnHidden
        okButtonProps={{ loading: saving }}
        okText="Guardar"
        onCancel={close}
        onOk={() => formRef.submit()}
        open={Boolean(modal)}
        title={
          modal === 'edit'
            ? `Editar cuenta ${selected?.platform}`
            : 'Agregar cuenta'
        }
      >
        <ClientCredentialForm
          editing={modal === 'edit'}
          formRef={formRef}
          initialValues={
            modal === 'edit'
              ? {
                  platform: selected?.platform,
                  url: selected?.url,
                  username: selected?.username,
                  email: selected?.email,
                  notes: selected?.notes,
                }
              : undefined
          }
          onSubmit={_handleSubmit}
        />
      </Modal>
    </div>
  );
};

ClientCredentials.propTypes = {
  clientId: PropTypes.string.isRequired,
};
