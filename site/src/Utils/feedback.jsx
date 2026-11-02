import { App, Modal, message, notification } from 'antd';

// instancias de message/notification con el contexto del tema,
// se llenan con <FeedbackHolder /> dentro de <App> de antd
export const feedback = { message, notification, modal: Modal };

export const FeedbackHolder = () => {
  const oApp = App.useApp();
  feedback.message = oApp.message;
  feedback.notification = oApp.notification;
  feedback.modal = oApp.modal;
  return null;
};
