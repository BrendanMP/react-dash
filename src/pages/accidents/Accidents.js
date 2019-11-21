import React, { Component } from "react";
import Layout from "../../components/Layout";
import { StaticMap } from "react-map-gl";

import DeckGL, {
  MapController,
  GeoJsonLayer,
  HexagonLayer,
  FlyToInterpolator,
  LinearInterpolator
} from "deck.gl";
import { PhongMaterial } from "@luma.gl/core";

import COMMUNES_JSON from "../../data/adbijan/communes";
import ACCIDENTS_JSON from "../../data/adbijan/accidents";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYnJlbmRhbi10cmFuc2l0bGFicyIsImEiOiJjazI5aHptaWEwdzJzM25vMnB0aHhqcjNlIn0.oZFZBkbrnOrF80fkS3xNgQ";

const MAPBOX_STYLE =
  "mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz";

const INITIAL_VIEWSTATE = {
  latitude: 5.322635048060814,
  longitude: -4.013425118889425,
  zoom: 13,
  bearing: 0,
  pitch: 13 * 3,
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

const DAY = new Date("1-1-2020");

class Accidents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      views: [
        {
          name: "map",
          label: "Map",
          active: false,
          submenuCollapsible: true,
          controls: ["rotate", "reset"],
          submenu: [
            {
              name: "accidents",
              label: "Accidents",
              active: true
            },
            {
              name: "fatalities",
              label: "Fatalities"
            },
            {
              name: "response_time",
              label: "Response Time"
            },
            {
              name: "no_response",
              label: "No Response"
            }
          ]
        },
        {
          name: "dashboard",
          label: "Dashboard",
          active: true,
          submenuCollapsible: false,
          controls: [],
          submenu: [
            {
              name: "overall",
              label: "Overall",
              active: true,
              data: [
                {
                  name: "Overvall"
                }
              ]
            },
            {
              name: "aggregate",
              label: "Aggregate",
              data: []
            },
            {
              name: "change",
              label: "Change",
              data: []
            }
          ]
        }
      ],
      viewState: {
        latitude: INITIAL_VIEWSTATE.latitude,
        longitude: INITIAL_VIEWSTATE.longitude,
        zoom: INITIAL_VIEWSTATE.zoom,
        bearing: 0,
        pitch: INITIAL_VIEWSTATE.zoom * INITIAL_VIEWSTATE.pitch_modifer
      },
      opactiy: 0,
      elevationScale: 0,
      activeLayer: ACCIDENTS_JSON.accidents
    };
    this._changeView = this._changeView.bind(this);
    this._renderLayers = this._renderLayers.bind(this);
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._rotateCamera = this._rotateCamera.bind(this);
    this._resetCamera = this._resetCamera.bind(this);
    this._flyTo = this._flyTo.bind(this);
    this._renderTooltip = this._renderTooltip.bind(this);
    this._clickedSubMenu = this._clickedSubMenu.bind(this);
    this._clickedDataTrigger = this._clickedDataTrigger.bind(this);
  }

  _clickedDataTrigger = name => {
    this.setState({ elevationScale: 0, opacity: 0 });
    setTimeout(() => {
      this.setState({
        activeLayer: ACCIDENTS_JSON[name || "accidents"],
        elevationScale: 1,
        opacity: 1
      });
    }, 800);
  };

  _onViewStateChange({ viewState }) {
    const viewstate = viewState;
    viewState.pitch = viewState.zoom * 3;
    this.setState({ viewState });
  }

  _changeView(name) {
    const { views } = this.state;
    const active = views.find(view => view.name === name);
    views.map(view => {
      view === active ? (view.active = true) : (view.active = false);
      return view;
    });
    this.setState({ views });
  }

  _clickedSubMenu(name, view) {
    const { views } = this.state;
    const active = views.find(view => view.active === true);
    active.submenu.map(item => {
      item.name === name ? (item.active = true) : (item.active = false);
      return item;
    });
    this.setState({ views });

    if (view === "map") {
      this._clickedDataTrigger(name);
    }
  }

  _resetCamera() {
    this.setState({
      viewState: {
        latitude: INITIAL_VIEWSTATE.latitude,
        longitude: INITIAL_VIEWSTATE.longitude,
        zoom: INITIAL_VIEWSTATE.zoom,
        bearing: 0,
        pitch: INITIAL_VIEWSTATE.zoom * INITIAL_VIEWSTATE.pitch_modifer,
        transitionDuration: 800,
        transitionInterpolator: new FlyToInterpolator({ curve: 5 }),
        transitionEasing: t =>
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
      }
    });
  }

  _rotateCamera() {
    const bearing = this.state.viewState.bearing + 90;
    this.setState({
      isRotating: false,
      viewState: {
        ...this.state.viewState,
        bearing,
        transitionDuration: 90000,
        transitionInterpolator,
        onTransitionEnd: this._rotateCamera
      }
    });
  }

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
      }
    });
  }

  _renderLayers = () => {
    const { activeData } = this.state;
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
        data: this.state.activeLayer,
        pickable: true,
        opacity: 1,
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
        transitionEasing: "linear",
        transitions: {
          elevationScale: 600,
          colorRange: 600
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

  render() {
    const { views, viewState } = this.state;
    const active = views.find(view => view.active === true);
    return (
      <Layout
        views={views}
        time={0}
        day={DAY}
        controls={active.controls}
        changeView={this._changeView}
        clickedSubMenu={this._clickedSubMenu}
      >
        {views.map(view => (
          <div
            className={`page__content-view ${
              active.name === view.name ? "active" : ""
            }`}
          >
            {view.name === "map" ? (
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
                {this._renderTooltip()}
              </div>
            ) : null}
            {view.name === "dashboard" ? <div></div> : null}
          </div>
        ))}
      </Layout>
    );
  }
}

export default Accidents;
