import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Steps } from 'antd';
import { UPDATE, process } from '../../Service/Api';
import { JOB_PROGRESS } from '../../Utils/constants';
import { feedback } from '../../Utils/feedback';
import { showError } from '../../Utils/errors';

const PROGRESS_KEYS = Object.keys(JOB_PROGRESS);

// cambia el avance de un trabajo; cada cambio queda en el historial
export const ProgressModal = ({ job, onClose, onSaved }) => {
  const [formRef] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [nCurrent, setCurrent] = useState(null);

  const nSelected = nCurrent ?? PROGRESS_KEYS.indexOf(job?.progress);

  const _handleSubmit = async ({ comment }) => {
    setSaving(true);
    const response = await process(UPDATE, `jobs/${job.id}/progress`, {
      progress: PROGRESS_KEYS[nSelected],
      ...(comment ? { comment } : {}),
    });
    setSaving(false);
    if (response?.ok) {
      feedback.message.success('Avance actualizado');
      setCurrent(null);
      onClose();
      onSaved?.();
    } else {
      showError(response, 'Error al actualizar el avance');
    }
  };

  const close = () => {
    setCurrent(null);
    onClose();
  };

  return (
    <Modal
      cancelText="Cancelar"
      centered
      destroyOnHidden
      okButtonProps={{ loading: saving }}
      okText="Guardar avance"
      onCancel={close}
      onOk={() => formRef.submit()}
      open={Boolean(job)}
      title={`Avance de ${job?.title || ''}`}
      width={720}
    >
      <Steps
        current={nSelected}
        items={PROGRESS_KEYS.map(sKey => ({ title: JOB_PROGRESS[sKey].label }))}
        onChange={setCurrent}
        size="small"
        style={{ margin: '16px 0 24px' }}
      />
      <Form form={formRef} layout="vertical" onFinish={_handleSubmit}>
        <Form.Item label="Comentario" name="comment" rules={[{ max: 500 }]}>
          <Input.TextArea
            placeholder="Ej. En espera de estados de cuenta del cliente"
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

ProgressModal.propTypes = {
  job: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func,
};
