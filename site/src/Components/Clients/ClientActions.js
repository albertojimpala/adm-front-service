import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { ClientForm } from '../Forms';

export const ClientActions = ({
  fn = {
    handler: () => ({}),
    handlerSelected: () => ({}),
    selected: {},
  },
  modal = {
    form: {},
    handler: () => ({}),
    loading: false,
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
      title={fn.selected?.id ? 'Actualizar Cliente' : 'Crear Cliente'}
      visible={modal.visible}
    >
      <ClientForm
        formRef={modal.form}
        onSubmit={modal.submit}
        oClient={fn.selected ? fn.selected : {}}
      />
    </Modal>
  );
};

ClientActions.propTypes = {
  fn: PropTypes.any.isRequired,
  modal: PropTypes.shape({
    form: PropTypes.object,
    handler: PropTypes.func,
    loading: PropTypes.bool,
    submit: PropTypes.func,
    visible: PropTypes.bool,
  }),
};
