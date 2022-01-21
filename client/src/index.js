import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ThemeProvider, } from '@mui/styles';
import { createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux'
import store, { persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';

const theme = createTheme();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <App />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'));


