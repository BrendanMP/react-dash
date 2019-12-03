import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import COMMUNES_JSON from "../../data/adbijan/communes";
import SUBCOMMUNES_JSON from "../../data/adbijan/sub_communes";
import SEGMENTS_JSON from "../../data/adbijan/segments";
import INTERSECTIONS_JSON from "../../data/adbijan/intersections";

// Commune Data
COMMUNES_JSON.features.map(item => {
  item.properties.type = "commune";
});

// Subcommune JSON
SUBCOMMUNES_JSON.features.map(item => {
  item.properties.type = "subcommune";
});

// Segment JSON
SEGMENTS_JSON.features.map(item => {
  item.properties.type = "segment";
});

// Intersection JSON
INTERSECTIONS_JSON.features.map(item => {
  item.properties.type = "intersection";
});

class TrafficController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: "0.0.0.0:3030",
      communes: COMMUNES_JSON.features,
      subcommunes: SUBCOMMUNES_JSON.features,
      segments: SEGMENTS_JSON.features,
      intersections: INTERSECTIONS_JSON.features,
      datasets: [
        {
          name: "Traffic",
          sets: [
            {
              name: "All"
            },
            {
              name: "Private Vehicles"
            },
            {
              name: "Red Taxi"
            },
            {
              name: "Commune Taxi"
            },
            {
              name: "Gbaka"
            },
            {
              name: "SOTRA"
            },
            {
              name: "Trucks"
            },
            {
              name: "Pedestrians"
            }
          ]
        },
        {
          name: "Infrastructure",
          sets: [
            {
              name: "Road Conditions"
            },
            {
              name: "Traffic Lights"
            },
            {
              name: "Street Lights"
            },
            {
              name: "Sidewalks"
            },
            {
              name: "Drainage"
            }
          ]
        }
      ],
      controls: [
        {
          name: "Display",
          options: [
            {
              key: "map",
              label: "Map"
            },
            {
              key: "video",
              label: "Video"
            }
          ]
        },
        {
          name: "Playback",
          options: [
            {
              key: "play",
              label: "Play"
            },
            {
              key: "pause",
              label: "Pause"
            },
            {
              key: "slow",
              label: "Slow"
            },
            {
              key: "normal",
              label: "Normal"
            },
            {
              key: "fast",
              label: "Fast"
            }
          ]
        },
        {
          name: "Jump To",
          options: [
            {
              key: "morning",
              label: "Morning"
            },
            {
              key: "lunch",
              label: "Lunch"
            },
            {
              key: "evening",
              label: "Evening"
            },
            {
              key: "late_night",
              label: "Late Night"
            }
          ]
        }
      ]
    };

    this._update = this._update.bind(this);
  }

  _changeDisplay(type) {
    this._update("display", type);
  }

  _update(type, data) {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit("update", { type, data });
  }

  componentDidMount() {
    const socket = socketIOClient(this.state.endpoint);
    socket.on("update", update => {
      console.log(update);
    });
  }

  render() {
    const {
      communes,
      subcommunes,
      segments,
      intersections,
      datasets
    } = this.state;
    return (
      <div className="traffic-controller">
        <div className="traffic-controller__main">
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <h2 className="mb-5">Data</h2>
                {datasets.map(item => (
                  <section className="mb-5">
                    <header className="mb-3">{item.name}</header>
                    {item.sets.map(set => (
                      <button className="btn">{set.name}</button>
                    ))}
                  </section>
                ))}
              </div>
              <div className="col">
                <h2 className="mb-5">Locations</h2>
                <section className="mb-5">
                  <header className="mb-3">Communes</header>
                  <button className="btn">All</button>
                  {communes.map(item => (
                    <button className="btn" onClick={() => this._update(item)}>
                      {item.properties.name}
                    </button>
                  ))}
                </section>
                <section className="mb-5">
                  <header className="mb-3">Sub Communes</header>
                  {subcommunes.map(item => (
                    <button className="btn" onClick={() => this._update(item)}>
                      {item.properties.name}
                    </button>
                  ))}
                </section>
                <section className="mb-5">
                  <header className="mb-3">Segments</header>
                  {segments.map(item => (
                    <button className="btn" onClick={() => this._update(item)}>
                      {item.properties.name}
                    </button>
                  ))}
                </section>
                <section className="mb-5">
                  <header className="mb-3">Intersections</header>
                  {intersections.map(item => (
                    <button
                      className="btn"
                      onClick={() => this._update(item, "intersection")}
                    >
                      {item.properties.name}
                    </button>
                  ))}
                </section>
              </div>
              <div className="col">
                <h2 className="mb-5">Controls</h2>
                <section className="mb-5">
                  <header className="mb-3">Display</header>
                  <button
                    className="btn"
                    onClick={() => this._changeDisplay("video")}
                  >
                    Video
                  </button>
                  <button
                    className="btn"
                    onClick={() => this._changeDisplay("map")}
                  >
                    Map
                  </button>
                </section>
                <section className="mb-5">
                  <header className="mb-3">Playback</header>
                  <button className="btn">Play</button>
                  <button className="btn">Pause</button>
                  <button className="btn">Slow</button>
                  <button className="btn">Normal</button>
                  <button className="btn">Fast</button>
                </section>
                <section className="mb-5">
                  <header className="mb-3">Jump To</header>
                  <button className="btn">Morning</button>
                  <button className="btn">Lunch</button>
                  <button className="btn">Evening</button>
                  <button className="btn">Late Night</button>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TrafficController;
