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
      filteredSubcommunes: [],
      segments: SEGMENTS_JSON.features,
      intersections: INTERSECTIONS_JSON.features,
      datasets: [
        {
          name: "Traffic",
          sets: [
            {
              name: "All",
              key: "all"
            },
            {
              name: "Private Vehicles",
              key: "PRIVATE_VEHICLES"
            },
            {
              name: "Red Taxi",
              key: "RED_TAXI"
            },
            {
              name: "Commune Taxi",
              key: "COMMUNE_TAXI"
            },
            {
              name: "Gbaka",
              key: "GBAKA"
            },
            {
              name: "SOTRA",
              key: "SOTRA"
            },
            {
              name: "Trucks",
              key: "TRUCKS"
            },
            {
              name: "Pedestrians",
              key: "PEDESTRIAN"
            }
          ]
        },
        {
          name: "Infrastructure",
          sets: [
            {
              name: "Road Conditions",
              key: "ROAD_CONDITIONS"
            },
            {
              name: "Traffic Lights",
              key: "TRAFFIC_LIGHTS"
            },
            {
              name: "Street Lights",
              key: "STREET_LIGHTS"
            },
            {
              name: "Sidewalks",
              key: "SIDEWALKS"
            },
            {
              name: "Drainage",
              key: "DRAINAGE"
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
    this._selectCommune = this._selectCommune.bind(this);
    this._clearSelection = this._clearSelection.bind(this);
  }

  _changeDisplay(type) {
    this._update("display", type);
  }

  _changePlayback(action) {
    this._update("playback", action);
  }

  _selectCommune(commune) {
    const { communes, subcommunes } = this.state;
    communes.map(item => {
      item.selected = false;
      item.compare = false;
    });

    const selectedCommune = communes.find(item => item === commune);
    selectedCommune.selected = true;

    const filteredSubcommunes = subcommunes.filter(
      item => item.parent === selectedCommune.properties.commune_id
    );

    this.setState({ communes, filteredSubcommunes });
    this._update("location", commune);
  }

  _compareCommune(commune) {
    const { communes } = this.state;
    communes.map(item => (item.selected = false));
    const comparing = communes.filter(item => item.compare);
    if (comparing.length > 1) communes.map(item => (item.compare = false));
    commune.compare = !commune.compare;
    this.setState({ communes });
  }

  _clearSelection() {
    const { communes } = this.state;
    const filteredSubcommunes = [];
    communes.map(item => {
      item.selected = false;
      item.compare = false;
    });
    this.setState({ communes, filteredSubcommunes });
  }

  _changeData(data) {
    const { datasets } = this.state;

    datasets.map(set => {
      set.sets.map(item => {
        item.selected = false;
      });
    });

    data.selected = true;

    this.setState({ datasets });

    this._update("data", data);
  }

  _update(type, data) {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit("update", { type, data });
  }

  render() {
    const { communes, datasets, filteredSubcommunes } = this.state;
    const activeCommune = communes.find(item => item.selected);

    return (
      <div className="traffic-controller">
        <div className="traffic-controller__main">
          <div className="container-fluid">
            <div className="row">
              <div className="col-5">
                <h2 className="mb-5">Data</h2>
                {datasets.map((item, i) => (
                  <section className="mb-5" key={`set-${i}`}>
                    <header className="mb-3">{item.name}</header>
                    {item.sets.map((set, i) => (
                      <button
                        className={`btn ${set.selected ? "active" : ""}`}
                        key={`sets-${i}`}
                        onClick={() => this._changeData(set, i)}
                      >
                        {set.name}
                      </button>
                    ))}
                  </section>
                ))}
              </div>
              <div className="col">
                <h2 className="mb-5">Locations</h2>
                <section className="mb-5">
                  <header className="mb-3 d-flex justify-content-between align-items-center">
                    <div>Communes</div>
                    <button className="btn mb-0" onClick={this._clearSelection}>
                      Reset
                    </button>
                  </header>
                  {communes.map(item => (
                    <div className="d-flex align-items-center" key={item.id}>
                      <div className="flex-grow-1">{item.properties.name}</div>
                      <button
                        className={`btn ${item.selected ? "active" : ""}`}
                        onClick={() => this._selectCommune(item)}
                      >
                        Select
                      </button>
                      <button
                        className={`btn ${item.compare ? "active" : ""}`}
                        onClick={() => this._compareCommune(item)}
                      >
                        Compare
                      </button>
                    </div>
                  ))}
                </section>
                <section className="mb-5">
                  <header className="mb-3 d-flex justify-content-between align-items-center">
                    <div>Sub-Communes</div>
                    <button className="btn mb-0" onClick={this._clearSelection}>
                      Reset
                    </button>
                  </header>
                  {filteredSubcommunes.length
                    ? filteredSubcommunes.map(item => (
                        <div
                          className="d-flex align-items-center"
                          key={item.id}
                        >
                          <div className="flex-grow-1">
                            {item.properties.name}
                          </div>
                          <button
                            className={`btn ${item.selected ? "active" : ""}`}
                            onClick={() => this._selectSubcommune(item)}
                          >
                            Select
                          </button>
                          <button
                            className={`btn ${item.compare ? "active" : ""}`}
                            onClick={() => this._compareSubcommune(item)}
                          >
                            Compare
                          </button>
                        </div>
                      ))
                    : null}
                </section>
              </div>
              <div className="col-12">
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
                  <button
                    className="btn"
                    onClick={() => this._changePlayback("play")}
                  >
                    Play
                  </button>
                  <button
                    className="btn"
                    onClick={() => this._changePlayback("pause")}
                  >
                    Pause
                  </button>
                </section>
                <section className="mb-5">
                  <header className="mb-3">Speed</header>
                  <button
                    className="btn"
                    onClick={() => this._changePlayback("slow")}
                  >
                    Slow
                  </button>
                  <button
                    className="btn"
                    onClick={() => this._changePlayback("normal")}
                  >
                    Normal
                  </button>
                  <button
                    className="btn"
                    onClick={() => this._changePlayback("fast")}
                  >
                    Fast
                  </button>
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
