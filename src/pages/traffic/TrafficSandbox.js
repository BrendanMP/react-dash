import React, { Component } from "react";
import DeckGL, {
  MapController,
  TripsLayer,
  PathLayer,
  GeoJsonLayer,
  LineLayer,
  LinearInterpolator,
  ScatterplotLayer,
  HexagonLayer,
  FlyToInterpolator
} from "deck.gl";
import { StaticMap } from "react-map-gl";
import { format, addSeconds } from "date-fns";
import polyline from "google-polyline";
import { useSpring, animated } from "react-spring";

import TRIPS_JSON from "../../data/adbijan/trips.json";
import RangeSlider from "../../components/RangeSlider";
import COMMUNES_JSON from "../../data/adbijan/communes";
import convertDirections from "../../utilities/convertDirections";

const round = function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
};

const colorRange = [
  [220, 53, 69],
  [255, 193, 7],
  [32, 201, 151]
];

let TRIPS = convertDirections(TRIPS_JSON, true);

TRIPS.sort((a, b) => (a.speed > b.speed ? 1 : -1));

TRIPS = TRIPS.map((trip, i) => {
  const quarter = TRIPS.length / 4;
  trip.percentile = 1;
  if (i > quarter * 2) trip.percentile = 2;
  if (i > quarter * 3) trip.percentile = 3;
  return trip;
});

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYnJlbmRhbi10cmFuc2l0bGFicyIsImEiOiJjazI5aHptaWEwdzJzM25vMnB0aHhqcjNlIn0.oZFZBkbrnOrF80fkS3xNgQ";

const transitionInterpolator = new LinearInterpolator(["bearing"]);

function ActiveTrip(props) {
  return (
    <div className="panel mb-2" style={{ lineHeight: 1.2 }}>
      <div className="panel-body p-3 px-4">
        <div>
          <strong className="mr-2">Origin</strong>{" "}
          {props.trip.origin.substring(0, props.trip.origin.indexOf(","))}
        </div>
        <div>
          <strong className="mr-2">Destination</strong>{" "}
          {props.trip.destination.substring(
            0,
            props.trip.destination.indexOf(",")
          )}
        </div>
        <div>
          <strong className="mr-2">Avg Speed</strong> {props.trip.speed}kmph
        </div>
      </div>
    </div>
  );
}

class Traffic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: {
        latitude: 5.322635048060814,
        longitude: -4.013425118889425,
        zoom: 12,
        bearing: 0,
        pitch: 12 * 3.2
      },
      time: 39640,
      date: new Date("2019-10-10 0:00"),
      trips: TRIPS,
      active: []
    };
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._updateTime = this._updateTime.bind(this);
    this._rotateCamera = this._rotateCamera.bind(this);
    this._flyTo = this._flyTo.bind(this);
  }

  _renderLayers = () => {
    return [
      new TripsLayer({
        id: "trips-layer",
        data: TRIPS,
        opacity: 0.5,
        widthMinPixels: 3,
        rounded: false,
        miterLimit: 30,
        trailLength: 500,
        autoHighlight: true,
        currentTime: this.state.time,
        getPath: d => {
          return d.trip.map(p => {
            return [p.coordinates[1], p.coordinates[0]];
          });
        },
        getTimestamps: d =>
          d.trip.map(p => {
            return p.timestamp;
          }),
        getColor: d => {
          return colorRange[d.percentile - 1];
        },
        parameters: {
          depthTest: false
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
    viewState.pitch = viewState.zoom * 3.2;
    this.setState({ viewState });
  }

  _rotateCamera() {
    const bearing = this.state.viewState.bearing + 30;
    this.setState({
      viewState: {
        ...this.state.viewState,
        bearing,
        transitionDuration: 90000,
        transitionInterpolator
      }
    });
  }

  _updateTime(value) {
    const active = this.state.trips.filter(trip => {
      if (value > trip.start && value < trip.end) {
        return trip;
      }
    });
    this.setState({
      time: value,
      active: active
    });
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

  componentDidMount() {}

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
            <div className="panel-body mb-0 p-3">
              {format(addSeconds(date, time || 0), "h:mm a")}
            </div>
          </div>
        </div>
        <div
          style={{
            position: "fixed",
            top: "2rem",
            left: "2rem",
            width: "25vw"
          }}
        >
          <div className="panel">
            <div className="panel-body p-3">
              <strong className="mr-3">Active Trips</strong>{" "}
              {this.state.active.length}
            </div>
          </div>
        </div>
        {this.props.controller ? (
          <div
            style={{
              position: "fixed",
              bottom: "2rem",
              left: "2rem",
              width: "calc(100vw - 4rem)"
            }}
          >
            <RangeSlider
              speed={5}
              rangeChange={this._updateTime}
              time={this.state.time}
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default Traffic;
