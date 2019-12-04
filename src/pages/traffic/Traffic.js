import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import DeckGL, {
  MapController,
  TripsLayer,
  PathLayer,
  GeoJsonLayer,
  LinearInterpolator,
  FlyToInterpolator
} from "deck.gl";
import { StaticMap } from "react-map-gl";

import PATHS from "../../data/adbijan/segment-routes";

import Fullscreen from "../../components/deck/Fullscreen";

import videoSrc from "../../video/sample.mp4";

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [254, 120, 78]
];

const INITIAL_VIEWSTATE = {
  latitude: 5.322635048060814,
  longitude: -4.013425118889425,
  zoom: 12,
  bearing: 0,
  pitch: 12 * 3,
  pitch_modifer: 3
};

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYnJlbmRhbi10cmFuc2l0bGFicyIsImEiOiJjazI5aHptaWEwdzJzM25vMnB0aHhqcjNlIn0.oZFZBkbrnOrF80fkS3xNgQ";

const MAPBOX_STYLE =
  "mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz";

class Traffic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: "0.0.0.0:3030",
      fullscreen: false,
      viewState: {
        latitude: INITIAL_VIEWSTATE.latitude,
        longitude: INITIAL_VIEWSTATE.longitude,
        zoom: INITIAL_VIEWSTATE.zoom,
        bearing: 0,
        pitch: INITIAL_VIEWSTATE.zoom * INITIAL_VIEWSTATE.pitch_modifer
      },
      activeData: {},
      activeLocation: {
        properties: {
          name: "Abidjan",
          type: "City"
        }
      },
      activeDisplay: "map",
      time: 0,
      playback: {
        isPlaying: false,
        speed: 1,
        speedModifier: 1
      }
    };
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
    this._openFullscreen = this._openFullscreen.bind(this);
    this._play = this._play.bind(this);
  }

  _renderLayers() {
    return [
      new GeoJsonLayer({
        id: "geojson",
        data: PATHS,
        opacity: 1,
        stroked: false,
        filled: false,
        lineWidthMinPixels: 2,
        parameters: {
          depthTest: false
        },

        getLineColor: f =>
          colorRange[Math.floor(Math.random() * colorRange.length)],
        getLineWidth: 10,

        pickable: true,
        onHover: f => {
          if (f.object && f.object.properties) {
            console.log(f.object);
          }
        }

        // updateTriggers: {
        //   getLineColor: { year },
        //   getLineWidth: { year }
        // },
        //
        // transitions: {
        //   getLineColor: 1000,
        //   getLineWidth: 1000
        // }
      })
    ];
  }

  _onViewStateChange({ viewState }) {
    const viewstate = viewState;
    viewState.pitch = viewState.zoom * INITIAL_VIEWSTATE.pitch_modifer;
    this.setState({ viewState });
  }

  _onUpdate(update) {
    if (update.type === "display") {
      this.setState({ activeDisplay: update.data });
    }

    if (update.type === "playback") {
      if (update.data === "play") {
        this._play();
      }
    }

    if (update.type === "location") {
      console.log("yo");
      this.setState({ activeLocation: update.data });
    }

    if (update.type === "data") {
      this.setState({ activeData: update.data });
    }
  }

  _play() {
    const { time, playback } = this.state;

    if (time <= 86400) {
      this.setState({ time: time + 1 / 60 });
    } else {
      this.setState({ time: 0 });
    }

    this._interval = setInterval(() => this._play(), 1000 / 60);
  }

  _pause() {
    clearInterval(this._interval);
  }

  _updateTime(value) {
    this.setState({ time: value });
  }

  _openFullscreen() {
    const elem = document.documentElement;
    elem.requestFullscreen();
    this.setState({ fullscreen: true });
  }

  componentDidMount() {
    const socket = socketIOClient(this.state.endpoint);
    socket.on("update", data => {
      this._onUpdate(data);
    });
  }

  render() {
    const {
      viewState,
      activeLocation,
      activeDisplay,
      activeData,
      fullscreen,
      time
    } = this.state;
    return (
      <div className="traffic">
        <aside className="traffic__sidebar">
          <div>
            <section className="mb-4">
              <h5>Name</h5>
              <h2>{activeLocation.properties.name}</h2>
            </section>
            <section className="mb-4">
              <h5>Type</h5>
              <h2>{activeLocation.properties.type}</h2>
            </section>
            {activeLocation.properties.parent ? (
              <section className="mb-4">
                <h5>Parent</h5>
                <h2>{activeLocation.properties.parent || "Abidjan"}</h2>
              </section>
            ) : null}

            <section className="mb-4">
              <h5>Dataset</h5>
              <h2>{activeData.name || "None"}</h2>
            </section>
          </div>
          {!fullscreen ? (
            <button className="btn" onClick={this._openFullscreen}>
              Full
            </button>
          ) : null}
        </aside>
        <main className="traffic__main">
          <div
            className={`traffic__map ${
              activeDisplay === "map" ? "active" : ""
            }`}
          >
            <DeckGL
              viewState={viewState}
              controller={{ type: MapController, doubleClickZoom: false }}
              layers={this._renderLayers()}
              onViewStateChange={this._onViewStateChange}
            >
              <StaticMap
                reuseMaps
                mapStyle={MAPBOX_STYLE}
                preventStyleDiffing={true}
                mapboxApiAccessToken={MAPBOX_TOKEN}
              />
            </DeckGL>
          </div>
          <div
            className={`traffic__video ${
              activeDisplay === "video" ? "active" : ""
            }`}
          >
            <video src={videoSrc} />
          </div>
          <div className="traffic__timeline">{Number(time).toFixed(0)}</div>
        </main>
      </div>
    );
  }
}

export default Traffic;
