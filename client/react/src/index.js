import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ReactLive from './reactLive';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
  <div>
    <App />
    <ReactLive />
  </div>
), document.getElementById('app'));
registerServiceWorker();
