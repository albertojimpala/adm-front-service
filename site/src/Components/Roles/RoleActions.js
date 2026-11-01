import { Modal } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { RoleForm } from '../Forms';

export const RoleActions = ({
  fn = {
    handler: () => ({}),
    handlerSelected: () => ({}),
    selected: {},
  },
  modal = {
    form: {},
    handler: () => ({}),
    loading: false,
    selectLoading: false,
    submit: () => ({}),
    visible: false,
  },
}) => {
  return (
    <Modal
      cancelText="Cancelar"
      centered
      destroyOnClose
      onCancel={() => {
        fn.handlerSelected({});
        modal.handler(false);
        modal.form.resetFields();
      }}
      onOk={() => modal.form.submit()}
      okText={fn.selected?.id ? 'Actualizar' : 'Crear'}
      okButtonProps={{
        loading: modal.loading,
      }}
      title={fn.selected?.id ? 'Actualizar rol' : 'Crear rol'}
      visible={modal.visible}
      width={750}
    >
      <RoleForm
        formRef={modal.form}
        onSubmit={modal.submit}
        isNew={!fn.selected?.id}
        selectLoading={modal.selectLoading}
      />
    </Modal>
  );
};

RoleActions.propTypes = {
  fn: PropTypes.any.isRequired,
  modal: PropTypes.shape({
    form: PropTypes.object,
    handler: PropTypes.func,
    loading: PropTypes.bool,
    submit: PropTypes.func,
    visible: PropTypes.bool,
  }),
};
