import React, {Component} from 'react';
import {useSpring, animated, useTransition} from 'react-spring';

function Alert(props) {
  const fade = useSpring({
    config: {
      tension: 100,
      clamp: true
    },
    opacity: 1,
    transform: `translate(0,0)`,
    from: {
      opacity: 0,
      transform: `translate(-30%,0)`
    },
  });
  return (
    <animated.div
      className='p-4'
      style={fade}
    >
      <h1 className='text-uppercase' style={{letterSpacing: '0.2em'}}>Test</h1>
    </animated.div>
  )
}

function Alerts(props) {
  const transitions = useTransition(props.alerts, item => item.name, {
    from: { transform: 'translate3d(0,-40px,0)' },
    enter: { transform: 'translate3d(0,0px,0)' },
    leave: { transform: 'translate3d(0,-40px,0)' },
  })
  return transitions.map(({ item, props, key }, i) =>
    <animated.div key={key} style={props}>{item.text}</animated.div>
  )
}

export default Alerts;
