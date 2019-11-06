import React from "react";

import Deck from '../components/Deck'
import Voice from '../components/Voice'
import { ReactComponent as COA } from '../images/COA.svg';
import RangeSlider from '../components/RangeSlider'

class Controller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: {
        name: ''
      },
      command: '',
    }

    this._newCommand = this._newCommand.bind(this);
  }

  _clickedLayer = (data) => {
    this.setState({active: data.object.properties})
  }

  _newCommand = (value) => {
    this.setState({command: value})
  }

  render() {
    const {command} = this.state;
    return (
      <div className="controller">
        <Deck
          controller={true}
          command={command}
          clickedLayer={this._clickedLayer}
        />
        <div className="controller__header">
          <div className="panel">
            <div className='flex-grow-1'>
              <COA/>
            </div>
            <div><Voice newCommand={this._newCommand}/> <span>{this.state.command}</span></div>
          </div>
        </div>
        <div className="controller__info">
          <div className="panel">
            <div className="panel__section">
              <button className="btn btn-block btn-outline-light">Traffic</button>
              <button className="btn btn-block btn-outline-light">Traffic</button>
              <button className="btn btn-block btn-outline-light">Traffic</button>
            </div>
            <div className="panel__section">
              {this.state.active.name}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Controller