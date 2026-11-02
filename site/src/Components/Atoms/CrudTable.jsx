import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal, Popconfirm, Space, Table, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { DELETE, SAVE, UPDATE, process } from '../../Service/Api';
import { useFetchList, usePermissions } from '../../Hooks';
import { feedback } from '../../Utils/feedback';
import { showError } from '../../Utils/errors';
import { ScreenHeader } from './ScreenHeader';
import { SearchBar } from './SearchBar';

/**
 * Tabla con filtros, paginacion y modal de alta/edicion para un recurso de la API
 * - FormComponent recibe { formRef, onSubmit, initialValues, isEdit, selected }
 * - toForm(row) convierte el registro a valores del formulario
 * - toPayload(values, selected) convierte el formulario al body de la API
 * - DELETE en la API hace baja logica (status 0)
 */
export const CrudTable = ({
  title,
  model,
  module,
  columns,
  searchElements = [],
  defaultQueries = {},
  FormComponent,
  toForm = row => row,
  toPayload = values => values,
  entityLabel = 'registro',
  modalWidth = 640,
  rowActions,
  headerActions,
  refreshKey,
  onChanged,
  permissions = {},
  rowKey = 'id',
  deleteText = 'Desactivar',
  canDeleteRow = row => row.status === 1,
  drawer,
}) => {
  const { can } = usePermissions();
  const oCan = {
    create: can(module, 'create'),
    update: can(module, 'update'),
    delete: can(module, 'delete'),
    ...permissions,
  };

  const [data, loading, change, update, { changePage }] = useFetchList(
    model,
    defaultQueries,
  );
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (refreshKey) {
      update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const openForm = (row = null) => {
    setSelected(row);
    setModal(true);
  };

  const closeForm = () => {
    setModal(false);
    setSelected(null);
  };

  const afterChange = () => {
    update();
    onChanged?.();
  };

  const _handleSubmit = async values => {
    setSaving(true);
    const payload = toPayload(values, selected);
    const response = selected
      ? await process(UPDATE, model, payload, { id: selected[rowKey] })
      : await process(SAVE, model, payload);
    setSaving(false);

    if (response?.ok) {
      feedback.message.success(
        selected ? 'Actualizado correctamente' : 'Creado correctamente',
      );
      closeForm();
      afterChange();
    } else {
      showError(response, `Error al guardar ${entityLabel}`);
    }
  };

  const _handleDeactivate = async row => {
    const response = await process(DELETE, model, {}, { id: row[rowKey] });
    if (response?.ok) {
      feedback.message.success('Operación realizada correctamente');
      afterChange();
    } else {
      showError(response, `Error al ${deleteText.toLowerCase()}`);
    }
  };

  const bActions = oCan.update || oCan.delete || rowActions;
  const aColumns = bActions
    ? [
        ...columns,
        {
          key: 'actions',
          title: 'Acciones',
          fixed: 'right',
          width: 1,
          render: (_, row) => (
            <Space size="small">
              {rowActions?.(row, { update: afterChange, edit: openForm })}
              {oCan.update && (
                <Tooltip title="Editar">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => openForm(row)}
                  />
                </Tooltip>
              )}
              {oCan.delete && canDeleteRow(row) && (
                <Popconfirm
                  cancelText="Cancelar"
                  okText="Sí"
                  onConfirm={() => _handleDeactivate(row)}
                  title={`¿${deleteText} ${entityLabel}?`}
                >
                  <Tooltip title={deleteText}>
                    <Button danger icon={<DeleteOutlined />} />
                  </Tooltip>
                </Popconfirm>
              )}
            </Space>
          ),
        },
      ]
    : columns;

  return (
    <div>
      <ScreenHeader title={title}>
        {headerActions}
        {oCan.create && FormComponent && (
          <Button
            icon={<PlusOutlined />}
            onClick={() => openForm()}
            type="primary"
          >
            Crear
          </Button>
        )}
      </ScreenHeader>

      {searchElements.length > 0 && (
        <SearchBar
          elements={searchElements}
          handleSearch={oQueries => change({ ...defaultQueries, ...oQueries })}
        />
      )}

      <Table
        columns={aColumns}
        dataSource={data.data}
        loading={loading}
        pagination={{
          current: data.meta?.page,
          pageSize: data.meta?.limit,
          total: data.meta?.total,
          showSizeChanger: true,
          showTotal: nTotal => `${nTotal} registros`,
          onChange: changePage,
        }}
        rowKey={rowKey}
        scroll={{ x: 'max-content' }}
      />

      {drawer}

      {FormComponent && (
        <Modal
          cancelText="Cancelar"
          centered
          destroyOnHidden
          okButtonProps={{ loading: saving }}
          okText={selected ? 'Actualizar' : 'Crear'}
          onCancel={closeForm}
          onOk={() => formRef.submit()}
          open={modal}
          title={`${selected ? 'Editar' : 'Crear'} ${entityLabel}`}
          width={modalWidth}
        >
          <FormComponent
            formRef={formRef}
            initialValues={selected ? toForm(selected) : undefined}
            isEdit={Boolean(selected)}
            onSubmit={_handleSubmit}
            selected={selected}
          />
        </Modal>
      )}
    </div>
  );
};

CrudTable.propTypes = {
  title: PropTypes.node.isRequired,
  model: PropTypes.string.isRequired,
  module: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  searchElements: PropTypes.array,
  defaultQueries: PropTypes.object,
  FormComponent: PropTypes.elementType,
  toForm: PropTypes.func,
  toPayload: PropTypes.func,
  entityLabel: PropTypes.string,
  modalWidth: PropTypes.number,
  rowActions: PropTypes.func,
  headerActions: PropTypes.node,
  refreshKey: PropTypes.number,
  onChanged: PropTypes.func,
  permissions: PropTypes.object,
  rowKey: PropTypes.string,
  deleteText: PropTypes.string,
  canDeleteRow: PropTypes.func,
  drawer: PropTypes.node,
};
