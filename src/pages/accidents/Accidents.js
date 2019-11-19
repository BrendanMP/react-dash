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

import { ReactComponent as AccidentsIcon } from "../../images/accidents.svg";
import { ReactComponent as FatalitiesIcon } from "../../images/fatalities.svg";
import { ReactComponent as ResponseTimeIcon } from "../../images/response-time.svg";
import { ReactComponent as NotResponsedIcon } from "../../images/not-responded.svg";

import ACCIDENTS_JSON from "../../data/adbijan/accidents";
import COMMUNES_JSON from "../../data/adbijan/communes";
import Header from "../../components/deck/Header";
import Alerts from "../../components/deck/Alerts";
import Info from "../../components/deck/Info";

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
      layers: [
        { name: "accidents", visible: false, label: "Accidents" },
        { name: "fatalities", visible: false, label: "Fatalities" },
        { name: "response_time", visible: false, label: "Response Time" },
        { name: "not_responded", visible: false, label: "Not Responded" }
      ],
      hoveredObject: {}
    };
    this._renderLayers = this._renderLayers.bind(this);
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
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        // onTransitionEnd: this._rotateCamera
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
            left: pointerX || -50,
            top: pointerY || -50
          }}
        >
          {hoveredObject.points.length}
        </div>
      )
    );
  }

  _renderLayers = () => {
    const active = this.state.layers.find(layer => layer.visible === true);

    return [
      new HexagonLayer({
        id: "accident-layer",
        colorRange,
        material,
        data: ACCIDENTS_JSON.accidents,
        pickable: true,
        opacity: active && active.name === "accidents" ? 1 : 0,
        stroked: true,
        filled: true,
        extruded: true,
        lineWidthMinPixels: 1,
        getPosition: d => {
          return [Number(d.longitude), Number(d.latitude)];
        },
        elevationScale: active && active.name === "accidents" ? 1 : 0,
        coverage: 1,
        radius: 90,
        transitions: {
          elevationScale: 2400
          // opacity: 2400
        },
        getFillColor: d => [32, 201, 151],
        onHover: info => {
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y
          });
        }
      }),
      new HexagonLayer({
        id: "fatalities-layer",
        colorRange,
        material,
        data: ACCIDENTS_JSON.accidents,
        pickable: true,
        opacity: active && active.name === "fatalities" ? 1 : 0,
        stroked: true,
        filled: true,
        extruded: true,
        lineWidthMinPixels: 1,
        getPosition: d => {
          return [Number(d.longitude), Number(d.latitude)];
        },
        elevationScale: active && active.name === "fatalities" ? 2 : 0,
        coverage: 1,
        radius: 90,
        transitions: {
          elevationScale: 2400,
          coverage: 1200
          // opacity: 800
        },
        getFillColor: d => [32, 201, 151],
        onHover: info => {
          this.setState({
            hoveredObject: info.object,
            pointerX: info.x,
            pointerY: info.y
          });
        }
      }),
      new GeoJsonLayer({
        id: "communes-fill",
        data: COMMUNES_JSON,
        stroked: false,
        filled: true,
        opacity: 0,
        pickable: true,
        onClick: info => {
          const { bounds } = info.object.properties;
          if (bounds) this._flyTo(bounds);
        }
      }),
      new GeoJsonLayer({
        id: "communes-stroke",
        data: COMMUNES_JSON,
        stroked: true,
        filled: false,
        opacity: 0.05,
        lineWidthMinPixels: 2,
        getWidth: 2,
        getLineColor: [32, 201, 151]
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

  _addData = name => {
    const { layers } = this.state;
    const active = layers.map(layer => {
      if (layer.name === name) {
        layer.visible = true;
      } else {
        layer.visible = false;
      }
      return layer;
    });

    this.setState({ layers: active });

    // const state = this.state;
    // state.layers.hexagon.elevationScale = 1;
    // state.layers.hexagon.opacity = 1;
  };

  _renderTooltip() {
    const { hoveredObject, pointerX, pointerY } = this.state || {};
    return (
      hoveredObject && (
        <div
          className="panel"
          style={{
            position: "absolute",
            transform: "translateY(calc(-100% - 1rem))",
            zIndex: 10,
            pointerEvents: "none",
            left: pointerX + 5,
            top: pointerY + 5
          }}
        >
          <div className="panel-body p-2">
            {hoveredObject.points ? hoveredObject.points.length : null}
          </div>
        </div>
      )
    );
  }

  _onClickHandler = event => {
    console.log(event.type);
    const pickInfo = this.deckGL.pickObject({
      x: event.clientX,
      y: event.clientY,
      layerIds: ["communes-fill"]
    });

    const { bounds } = pickInfo.object.properties;
    // if (bounds) this._flyTo(bounds);
  };

  _renderButtonIcon(name) {
    switch (name) {
      case "accidents":
        return <AccidentsIcon />;
      case "fatalities":
        return <FatalitiesIcon />;
      case "response_time":
        return <ResponseTimeIcon />;
      case "not_responded":
        return <NotResponsedIcon />;
      default:
        return "";
    }
  }

  componentDidMount() {
    // this._addData();
  }

  render() {
    const {
      mapStyle = "mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz"
    } = this.props;
    const { viewState, time, day } = this.state;
    return (
      <div className="deck">
        <div onClick={this._onClickHandler}>
          <DeckGL
            viewState={viewState}
            layers={this._renderLayers()}
            controller={{ type: MapController, doubleClickZoom: false }}
            onViewStateChange={this._onViewStateChange}
            ref={deck => {
              this.deckGL = deck;
            }}
          >
            <StaticMap
              id="map"
              reuseMaps
              mapStyle={mapStyle}
              preventStyleDiffing={true}
              mapboxApiAccessToken={MAPBOX_TOKEN}
            />
          </DeckGL>
        </div>
        <header className="deck__header">
          <Header day={day} time={time} />
        </header>
        <div className="deck__main">
          <div className="deck__alerts d-flex flex-column justify-content-center">
            {this.state.layers.map(layer => (
              <div
                className="panel panel-button"
                onClick={() => this._addData(layer.name)}
              >
                <div className="panel-body panel-body--icon">
                  {this._renderButtonIcon(layer.name)}
                </div>
                <div className="panel-body panel-body--text">
                  <h4>{layer.label}</h4>
                </div>
              </div>
            ))}
          </div>
          <div className="deck__info">{/*<Info events={events} />*/}</div>
        </div>
        {this._renderTooltip()}
      </div>
    );
  }
}

export default Accidents;
