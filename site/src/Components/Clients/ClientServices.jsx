import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { DELETE, PUT, SAVE, UPDATE, process } from '../../Service/Api';
import { usePermissions } from '../../Hooks';
import { feedback } from '../../Utils/feedback';
import { showError } from '../../Utils/errors';
import { formatMoney } from '../../Utils/format';
import { StatusTag } from '../Atoms/StatusTag';
import { ClientServiceForm, ServicePriceForm } from '../Forms';

// precio vigente para el año: el capturado mas reciente <= year, si no el del catalogo
const resolvePrice = (oClientService, nYear) => {
  const oPrice = [...(oClientService.prices || [])]
    .filter(oItem => oItem.year <= nYear)
    .sort((a, b) => b.year - a.year)[0];
  return oPrice
    ? { price: oPrice.price, year: oPrice.year }
    : { price: oClientService.service?.price, year: null };
};

export const ClientServices = ({ client, year, onChanged }) => {
  const { can } = usePermissions();
  const bCanEdit = can('clients', 'update');
  const sBase = `clients/${client.id}/services`;

  const [modal, setModal] = useState(null); // add | quantity | price
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
      onChanged();
    } else {
      showError(response, sError);
    }
  };

  const _handleSubmit = values => {
    if (modal === 'add') {
      const { serviceId, quantity, price, year: nYear } = values;
      return run(
        process(SAVE, sBase, {
          serviceId,
          quantity,
          year: nYear,
          ...(price !== undefined && price !== null ? { price } : {}),
        }),
        'Servicio agregado',
        'Error al agregar el servicio',
      );
    }
    if (modal === 'quantity') {
      return run(
        process(
          UPDATE,
          sBase,
          { quantity: values.quantity },
          { id: selected.id },
        ),
        'Cantidad actualizada',
        'Error al actualizar',
      );
    }
    return run(
      process(
        PUT,
        `${sBase}/${selected.id}/prices`,
        {
          price: values.price,
          ...(values.notes ? { notes: values.notes } : {}),
        },
        { id: values.year },
      ),
      `Precio ${values.year} guardado`,
      'Error al guardar el precio',
    );
  };

  const changeStatus = (oRow, nStatus) =>
    run(
      nStatus === 0
        ? process(DELETE, sBase, {}, { id: oRow.id })
        : process(UPDATE, sBase, { status: 1 }, { id: oRow.id }),
      nStatus === 0 ? 'Servicio dado de baja' : 'Servicio reactivado',
      'Error al cambiar el estatus',
    );

  const removePrice = (oRow, nYear) =>
    run(
      process(DELETE, `${sBase}/${oRow.id}/prices`, {}, { id: nYear }),
      `Precio ${nYear} eliminado`,
      'Error al eliminar el precio',
    );

  const columns = [
    { dataIndex: ['service', 'description'], title: 'Servicio' },
    { dataIndex: 'quantity', title: 'Cantidad', align: 'center' },
    {
      key: 'price',
      title: `Precio ${year}`,
      align: 'right',
      render: (_, row) => {
        const { price, year: nPriceYear } = resolvePrice(row, year);
        return (
          <Tooltip
            title={
              nPriceYear ? `Capturado para ${nPriceYear}` : 'Precio de catálogo'
            }
          >
            {formatMoney(price)}{' '}
            {nPriceYear ? (
              <Tag>{nPriceYear}</Tag>
            ) : (
              <Tag color="default">catálogo</Tag>
            )}
          </Tooltip>
        );
      },
    },
    {
      dataIndex: 'status',
      title: 'Estatus',
      render: nStatus => <StatusTag status={nStatus} />,
    },
    ...(bCanEdit
      ? [
          {
            key: 'actions',
            width: 1,
            render: (_, row) => (
              <Space size="small">
                <Tooltip title="Precio por año">
                  <Button
                    icon={<CalendarOutlined />}
                    onClick={() => open('price', row)}
                  />
                </Tooltip>
                <Tooltip title="Cantidad">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => open('quantity', row)}
                  />
                </Tooltip>
                {row.status === 1 ? (
                  <Popconfirm
                    cancelText="Cancelar"
                    okText="Sí"
                    onConfirm={() => changeStatus(row, 0)}
                    title="¿Dar de baja el servicio? Ya no se cobrará"
                  >
                    <Tooltip title="Dar de baja">
                      <Button danger icon={<DeleteOutlined />} />
                    </Tooltip>
                  </Popconfirm>
                ) : (
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

  // historial de precios por año
  const expandedRowRender = row => (
    <Table
      columns={[
        { dataIndex: 'year', title: 'Año' },
        {
          dataIndex: 'price',
          title: 'Precio',
          align: 'right',
          render: formatMoney,
        },
        { dataIndex: 'notes', title: 'Notas' },
        ...(bCanEdit
          ? [
              {
                key: 'actions',
                width: 1,
                render: (_, oPrice) => (
                  <Popconfirm
                    cancelText="Cancelar"
                    okText="Sí"
                    onConfirm={() => removePrice(row, oPrice.year)}
                    title={`¿Eliminar el precio ${oPrice.year}?`}
                  >
                    <Button danger icon={<DeleteOutlined />} size="small" />
                  </Popconfirm>
                ),
              },
            ]
          : []),
      ]}
      dataSource={row.prices || []}
      locale={{
        emptyText: 'Sin precios capturados, se usa el precio de catálogo',
      }}
      pagination={false}
      rowKey="id"
      size="small"
    />
  );

  const oModalTitles = {
    add: 'Agregar servicio',
    quantity: `Cantidad de ${selected?.service?.description || ''}`,
    price: `Precio por año de ${selected?.service?.description || ''}`,
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={client.services || []}
        expandable={{ expandedRowRender }}
        footer={
          bCanEdit
            ? () => (
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => open('add')}
                  type="dashed"
                >
                  Agregar servicio
                </Button>
              )
            : undefined
        }
        pagination={false}
        rowKey="id"
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
        title={oModalTitles[modal]}
      >
        {modal === 'add' && (
          <ClientServiceForm formRef={formRef} onSubmit={_handleSubmit} />
        )}
        {modal === 'quantity' && (
          <Form
            form={formRef}
            initialValues={{ quantity: selected?.quantity }}
            layout="vertical"
            onFinish={_handleSubmit}
          >
            <Form.Item
              label="Cantidad"
              name="quantity"
              rules={[{ required: true, message: 'Campo requerido' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        )}
        {modal === 'price' && (
          <ServicePriceForm
            formRef={formRef}
            initialValues={{ year, price: resolvePrice(selected, year).price }}
            onSubmit={_handleSubmit}
          />
        )}
      </Modal>
    </div>
  );
};

ClientServices.propTypes = {
  client: PropTypes.object.isRequired,
  year: PropTypes.number.isRequired,
  onChanged: PropTypes.func.isRequired,
};
