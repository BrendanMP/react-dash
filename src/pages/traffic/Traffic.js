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

import videoSrc from "../../video/sample.mp4";

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
      viewState: {
        latitude: INITIAL_VIEWSTATE.latitude,
        longitude: INITIAL_VIEWSTATE.longitude,
        zoom: INITIAL_VIEWSTATE.zoom,
        bearing: 0,
        pitch: INITIAL_VIEWSTATE.zoom * INITIAL_VIEWSTATE.pitch_modifer
      },
      activeDisplay: "map",
      active: {
        properties: {
          name: "Abidjan",
          type: "City"
        }
      }
    };
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._onUpdate = this._onUpdate.bind(this);
  }

  _renderLayers() {
    return [];
  }

  _onViewStateChange({ viewState }) {
    const viewstate = viewState;
    viewState.pitch = viewState.zoom * INITIAL_VIEWSTATE.pitch_modifer;
    this.setState({ viewState });
  }

  _onUpdate(update) {
    console.log(update);

    if (update.type === "display") {
      this.setState({ activeDisplay: update.data });
    }
  }

  componentDidMount() {
    const socket = socketIOClient(this.state.endpoint);
    socket.on("update", data => {
      this._onUpdate(data);
    });
  }

  render() {
    const { viewState, active, activeDisplay } = this.state;

    return (
      <div className="traffic">
        <aside className="traffic__sidebar">
          <section className="mb-4">
            <h5>Name</h5>
            <h2>{active.properties.name}</h2>
          </section>
          <section className="mb-4">
            <h5>Type</h5>
            <h2>{active.properties.type}</h2>
          </section>
          {active.properties.parent ? (
            <section className="mb-4">
              <h5>Parent</h5>
              <h2>{active.properties.parent || "Abidjan"}</h2>
            </section>
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
            <video src={videoSrc}></video>
          </div>
          <div className="traffic__timeline">Timeline</div>
        </main>
      </div>
    );
  }
}

export default Traffic;
