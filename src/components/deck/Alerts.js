import React, { Component } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

function eta(seconds) {
  return round(seconds / 60, 0) + "min";
}

function alertEta(alert, time) {
  if (alert.name === "detected") {
    return "Dispatching Response Team";
  }

  if (alert.name === "en_route") {
    return `Response Team ETA ${eta(alert.end - time)}`;
  }

  if (alert.name === "responding") {
    return `Time to clear ${eta(alert.end - time)}`;
  }

  if (alert.name === "clearing") {
    return `Time till cleared ${eta(alert.end - time)}`;
  }
}

const Alert = props => (
  <div
    className={`panel panel--alert panel--alert--${
      props.alert.active ? props.alert.active.name : ""
    }`}
  >
    <div className="panel-body">
      <div
        className={`h5 mb-3 ${
          props.alert.active.name === "detected" ? "pulse" : ""
        }`}
      >
        {props.alert.active ? props.alert.active.label : "&nbsp;"}
      </div>
      <div className="mb-2">{props.alert.type}</div>
      <div>{alertEta(props.alert.active, props.time)}</div>
    </div>
  </div>
);

class Alerts extends Component {
  render() {
    const { events, time } = this.props;
    return (
      <TransitionGroup className="alerts">
        {events.map((event, i) => (
          <CSSTransition key={i} timeout={200} classNames="alert">
            <Alert alert={event} time={time} key={i} />
          </CSSTransition>
        ))}
      </TransitionGroup>
    );
  }
}

export default Alerts;
