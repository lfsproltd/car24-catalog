import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import '@progress/kendo-theme-default/dist/all.css';
import './App.css';
import RenderRoutes from './router/routes';

const App = () => {
  return (
    <Provider store={store}>
      <RenderRoutes />
    </Provider>
  );
}

export default App;