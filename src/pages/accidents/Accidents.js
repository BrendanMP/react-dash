import React, { Component } from "react";
import DeckGL, {
  MapController,
  GeoJsonLayer,
  HexagonLayer,
  FlyToInterpolator,
  LinearInterpolator
} from "deck.gl";
import { PhongMaterial } from "@luma.gl/core";
import { StaticMap } from "react-map-gl";
import COMMUNES_JSON from "../../data/adbijan/communes";
import ACCIDENTS_JSON from "../../data/adbijan/accidents";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYnJlbmRhbi10cmFuc2l0bGFicyIsImEiOiJjazI5aHptaWEwdzJzM25vMnB0aHhqcjNlIn0.oZFZBkbrnOrF80fkS3xNgQ";

const transitionInterpolator = new LinearInterpolator(["bearing"]);

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

class Accidents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: {
        latitude: 5.322635048060814,
        longitude: -4.013425118889425,
        zoom: 13,
        bearing: 0,
        pitch: 13 * 3
      },
      time: 39640,
      date: new Date("2019-10-10 0:00"),
      active: [],
      layers: {
        hexagon: {
          elevationScale: 0,
          coverage: 1,
          opacity: 0
        }
      }
    };
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._rotateCamera = this._rotateCamera.bind(this);
    this._flyTo = this._flyTo.bind(this);
    this._renderTooltip = this._renderTooltip.bind(this);
  }

  _flyTo(bounds) {
    this.setState({
      viewState: {
        ...this.state.viewState,
        longitude: bounds.longitude || this.state.viewState.longitude,
        latitude: bounds.latitude || this.state.viewState.latitude,
        zoom: bounds.zoom || this.state.viewState.zoom,
        pitch: bounds.pitch || this.state.viewState.pitch,
        bearing: 0,
        transitionDuration: 800,
        transitionInterpolator: new FlyToInterpolator({ curve: 5 }),
        transitionEasing: t =>
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        onTransitionEnd: this._rotateCamera
      }
    });
  }

  _renderTooltip() {
    const { hoveredObject, pointerX, pointerY } = this.state || {};
    return (
      hoveredObject && (
        <div
          style={{
            position: "absolute",
            zIndex: 1,
            pointerEvents: "none",
            left: pointerX,
            top: pointerY
          }}
        >
          {hoveredObject.message}
        </div>
      )
    );
  }

  _renderLayers = () => {
    const { hexagon } = this.state.layers;
    return [
      new HexagonLayer({
        id: "hex-layer",
        colorRange,
        material,
        data: ACCIDENTS_JSON.accidents,
        pickable: true,
        opacity: 1,
        stroked: true,
        filled: true,
        extruded: true,
        lineWidthMinPixels: 1,
        getPosition: d => {
          return [Number(d.longitude), Number(d.latitude)];
        },
        elevationScale: 1,
        coverage: 1,
        radius: 30,
        transitions: {
          elevationScale: 2400,
          coverage: 1200,
          opacity: 800
        },
        getFillColor: d => [32, 201, 151],
        onHover: info =>
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y
          })
      })
    ];
  };

  _onViewStateChange({ viewState }) {
    const viewstate = viewState;
    viewState.pitch = viewState.zoom * 3;
    this.setState({ viewState });
  }

  _rotateCamera() {
    const bearing = this.state.viewState.bearing + 90;
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

  _addData = () => {
    const state = this.state;
    state.layers.hexagon.elevationScale = 1;
    state.layers.hexagon.opacity = 1;
    setTimeout(() => {
      this.setState(state);
      // this._rotateCamera();
    }, 3000);
  };

  componentDidMount() {
    this._addData();
  }

  render() {
    const {
      mapStyle = "mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz"
    } = this.props;
    const { viewState, time, date } = this.state;
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
            mapStyle={mapStyle}
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        </DeckGL>
        <div
          style={{
            position: "fixed",
            top: "2rem",
            right: "2rem",
            width: "20vw"
          }}
        >
          <div className="panel">
            {/*<div className="panel-body lead mb-0">{format(addSeconds(date, time || 0), 'h:mm a')}</div>*/}
          </div>
        </div>
        <div
          style={{
            position: "fixed",
            top: "2rem",
            left: "2rem",
            width: "25vw"
          }}
        ></div>
      </div>
    );
  }
}

export default Accidents;
