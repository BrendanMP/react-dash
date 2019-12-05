import React, { Component } from "react";
import uuid from "uuid";
import DeckGL from "@deck.gl/react";
import {
  MapController,
  TripsLayer,
  ScatterplotLayer,
  FlyToInterpolator,
  LinearInterpolator
} from "deck.gl";
import convertDirections from "../../utilities/convertDirections";
import { StaticMap, Marker } from "react-map-gl";
import { DataFilterExtension } from "@deck.gl/extensions";

import Layout from "../../components/Layout";
import Dashboard from "../../components/Dashboard";

import INCIDENT_JSON from "../../data/adbijan/incidents_points.json";
import INCIDENT_TRAFFIC_JSON from "../../data/adbijan/incidents_traffic.json";
import INCIDENT_RESPONSE_JSON from "../../data/adbijan/incidents_responders";
import ACCIDENTS_STAT_JSON from "../../data/adbijan/accident_stats";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import polyline from "google-polyline";

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [254, 120, 78]
];

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYnJlbmRhbi10cmFuc2l0bGFicyIsImEiOiJjazI5aHptaWEwdzJzM25vMnB0aHhqcjNlIn0.oZFZBkbrnOrF80fkS3xNgQ";

const MAP_STYLE =
  "mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz";

const INITIAL_VIEWSTATE = {
  latitude: 5.322635048060814,
  longitude: -4.013425118889425,
  zoom: 13,
  bearing: 0,
  pitch: 13 * 3,
  pitch_modifer: 3
};

const transitionInterpolator = new LinearInterpolator(["bearing"]);

const RESPONDERS = convertDirections(INCIDENT_RESPONSE_JSON);
const TRAFFIC = convertDirections(INCIDENT_TRAFFIC_JSON);

const DAY = new Date("1-1-2020");

const INCIDENT_POINTS = INCIDENT_JSON.incidents;

class Incidents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: INITIAL_VIEWSTATE,
      time: 31500,
      timeline: {
        isPlaying: false,
        range: {
          min: 0,
          max: 86400
        }
      },
      events: [],
      views: [
        {
          name: "map",
          label: "Map",
          active: true,
          submenuCollapsible: true,
          controls: ["rotate", "reset"]
        }
      ],
      submenu: []
    };
    this._updateTime = this._updateTime.bind(this);
    this._clickedSubMenu = this._clickedSubMenu.bind(this);

    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._renderLayers = this._renderLayers.bind(this);
    this._flyToIncident = this._flyToIncident.bind(this);
    this._zoomOut = this._zoomOut.bind(this);
    this._flyTo = this._flyTo.bind(this);
    this._rotateCamera = this._rotateCamera.bind(this);
  }

  _clickedSubMenu(name, view) {
    const { views, submenu } = this.state;
    const active = submenu.find(view => view.active === true);

    submenu.map(item => {
      item.name === name ? (item.active = true) : (item.active = false);
      return item;
    });

    this.setState({ submenu });
  }

  _clickedControl(val) {
    console.log("clicked", val);
  }

  _renderLayers = () => [
    new TripsLayer({
      id: "incident-traffic",
      data: TRAFFIC,
      opacity: 0.05,
      widthMinPixels: 5,
      rounded: true,
      trailLength: 500,
      autoHighlight: true,
      currentTime: this.state.time,
      widthUnits: "meters",
      pickable: true,
      highlightColor: [...colorRange[5], 1],
      getPath: d => d.trip.map(p => [p.coordinates[1], p.coordinates[0]]),
      getTimestamps: d => d.trip.map(p => p.timestamp),
      getColor: d => colorRange[5],
      onHover: info => {
        this.setState({
          hoveredObject: info.object,
          pointerX: info.x,
          pointerY: info.y
        });
      },
      transitions: {
        opacity: 1200,
        trailLength: 10000
      },
      parameters: {
        depthTest: false
      }
    }),
    new TripsLayer({
      id: "incident-reponse",
      data: RESPONDERS,
      opacity: 1,
      widthMinPixels: 5,
      rounded: true,
      trailLength: 300,
      autoHighlight: true,
      currentTime: this.state.time,
      widthUnits: "meters",
      getPath: d => d.trip.map(p => [p.coordinates[1], p.coordinates[0]]),
      getTimestamps: d => d.trip.map(p => p.timestamp),
      getColor: d => colorRange[1],
      parameters: {
        depthTest: false
      }
    }),
    new ScatterplotLayer({
      id: "incidents",
      data: this.state.events.map((event, i) => {
        return {
          ...event.properties,
          coordinates: this.state.events[i].geometry.coordinates
        };
      }),
      opacity: 1,
      pickable: true,
      getRadius: d => 50,
      radiusMinPixels: 15,
      radiusMaxPixels: 20,
      getPosition: d => d.coordinates,
      getFillColor: d => {
        if (d.status === "detected") return [220, 53, 69];
        if (d.status === "en_route") return [253, 126, 20];
        if (d.status === "responding") return [255, 193, 7];
        if (d.status === "clearing") return [32, 201, 151];
      },
      onHover: info => {
        return this.setState({
          hoveredObject: info.object,
          pointerX: info.x,
          pointerY: info.y
        });
      },
      getFilterValue: d => {
        return [d.start_timestamp, d.end_timestamp];
      },
      filterRange: [
        [-1, this.state.time],
        [this.state.time, 86400]
      ],
      filterSoftRange: [
        [-1, this.state.time - 5],
        [this.state.time + 5, 86400]
      ],
      extensions: [new DataFilterExtension({ filterSize: 2 })]
    })
  ];

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
          <div className="panel-body p-2">{hoveredObject.destination}</div>
        </div>
      )
    );
  }

  _renderPopup() {}

  _onViewStateChange({ viewState }) {
    const { focussed } = this.state;
    viewState.pitch = viewState.zoom * 3;
    this.setState({
      viewState,
      focussed: viewState.zoom >= INITIAL_VIEWSTATE.zoom ? focussed : null
    });
  }

  _updateTime(value) {
    const active = INCIDENT_POINTS.filter(incident => {
      if (
        value > incident.properties.start_timestamp &&
        value < incident.properties.end_timestamp
      ) {
        if (
          incident.properties.start_timestamp === this.state.time &&
          incident.properties.status === "detected"
        ) {
          this._flyToIncident(incident);
          this.setState({ focussed: incident });
        }
        return incident;
      }
    });
    this.setState({
      time: value,
      events: active
    });
  }

  _rotateCamera() {
    const bearing = this.state.viewState.bearing + 120;
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

  _flyTo(bounds, zoomOut) {
    this.setState({
      viewState: {
        ...this.state.viewState,
        longitude: bounds.longitude || this.state.viewState.longitude,
        latitude: bounds.latitude || this.state.viewState.latitude,
        zoom: bounds.zoom || this.state.viewState.zoom,
        pitch: bounds.pitch || this.state.viewState.pitch,
        bearing: 0,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator({ curve: 5 }),
        transitionEasing: t =>
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        onTransitionEnd: this._rotateCamera
      }
    });
  }

  _flyToIncident(incident) {
    this.setState({ focussed: incident });
    const bounds = {
      latitude: incident.geometry.coordinates[1],
      longitude: incident.geometry.coordinates[0],
      zoom: 15
    };
    this._flyTo(bounds, true);
  }

  _zoomOut() {
    this.setState({
      viewState: {
        ...this.state.viewState,
        zoom: this.state.viewState.zoom - 1,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator({ curve: 5 }),
        transitionEasing: t =>
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
      }
    });
  }

  _resetCamera() {
    this.setState({
      viewState: {
        ...this.state.viewState,
        longitude:
          INITIAL_VIEWSTATE.longitude || this.state.viewState.longitude,
        latitude: INITIAL_VIEWSTATE.latitude || this.state.viewState.latitude,
        zoom: INITIAL_VIEWSTATE.zoom || this.state.viewState.zoom,
        pitch: INITIAL_VIEWSTATE.pitch || this.state.viewState.pitch,
        bearing: 0,
        transitionDuration: 800,
        transitionInterpolator: new FlyToInterpolator({ curve: 5 }),
        transitionEasing: t =>
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
      }
    });
  }

  _toggleTraffic() {
    if (this.state.traffic.trailLength) {
      this.setState({
        traffic: {
          opacity: 0.2,
          trailLength: 0
        }
      });
    } else {
      this.setState({
        traffic: {
          opacity: 0.2,
          trailLength: 5000
        }
      });
    }
  }

  componentDidMount() {
    this._updateTime(this.state.time);
    setTimeout(() => {
      this._rotateCamera();
    }, 200);
  }

  render() {
    const { views, viewState, submenu, events, time } = this.state;
    const active = views.find(view => view.active === true);
    return (
      <Layout
        views={views}
        submenu={submenu}
        time={time}
        day={DAY}
        timeline={true}
        controls={active.controls}
        changeView={this._changeView}
        clickedSubMenu={this._clickedSubMenu}
        clickedControl={this._clickedControl}
        updateTime={this._updateTime}
      >
        {views.map((view, i) => (
          <div
            key={i}
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
                    mapStyle={MAP_STYLE}
                    preventStyleDiffing={true}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                  >
                    <TransitionGroup className="markers">
                      {events.map((event, i) => (
                        <CSSTransition
                          key={i}
                          timeout={500}
                          classNames="marker"
                        >
                          <Marker
                            key={i}
                            longitude={event.geometry.coordinates[0]}
                            latitude={event.geometry.coordinates[1]}
                            offsetLeft={30}
                            offsetTop={0}
                          >
                            {event.properties.status ? (
                              <div
                                className={`marker marker--${event.properties.status}`}
                              >
                                {event.properties.status}
                              </div>
                            ) : null}
                          </Marker>
                        </CSSTransition>
                      ))}
                    </TransitionGroup>
                  </StaticMap>
                </DeckGL>
                {this._renderTooltip()}
              </div>
            ) : null}
            {view.name === "dashboard" ? (
              <Dashboard data={view.data} views={submenu}></Dashboard>
            ) : null}
          </div>
        ))}
      </Layout>
    );
  }
}

export default Incidents;
