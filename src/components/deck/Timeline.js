import React, { Component } from "react";
import InputRange from "react-input-range";
import { addSeconds, format } from "date-fns";

import Fullscreen from "./Fullscreen";

import { ReactComponent as Play } from "../../images/play.svg";
import { ReactComponent as Pause } from "../../images/pause.svg";

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: this.props.time,
      isPlaying: false,
      fullScreen: false,
      speed: this.props.speed,
      speedModifier: 1
    };
    this._toggleAnimation = this._toggleAnimation.bind(this);
    this._updateTime = this._updateTime.bind(this);
    this._toggleSpeed = this._toggleSpeed.bind(this);
    this._animationFrame = null;
  }

  _animate() {
    if (this.state.time < 86400) {
      this._updateTime(
        this.state.time + (this.state.speed * this.state.speedModifier || 1)
      );
    } else {
      this._updateTime(0);
    }
    this._animationFrame = window.requestAnimationFrame(
      this._animate.bind(this)
    );
  }

  _updateTime(value) {
    this.setState({ time: value });
    this.props.update(value);
  }

  _toggleAnimation() {
    cancelAnimationFrame(this._animationFrame);
    const { isPlaying } = this.state;
    if (!isPlaying) this._animate();
    this.setState({ isPlaying: !isPlaying });
  }

  _toggleSpeed() {
    if (this.state.speedModifier === 1) {
      this.setState({ speedModifier: 2 });
    } else {
      this.setState({ speedModifier: 1 });
    }
  }

  _formatLabel = value =>
    format(addSeconds(this.props.day, value || 0), "h:mm a");

  render() {
    const { isPlaying, speedModifier } = this.state;
    return (
      <div className="d-flex align-items-center flex-grow-1">
        <div className="mr-4">
          <button className="btn" onClick={this._toggleAnimation}>
            {!isPlaying ? <Play /> : <Pause />}
          </button>
          <button className="btn mx-2" onClick={this._toggleSpeed}>
            {speedModifier}x
          </button>
        </div>
        <div className="flex-grow-1">
          <InputRange
            minValue={0}
            maxValue={86400}
            value={this.state.time}
            formatLabel={value => this._formatLabel(value)}
            onChange={value => this._updateTime(value)}
          />
        </div>
        <div className="ml-4">
          <Fullscreen />
        </div>
      </div>
    );
  }
}

export default Timeline;
