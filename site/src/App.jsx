import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import esES from 'antd/locale/es_ES';
import dayjs from 'dayjs';
import 'dayjs/locale/es-mx';
import { persistor, store } from './Redux/store';
import Router from './Components/Router';
import { FeedbackHolder } from './Utils/feedback';

dayjs.locale('es-mx');

const oTheme = {
  algorithm: theme.compactAlgorithm,
  token: {
    colorPrimary: '#1890ff',
    fontFamily:
      "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    Layout: {
      siderBg: '#B8B8B8',
      headerBg: '#ffffff',
      headerPadding: '0 16px',
    },
    Menu: { itemBg: '#B8B8B8', subMenuItemBg: '#ADADAD', itemColor: '#1f1f1f' },
  },
};

const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ConfigProvider locale={esES} theme={oTheme}>
        <AntdApp>
          <FeedbackHolder />
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
    </PersistGate>
  </Provider>
);

export default App;
