import React, { Component } from "react";
import DeckGL from "@deck.gl/react";
import {
  MapController,
  TripsLayer,
  ScatterplotLayer,
  FlyToInterpolator,
  LinearInterpolator
} from "deck.gl";
import { StaticMap, Marker } from "react-map-gl";
import { DataFilterExtension } from "@deck.gl/extensions";
import { CSSTransition, TransitionGroup } from "react-transition-group";

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

const transitionInterpolator = new LinearInterpolator(["bearing"]);

const INITIAL_VIEWSTATE = {
  latitude: 5.322635048060814,
  longitude: -4.013425118889425,
  zoom: 13,
  bearing: 0,
  pitch: 13 * 3,
  pitch_modifer: 3
};

class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: INITIAL_VIEWSTATE,
      layers: props.layers,
      trailLength: 5000
    };

    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._renderLayers = this._renderLayers.bind(this);
    this._flyToIncident = this._flyToIncident.bind(this);
    this._zoomOut = this._zoomOut.bind(this);
    this._flyTo = this._flyTo.bind(this);
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
        onTransitionEnd: () => {
          if (zoomOut) {
            setTimeout(() => this._zoomOut(), 1200);
          }
        }
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

  _onViewStateChange({ viewState }) {
    viewState.pitch = viewState.zoom * 3;
    this.setState({
      viewState
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
            top: pointerY + 5
          }}
        >
          <div className="panel-body p-2">{hoveredObject.destination}</div>
        </div>
      )
    );
  }

  _renderLayers = () => [
    this.props.traffic
      ? new TripsLayer({
          id: "incident-traffic",
          data: this.props.traffic,
          opacity: 0.05,
          widthMinPixels: 5,
          rounded: true,
          trailLength: this.state.trailLength,
          autoHighlight: true,
          currentTime: this.props.time,
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
        })
      : null,
    this.props.responders
      ? new TripsLayer({
          id: "incident-reponse",
          data: this.props.responders,
          opacity: 1,
          widthMinPixels: 5,
          rounded: true,
          trailLength: 100,
          autoHighlight: true,
          currentTime: this.props.time,
          widthUnits: "meters",
          getPath: d => d.trip.map(p => [p.coordinates[1], p.coordinates[0]]),
          getTimestamps: d => {
            return d.trip.map(p => p.timestamp);
          },
          getColor: d => colorRange[1],
          parameters: {
            depthTest: false
          }
        })
      : null,
    this.props.events
      ? new ScatterplotLayer({
          id: "incidents",
          data: this.props.events.map((event, i) => {
            return {
              ...event.active,
              coordinates: [
                this.props.events[i].longitude,
                this.props.events[i].latitude
              ]
            };
          }),
          opacity: 1,
          pickable: true,
          getRadius: d => 50,
          radiusMinPixels: 15,
          radiusMaxPixels: 20,
          getPosition: d => d.coordinates,
          getFillColor: d => {
            if (d.name === "detected") return [220, 53, 69];
            if (d.name === "en_route") return [253, 126, 20];
            if (d.name === "responding") return [255, 193, 7];
            if (d.name === "clearing") return [32, 201, 151];
          },
          getFilterValue: d => [d.start, d.end],
          onHover: info => {
            return this.setState({
              hoveredObject: info.object,
              pointerX: info.x,
              pointerY: info.y
            });
          },
          filterRange: [
            [-1, this.props.time],
            [this.props.time, 86400]
          ],
          filterSoftRange: [
            [-1, this.props.time - 5],
            [this.props.time + 5, 86400]
          ],
          extensions: [new DataFilterExtension({ filterSize: 2 })],
          parameters: {
            depthTest: false
          }
        })
      : null
  ];

  render() {
    const { viewState } = this.state;
    const { events } = this.props;
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
            mapStyle={MAP_STYLE}
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          >
            <TransitionGroup className="markers">
              {events.map((event, i) => (
                <CSSTransition key={i} timeout={500} classNames="marker">
                  <Marker
                    key={i}
                    longitude={event.longitude}
                    latitude={event.latitude}
                    offsetLeft={30}
                    offsetTop={0}
                  >
                    {event.active.label ? (
                      <div className={`marker marker--${event.active.name}`}>
                        {event.active.label}
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
    );
  }
}

export default Deck;
