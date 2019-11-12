import React, {Component} from 'react';
import Alerts from './alerts/Alerts'
import {useTransition} from "react-spring";

class Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alerts: [
        {
          name: 'Alert 1'
        },
      ]
    }

    this._addItem = this._addItem.bind(this)
    this._removeItem = this._removeItem.bind(this)
  }

  _addItem() {
    this.setState({alerts: [
      ...this.state.alerts,
        {
          name: 'foo'
        }
      ]
    })
  }

  _removeItem() {
    console.log('removing')
    var array = [...this.state.alerts];
    array.splice(0, 1);
    this.setState({alerts: array})
  }

  render() {
    const {alerts} = this.state;

    return (
      <div>
        <Alerts alerts={alerts}/>
        <button onClick={() => this._addItem()}>BUTTON CLICK</button>
        <button onClick={() => this._removeItem()}>REMOVE CLICK</button>
      </div>
    );
  }
}

export default Test;