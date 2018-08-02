import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import generateTheme from './configs/theme';
import configureStore from './configs/configureStore';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={generateTheme()}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'), // eslint-disable-line no-undef
);
registerServiceWorker();
