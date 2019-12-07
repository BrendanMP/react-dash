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
import Label from "../../components/DemoLabel";

import CONSTRUCTION_JSON from "../../data/adbijan/reseau_arc";
import CONSTRUCTION_POINTS_JSON from "../../data/adbijan/reseau_noeud";
import ACCIDENTS_JSON from "../../data/adbijan/accidents";

const DAY = new Date("1-1-2020");

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYnJlbmRhbi10cmFuc2l0bGFicyIsImEiOiJjazI5aHptaWEwdzJzM25vMnB0aHhqcjNlIn0.oZFZBkbrnOrF80fkS3xNgQ";

const MAPBOX_STYLE =
  "mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz";

const INITIAL_VIEWSTATE = {
  latitude: 5.322635048060814,
  longitude: -4.013425118889425,
  zoom: 14,
  bearing: 0,
  pitch: 14 * 3,
  pitch_modifer: 3
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [254, 120, 78]
];

const material = new PhongMaterial({
  ambient: 0.8,
  diffuse: 0.3,
  shininess: 60,
  specularColor: [51, 51, 51]
});

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
        id: "contrstuction-paths",
        data: CONSTRUCTION_JSON,
        stroked: true,
        filled: false,
        opacity: 0.2,
        lineWidthMinPixels: 2,
        getLineColor: [32, 201, 151]
      }),
      new HexagonLayer({
        id: "hex-layer",
        colorRange: colorRange,
        material,
        data: CONSTRUCTION_POINTS_JSON.features,
        pickable: true,
        opacity: 0.8,
        stroked: true,
        filled: true,
        extruded: true,
        lineWidthMinPixels: 1,
        getPosition: d => d.geometry.coordinates,
        elevationScale: 0.5,
        coverage: 1,
        radius: 30,
        transitionEasing: "linear",
        transitions: {
          elevationScale: 600
        },
        getFillColor: d => [32, 201, 151],
        onHover: info => {
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y
          });
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

  componentDidMount() {
    setTimeout(() => {
      this._rotateCamera();
    }, 200);
  }

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
          <Label />
        </div>
        <div style={{ position: "fixed", top: "1rem", right: "1rem" }}>
          <Fullscreen />
        </div>
      </div>
    );
  }
}

export default BasicMap;
