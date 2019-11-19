import React, { Component } from "react";
import { ReactComponent as FullScreen } from "../../images/fullscreen.svg";

class Fullscreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false
    };
    this._openFullscreen = this._openFullscreen.bind(this);
  }

  _openFullscreen() {
    const elem = document.documentElement;
    elem.requestFullscreen();
    this.setState({ fullScreen: true });
  }

  render() {
    return (
      <div>
        <button className="btn" onClick={this._openFullscreen}>
          <FullScreen />
        </button>
      </div>
    );
  }
}

export default Fullscreen;
