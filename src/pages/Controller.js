import React from "react";

import { format, addSeconds } from "date-fns";

import Deck from "../components/Deck";
import Voice from "../components/Voice";
import { ReactComponent as COA } from "../images/COA.svg";
import RangeSlider from "../components/RangeSlider";

class Controller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: {
        name: ""
      },
      command: "",
      isPlaying: false,
      time: 0,
      date: new Date("2019-10-10 0:00"),
      interval: null
    };
    this._play = this._play.bind(this);
    this._pause = this._pause.bind(this);
    this._newCommand = this._newCommand.bind(this);
  }

  _clickedLayer = data => {
    this.setState({ active: data.object.properties });
  };

  _newCommand = value => {
    this.setState({ command: value });
  };

  _play = () => {
    if (this.state.time <= 86400) {
      this.setState({ time: this.state.time + 1 });
    } else {
      this.setState({ time: 0 });
    }
    this._animationFrame = window.requestAnimationFrame(this._play.bind(this));
  };

  _pause = () => (this._animationFrame = null);
  rangeChange = value => this.setState({ time: value });

  render() {
    const { command } = this.state;
    return (
      <div className="controller">
        <Voice newCommand={this._newCommand} />
        {/*<Deck*/}
        {/*  controller={true}*/}
        {/*  command={command}*/}
        {/*  time={this.state.time}*/}
        {/*  clickedLayer={this._clickedLayer}*/}
        {/*/>*/}
        <div className="controller__header">
          <div className="panel">
            <div className="flex-grow-1">
              <COA />
            </div>
            <div className="d-flex align-items-center">
              <div>
                {format(
                  addSeconds(this.state.date, this.state.time),
                  "MMM dd h:mm a"
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="controller__footer">
          <div className="panel">
            <div className="flex-grow-1">
              <RangeSlider rangeChange={this.rangeChange} />
            </div>
          </div>
        </div>
        <div className="controller__info d-none">
          <div className="panel">
            <div className="panel__section">
              <button className="btn btn-block btn-outline-light">
                Traffic
              </button>
              <button className="btn btn-block btn-outline-light">
                Traffic
              </button>
              <button className="btn btn-block btn-outline-light">
                Traffic
              </button>
            </div>
            <div className="panel__section">{this.state.active.name}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Controller;
