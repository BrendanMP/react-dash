import React, {Component} from 'react';
import {format, addSeconds} from 'date-fns';
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import Typed from 'react-typed';
import {useSpring, animated} from 'react-spring'


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
        <h5 style={{lineHeight: 1}} className={'text-uppercase mb-2'}>
          {alert.properties.status}
          <span>&nbsp;</span>
        </h5>
        <h5 className='text-muted mb-2 text-capitalize' style={{lineHeight: 1}}>
          <Typed
            strings={[`${alert.properties.type}`]}
            typeSpeed={1}
            startDelay={100}
            showCursor={false}
          />
          <span>&nbsp;</span>
        </h5>
        <h5 className='text-muted mb-0' style={{lineHeight: 1}}>
          <Typed
            strings={[`${format(addSeconds(timestamp, alert.properties.start_timestamp), 'h:mm a')}`]}
            typeSpeed={1}
            startDelay={100}
            showCursor={false}
          />
          <span>&nbsp;</span>
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
      />
    )
  }
}

export default Alerts