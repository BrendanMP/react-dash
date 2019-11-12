import React, {Component} from 'react';
import socketIOClient from 'socket.io-client'

class Socket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: '0.0.0.0:3030'
    }
    this._send = this._send.bind(this)
  }

  _send() {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('update', this.state.color);
  }

  componentDidMount() {
    const socket = socketIOClient(this.state.endpoint);
    socket.on('update', (col) => {
      document.body.style.backgroundColor = 'green'
    })
  }

  render() {
    return (
      <div>
        <div className="container my-5">Socket</div>
        <button onClick={this._send}></button>
      </div>
    )
  }
}

export default Socket