import React, { Component } from "react";
import DeckGL, {
  MapController,
  TripsLayer,
  PathLayer,
  GeoJsonLayer,
  HexagonLayer,
  ScatterplotLayer,
  LinearInterpolator,
  FlyToInterpolator
} from "deck.gl";
import { StaticMap } from "react-map-gl";
import { PhongMaterial } from "@luma.gl/core";

import Fullscreen from "../../components/deck/Fullscreen";

import CONSTRUCTION_POINTS_JSON from "../../data/adbijan/reseau_noeud";
import COMMUNES_JSON from "../../data/adbijan/communes";
import SUBCOMMUNES_JSON from "../../data/adbijan/sub_communes";

const DAY = new Date("1-1-2020");

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYnJlbmRhbi10cmFuc2l0bGFicyIsImEiOiJjazI5aHptaWEwdzJzM25vMnB0aHhqcjNlIn0.oZFZBkbrnOrF80fkS3xNgQ";

const MAPBOX_STYLE =
  "mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz";

const INITIAL_VIEWSTATE = {
  latitude: 5.322635048060814,
  longitude: -4.013425118889425,
  zoom: 12,
  bearing: 0,
  pitch: 12 * 3,
  pitch_modifer: 3
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206]
];

const transitionInterpolator = new LinearInterpolator(["bearing"]);

class BasicMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: INITIAL_VIEWSTATE
    };
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._rotateCamera = this._rotateCamera.bind(this);
  }

  _onViewStateChange({ viewState }) {
    this.setState({ viewState });
  }

  _renderLayers() {
    return [
      new GeoJsonLayer({
        id: "communes-fills",
        data: COMMUNES_JSON,
        stroked: true,
        filled: false,
        opacity: 0,
        lineWidthMinPixels: 0.5,
        getLineColor: d => [32, 201, 151]
      }),
      new GeoJsonLayer({
        id: "subcommunes-fills",
        data: SUBCOMMUNES_JSON,
        stroked: true,
        filled: false,
        opacity: 0,
        lineWidthMinPixels: 0.5,
        getLineColor: d => [32, 201, 151]
      }),
      new ScatterplotLayer({
        id: "contrstuction-paths",
        data: CONSTRUCTION_POINTS_JSON.features,
        getPosition: d => d.geometry.coordinates,
        stroked: false,
        filled: true,
        opacity: 1,
        getRadius: d => Math.random() * (60 - 30) + 30,
        getColor: d =>
          colorRange[Math.floor(Math.random() * colorRange.length)],
        parameters: {
          depthTest: false
        }
      })
    ];
  }

  _rotateCamera() {
    const bearing = this.state.viewState.bearing + 60;
    this.setState({
      viewState: {
        ...this.state.viewState,
        bearing,
        transitionDuration: 90000,
        transitionInterpolator,
        onTransitionEnd: this._rotateCamera
      }
    });
  }

  componentDidMount() {}

  render() {
    const { viewState } = this.state;
    return (
      <div>
        <DeckGL
          viewState={viewState}
          layers={this._renderLayers()}
          controller={{ type: MapController, doubleClickZoom: false }}
          onViewStateChange={this._onViewStateChange}
        >
          <StaticMap
            id="map"
            reuseMaps
            mapStyle={MAPBOX_STYLE}
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        </DeckGL>
        <div style={{ position: "fixed", top: "1rem", left: "1rem" }}>
          <Fullscreen />
        </div>
      </div>
    );
  }
}

export default BasicMap;
