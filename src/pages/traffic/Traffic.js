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

const transitionInterpolator = new LinearInterpolator(["bearing"]);

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
      active: {
        properties: {
          name: "Foo",
          type: "Something"
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

  _onUpdate(data) {
    this.setState({ active: data });
  }

  componentDidMount() {
    const socket = socketIOClient(this.state.endpoint);
    socket.on("update", data => {
      this._onUpdate(data);
    });
  }

  render() {
    const { viewState, active } = this.state;

    return (
      <div className="traffic">
        <aside className="traffic__sidebar">
          <h2>{active.properties.name}</h2>
          <h5>{active.properties.type || "no type"}</h5>
        </aside>
        <main className="traffic__main">
          <div className="traffic__deck">
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
          <div className="traffic__timeline">Timeline</div>
        </main>
      </div>
    );
  }
}

export default Traffic;
