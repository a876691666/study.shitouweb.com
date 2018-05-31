import React, { Component } from 'react';
import logo from './logo.svg';
import app from './App.css';
import {observer} from 'mobx-react';
import { observable, action } from "mobx";

const App = observer(({appState}) => (
  <div className={app.App}>
    <header className={app.AppHeader}>
      <img src={logo} className={app.AppLogo} alt="logo" />
      <h1 className={app.AppTitle}>Welcome to React</h1>
    </header>
    <p className={app.AppIntro}>
      To get started, edit <code>src/App.js</code> and save to reload.
    </p>
  </div>
))

export default App;
