import React from "react";
import { render } from "react-dom";
import { observable, action, computed } from "mobx";
import { observer } from "mobx-react";

class AppState {
  @observable timer = 0;

  constructor() {
    setInterval(() => {
      this.timer += 1;
    }, 1000);
  }
  componentWillMount() {
    alert("componentWillMount");
  }

  componentDidMount() {
    alert("componentDidMount");
  }

  componentWillReceiveProps(nextProps) {
    alert("componentWillReceiveProps");
  }

  @action.bound
  reset() {
    this.timer = 0;
  }

  @action.bound
  left() {
    this.timer -= 1;
  }
}

@observer
class TimerView extends React.Component {
  @observable secondsPassed = 10;

  componentDidMount() {
    this.timer = setInterval(() => {
      this.secondsPassed += 1;
    }, 1000);
  }
  componentWillUnmount() {
    console.log(this.timer);
    clearInterval(this.timer);
  }

  componentWillReact() {}

  render() {
    let appState = this.props.appState || {};
    return (
      <div>
        <p>内部计数器: {this.secondsPassed}</p>
        <p onClick={appState.reset} onMouseMove={appState.left}>
          外部计数器: {appState.timer}
        </p>
      </div>
    );
  }
}

@observer
class IsToggle extends React.Component {
  render() {
    let appState = this.props.appState || {};
    if (appState.isToggle) {
      return <TimerView appState={new AppState()} />;
    } else {
      return null;
    }
  }
}

@observer
class ClickButton extends React.Component {
  render() {
    let appState = this.props.appState || {};
    return <button onClick={appState.click}>{appState.text}</button>;
  }
}

class isToggle {
  @observable isToggle = false;
  @observable time = 1;

  @action.bound
  click() {
    this.isToggle = !this.isToggle;
    this.time += 1;
  }

  @computed
  get text() {
    return this.isToggle.toString();
  }
}

var it = new isToggle();

@observer
class ReactLive extends React.Component {
  render() {
    return (
      <div>
        <ClickButton appState={it} />
        <IsToggle appState={it} />
      </div>
    )
  }
}


export {ReactLive, ClickButton};
