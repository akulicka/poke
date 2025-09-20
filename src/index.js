import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './Util/Context';
import { Box } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <App />
  </AppProvider>
);
