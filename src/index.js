import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from './pages/Home';

import './../src/style/globalStyle.css';

import './config/firebase';

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
);

