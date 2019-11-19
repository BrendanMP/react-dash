import React, { Component } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ReactComponent as Close } from "../../images/close.svg";

class Info extends Component {
  _toggleEvent(i) {
    this.props.events[i].hidden = true;
  }
  render() {
    const { events } = this.props;
    return (
      <TransitionGroup className="info">
        {events.map((event, i) => {
          if (!event.hidden) {
            return (
              <CSSTransition key={i} timeout={300} classNames="info__panel">
                <div className="panel panel--info">
                  <div className="panel-body flex-grow-1">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h3 className="flex-grow-1 mb-0">Incident Details</h3>
                      <button
                        className="btn p-0"
                        onClick={() => this._toggleEvent(i)}
                      >
                        <Close />
                      </button>
                    </div>
                    <h5 className="mb-3">{event.type}</h5>
                    <div className="mb-3">
                      Reponse Team Origin - {event.response.origin}
                    </div>
                    <div className="mb-3">
                      Response Team ETA - {event.response.arrival}
                    </div>
                    <div className="mb-3">Resolution ETA - {event.end}</div>
                    <div className="mb-3">Priority - {event.priority}</div>
                  </div>
                </div>
              </CSSTransition>
            );
          }
        })}
      </TransitionGroup>
    );
  }
}

export default Info;
