import { useState } from 'react';
import { Button, Form, Modal, Tag, Tooltip } from 'antd';
import {
  PlusCircleOutlined,
  SwapOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { SAVE, process } from '../../Service/Api';
import { usePermissions } from '../../Hooks';
import {
  ACCOUNT_TYPES,
  STATUS_OPTIONS,
  toOptions,
} from '../../Utils/constants';
import { feedback } from '../../Utils/feedback';
import { showError } from '../../Utils/errors';
import { formatMoney } from '../../Utils/format';
import { CrudTable } from '../Atoms/CrudTable';
import { statusColumn } from '../Atoms/StatusTag';
import {
  AccountForm,
  MovementForm,
  TransferForm,
  accountToPayload,
} from '../Forms';
import { AccountMovements } from './AccountMovements';
import { AccountSummary } from './AccountSummary';

const columns = [
  { dataIndex: 'name', title: 'Cuenta' },
  {
    dataIndex: 'type',
    title: 'Tipo',
    render: sType => (
      <Tag color={ACCOUNT_TYPES[sType]?.color}>
        {ACCOUNT_TYPES[sType]?.label}
      </Tag>
    ),
  },
  { dataIndex: 'bankName', title: 'Banco' },
  { dataIndex: 'accountNumber', title: 'Cuenta' },
  { dataIndex: 'clabe', title: 'CLABE' },
  {
    dataIndex: 'balance',
    title: 'Saldo',
    align: 'right',
    render: n => <strong>{formatMoney(n)}</strong>,
  },
  statusColumn,
];

const searchElements = [
  { label: 'Nombre', name: 'name' },
  {
    label: 'Tipo',
    name: 'type',
    type: 'select',
    options: toOptions(ACCOUNT_TYPES),
  },
  { label: 'Estatus', name: 'status', type: 'select', options: STATUS_OPTIONS },
];

export const AccountTable = () => {
  const { can } = usePermissions();
  const [refreshKey, setRefreshKey] = useState(0);
  const [movements, setMovements] = useState(null);
  const [modal, setModal] = useState(null); // { type: movement|transfer, account }
  const [saving, setSaving] = useState(false);
  const [formRef] = Form.useForm();

  const refresh = () => setRefreshKey(n => n + 1);

  const _handleSubmit = async values => {
    setSaving(true);
    const oPayload = {
      ...values,
      movementDate: values.movementDate?.format('YYYY-MM-DD'),
    };
    if (!oPayload.concept) {
      delete oPayload.concept;
    }
    const response =
      modal.type === 'transfer'
        ? await process(SAVE, 'accounts/transfer', oPayload)
        : await process(
            SAVE,
            `accounts/${modal.account.id}/movements`,
            oPayload,
          );
    setSaving(false);
    if (response?.ok) {
      feedback.message.success(
        modal.type === 'transfer'
          ? 'Traspaso registrado'
          : 'Movimiento registrado',
      );
      setModal(null);
      refresh();
    } else {
      showError(response, 'Error al registrar el movimiento');
    }
  };

  return (
    <>
      <AccountSummary refreshKey={refreshKey} />
      <CrudTable
        columns={columns}
        drawer={
          <AccountMovements
            account={movements}
            onClose={() => setMovements(null)}
          />
        }
        entityLabel="cuenta"
        FormComponent={AccountForm}
        headerActions={
          can('accounts', 'create') && (
            <Button
              icon={<SwapOutlined />}
              onClick={() => setModal({ type: 'transfer' })}
            >
              Traspaso
            </Button>
          )
        }
        model="accounts"
        module="accounts"
        onChanged={refresh}
        refreshKey={refreshKey}
        rowActions={row => (
          <>
            <Tooltip title="Movimientos">
              <Button
                icon={<UnorderedListOutlined />}
                onClick={() => setMovements(row)}
              />
            </Tooltip>
            {can('accounts', 'create') && row.status === 1 && (
              <Tooltip title="Gasto, ingreso o ajuste">
                <Button
                  icon={<PlusCircleOutlined />}
                  onClick={() => setModal({ type: 'movement', account: row })}
                />
              </Tooltip>
            )}
          </>
        )}
        searchElements={searchElements}
        title="Bancos y caja chica"
        toForm={row => ({ ...row })}
        toPayload={accountToPayload}
      />
      <Modal
        cancelText="Cancelar"
        centered
        destroyOnHidden
        okButtonProps={{ loading: saving }}
        okText="Registrar"
        onCancel={() => setModal(null)}
        onOk={() => formRef.submit()}
        open={Boolean(modal)}
        title={
          modal?.type === 'transfer'
            ? 'Traspaso entre cuentas'
            : `Movimiento en ${modal?.account?.name || ''}`
        }
      >
        {modal?.type === 'transfer' && (
          <TransferForm formRef={formRef} onSubmit={_handleSubmit} />
        )}
        {modal?.type === 'movement' && (
          <MovementForm formRef={formRef} onSubmit={_handleSubmit} />
        )}
      </Modal>
    </>
  );
};
