import React, { Component } from "react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { DataFilterExtension } from "@deck.gl/extensions";
import uuid from "uuid";
import convertDirections from "../../utilities/convertDirections";

import Timeline from "../../components/deck/Timeline";
import Alerts from "../../components/deck/Alerts";
import Header from "../../components/deck/Header";
import Info from "../../components/deck/Info";
import Deck from "../../components/deck/Deck";

import INCIDENT_JSON from "../../data/adbijan/incidents_points.json";
import INCIDENT_TRAFFIC_JSON from "../../data/adbijan/incidents_traffic.json";
import INCIDENT_RESPONSE_JSON from "../../data/adbijan/incidents_responders";

const RESPONDERS = convertDirections(INCIDENT_RESPONSE_JSON);
const TRAFFIC = convertDirections(INCIDENT_TRAFFIC_JSON, true);

const DAY = new Date("1-1-2020");

const EVENTS = [
  {
    id: uuid(),
    start: 31500,
    end: 36283,
    type: "Severe Accident",
    longitude: -3.99575,
    latitude: 5.30649,
    priority: "high",
    response: {
      origin: "Marcory",
      arrival: 32532
    },
    events: [
      {
        id: uuid(),
        name: "detected",
        label: "Detected",
        start: 31500,
        end: 31683
      },
      {
        id: uuid(),
        name: "en_route",
        label: "En Route",
        start: 31683,
        end: 32532
      },
      {
        id: uuid(),
        name: "responding",
        label: "Responding",
        start: 32532,
        end: 34683
      },
      {
        id: uuid(),
        name: "clearing",
        label: "Clearing",
        start: 34683,
        end: 36283
      }
    ]
  }
];

class Incidents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 31500,
      day: new Date("1-1-2020"),
      timeline: {
        isPlaying: false,
        range: {
          min: 0,
          max: 86400
        }
      },
      events: []
    };
    this._updateTime = this._updateTime.bind(this);
  }

  _updateTime(value) {
    let info = {};
    const events = EVENTS.filter(event => {
      if (value > event.start && value < event.end) {
        event.active = event.events.find(event => {
          if (value >= event.start && value <= event.end) {
            return event;
          }
        });
        return event;
      }
    });
    this.setState({
      time: value,
      events,
      info
    });
  }

  componentDidMount() {
    this._updateTime(this.state.time);
  }

  render() {
    const { time, day, timeline, events } = this.state;
    return (
      <div className="deck">
        <Deck
          time={time}
          events={events}
          responders={RESPONDERS}
          traffic={TRAFFIC}
          flyTo={() => this._flyTo()}
        />
        <header className="deck__header">
          <Header day={day} time={time} />
        </header>
        <div className="deck__main">
          <div className="deck__alerts">
            <Alerts events={events} time={time} />
          </div>
          <div className="deck__info">
            <Info events={events} />
          </div>
        </div>
        <div className="deck__timeline">
          <Timeline
            speed={1}
            day={day}
            time={time}
            min={timeline.range.min}
            max={timeline.range.max}
            update={this._updateTime}
          />
        </div>
      </div>
    );
  }
}

export default Incidents;
