import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ReactLive, ClickButton } from './reactLive';
import { Notice } from './stoneUI.react';
import registerServiceWorker from './registerServiceWorker';
import { observable, action, computed } from "mobx";
import { observer } from "mobx-react";

class appState {

  @observable text = '点我';

  @action.bound
  click() {
    this.text += '1'
    Notice.Dialog({
      message:111
    })
  }
}

ReactDOM.render((
  <div>
    <App />
    <ClickButton appState={new appState}/>
    <ReactLive />
  </div>
), document.getElementById('app'));
registerServiceWorker();
