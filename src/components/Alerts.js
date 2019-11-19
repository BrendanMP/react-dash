import React, {Component} from 'react';
import {format, addSeconds} from 'date-fns';
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import Typed from 'react-typed';
import {useSpring, animated} from 'react-spring'

const round = function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function eta(seconds) {
  const timestamp = new Date('1-1-2020');
  const minuntes = round(seconds / 60, 0)
  return round(seconds / 60, 0) + 'min'
}

function AlertList(props) {
  const alerts = props.alerts;
  const clicked = props.clicked;
  const timestamp = new Date('1-1-2020');

  const fade = useSpring({opacity: 1, from: {opacity: 0}})

  return alerts.map((alert, i) =>
    <div
      style={fade}
      className={'panel panel--alert ' + alert.properties.status}
      onClick={() => clicked(alert)}
      key={i}
    >
      <div className="panel-body py-3 px-4">
        <h4 style={{lineHeight: 1}} className='text-uppercase mb-3'>{alert.properties.type}</h4>
        <h5 style={{lineHeight: 1}} className='text-capitalize mb-2 text-muted'>
          {alert.properties.status} @ {format(addSeconds(timestamp, alert.properties.start_timestamp), 'h:mm a')}
          <span>&nbsp;</span>
        </h5>
        <h5 className='text-muted text-capitalize mb-0' style={{lineHeight: 1}}>
          {
            alert.properties.status === 'detected' ?
              <div>
                Response Team ETA &mdash; {eta(alert.properties.end_timestamp - props.time)}
              </div>
              :
              <div>
                ETA to Resolution &mdash; {eta(alert.properties.end_timestamp - props.time)}
              </div>
          }
        </h5>
      </div>
    </div>
  );
}

class Alerts extends Component {
  render() {
    return (
      <AlertList
        alerts={this.props.alerts}
        clicked={this.props.clicked}
        time={this.props.time}
      />
    )
  }
}

export default Alerts