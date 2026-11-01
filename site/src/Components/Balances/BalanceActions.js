import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { BalanceForm } from '../Forms';

export const BalanceActions = ({
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
      okText={fn.selected?.id ? 'Actualizar' : 'Registrar'}
      okButtonProps={{
        loading: modal.loading,
      }}
      title={fn.selected?.id ? 'Actualizar Saldo de Cuenta' : 'Registrar Saldo'}
      visible={modal.visible}
    >
      <BalanceForm
        formRef={modal.form}
        onSubmit={modal.submit}
        updating={!fn.selected?.id}
      />
    </Modal>
  );
};

BalanceActions.propTypes = {
  fn: PropTypes.any.isRequired,
  modal: PropTypes.shape({
    form: PropTypes.object,
    handler: PropTypes.func,
    loading: PropTypes.bool,
    submit: PropTypes.func,
    visible: PropTypes.bool,
  }),
};
