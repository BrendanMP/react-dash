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
      layers: [
        { name: "accidents", active: false, label: "Accidents" },
        { name: "fatalities", active: false, label: "Fatalities" },
        { name: "response_time", active: false, label: "Response Time" },
        { name: "no_response", active: false, label: "Not Responded" }
      ],
      hoveredObject: {},
      elevationScale: 1,
      opacity: 0
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

  _renderLayers = () => {
    const active = this.state.active;
    return [
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
      }),
      new HexagonLayer({
        id: "hex-layer",
        colorRange,
        material,
        data: active ? ACCIDENTS_JSON[active.name] : [],
        pickable: true,
        opacity: this.state.opacity,
        stroked: true,
        filled: true,
        extruded: true,
        lineWidthMinPixels: 1,
        getPosition: d => {
          return [Number(d.lng), Number(d.lat)];
        },
        elevationScale: this.state.elevationScale,
        coverage: 1,
        radius: 100,
        transitionEasing: t =>
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        transitions: {
          elevationScale: 600,
          opacity: 900
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
    const active = this.state.layers.find(layer => layer.name === name);
    this.setState({ elevationScale: 0, opacity: 0 });
    setTimeout(() => {
      this.setState({ active, elevationScale: 1, opacity: 1 });
    }, 600);
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
            top: pointerY + 5,
            minWidth: "16vw"
          }}
        >
          <div className="panel-body p-3 flex-grow-1">
            <h5 className="mb-3">Incident Area Details</h5>
            <div className="row">
              <div className="col mb-3">
                <h6>Accidents</h6>
                {hoveredObject.points
                  ? hoveredObject.points.reduce((prev, next) => {
                      return Number(prev) + Number(next.accidents);
                    }, 0)
                  : null}
              </div>
              <div className="col mb-3">
                <h6>Fatalities</h6>
                {hoveredObject.points
                  ? hoveredObject.points.reduce(
                      (prev, next) => Number(prev) + Number(next.fatalities),
                      0
                    )
                  : null}
              </div>
            </div>
            <div className="row">
              <div className="col mb-3">
                <h6>Cars Damaged</h6>
                {hoveredObject.points
                  ? hoveredObject.points.reduce((prev, next) => {
                      return Number(prev) + Number(next.cars_damaged);
                    }, 0)
                  : null}
              </div>
              <div className="col mb-3">
                <h6>Cars Totalled</h6>
                {hoveredObject.points
                  ? hoveredObject.points.reduce((prev, next) => {
                      return Number(prev) + Number(next.cars_totalled);
                    }, 0)
                  : null}
              </div>
            </div>

            <div className="row">
              <div className="col mb-3">
                <h6>Response Time</h6>
                16min
              </div>
              <div className="col mb-3">
                <h6>Clearing Time</h6>
                15min
              </div>
            </div>
            <div className="row">
              <div className="col">
                <h6>Non Response</h6>
                {hoveredObject.points
                  ? hoveredObject.points.reduce((prev, next) => {
                      return Number(prev) + Number(next.no_response);
                    }, 0)
                  : null}
              </div>
              <div className="col">
                <h6 style={{ whiteSpace: "no-wrap" }}>Responsible Officer</h6>
                N/A
              </div>
            </div>
          </div>
        </div>
      )
    );
  }

  _onClickHandler = event => {
    const pickInfo = this.deckGL.pickObject({
      x: event.clientX,
      y: event.clientY,
      layerIds: ["communes-fill"]
    });
    const { bounds } = pickInfo.object.properties;
  };

  _renderButtonIcon(name) {
    switch (name) {
      case "accidents":
        return <AccidentsIcon />;
      case "fatalities":
        return <FatalitiesIcon />;
      case "response_time":
        return <ResponseTimeIcon />;
      case "no_response":
        return <NotResponsedIcon />;
      default:
        return "";
    }
  }

  render() {
    const {
      mapStyle = "mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz"
    } = this.props;
    const { viewState, time, day } = this.state;
    return (
      <div className="deck">
        <div>
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
          <div className="deck__alerts d-flex flex-column justify-content-center pb-5">
            {this.state.layers.map((layer, i) => (
              <div
                className={`panel panel-button ${
                  this.state.active && layer.name === this.state.active.name
                    ? "active"
                    : ""
                }`}
                onClick={() => this._addData(layer.name)}
                key={i}
              >
                <div className="panel-body panel-body--icon pr-1">
                  {this._renderButtonIcon(layer.name)}
                </div>
                <div className="panel-body panel-body--text">
                  <h4 className="text-uppercase mb-0">{layer.label}</h4>
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
