import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { AccountForm } from '../Forms';

export const AccountActions = ({
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
      okText={'Registrar'}
      okButtonProps={{
        loading: modal.loading,
      }}
      title={
        fn.selected?.id
          ? `Registrar Cuenta de  ${fn.selected.trade_name}`
          : 'Selecciona un Cliente'
      }
      visible={modal.visible}
    >
      <AccountForm
        formRef={modal.form}
        onSubmit={modal.submit}
        oClient={fn.selected ? fn.selected : {}}
      />
    </Modal>
  );
};

AccountActions.propTypes = {
  fn: PropTypes.any.isRequired,
  modal: PropTypes.shape({
    form: PropTypes.object,
    handler: PropTypes.func,
    loading: PropTypes.bool,
    submit: PropTypes.func,
    visible: PropTypes.bool,
  }),
};
