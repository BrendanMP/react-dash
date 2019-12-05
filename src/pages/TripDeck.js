import React, { Component } from "react";
import DeckGL, {
  MapController,
  TripsLayer,
  PathLayer,
  GeoJsonLayer,
  LineLayer,
  LinearInterpolator,
  ScatterplotLayer,
  HexagonLayer
} from "deck.gl";
import { StaticMap } from "react-map-gl";
import InputRange from "react-input-range";
import polyline from "google-polyline";
// import simplify from 'simplify-js';
import { PhongMaterial } from "@luma.gl/core";

import TRIPS_JSON from "../data/adbijan/trips.json";

import ROADWORK_JSON from "../data/adbijan/reseau_noeud";
import ROADWORK_PATH_JSON from "../data/adbijan/reseau_arc";

import RangeSlider from "../components/RangeSlider";
import COMMUNES_JSON from "../data/adbijan/communes";
import DOTS_JSON from "../data/adbijan/dots";

function distanceBetween(lat1, lon1, lat2, lon2, unit) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
      dist = dist * 1.609344;
    }
    if (unit === "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}

function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

var Line = function(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;

  this.distanceToPoint = function(point) {
    // slope
    var m = (this.p2[0] - this.p1[0]) / (this.p2[1] - this.p1[1]),
      // y offset
      b = this.p1[0] - m * this.p1[1],
      d = [];
    // distance to the linear equation
    d.push(
      Math.abs(point[0] - m * point[1] - b) / Math.sqrt(Math.pow(m, 2) + 1)
    );
    // distance to p1
    d.push(
      Math.sqrt(
        Math.pow(point[1] - this.p1[1], 2) + Math.pow(point[0] - this.p1[0], 2)
      )
    );
    // distance to p2
    d.push(
      Math.sqrt(
        Math.pow(point[1] - this.p2[1], 2) + Math.pow(point[0] - this.p2[0], 2)
      )
    );
    // return the smallest distance
    return d.sort(function(a, b) {
      return a - b; //causes an array to be sorted numerically and ascending
    })[0];
  };
};

var simplify = function(points, tolerance) {
  var douglasPeucker = function(points, tolerance) {
    if (points.length <= 2) {
      return [points[0]];
    }
    var returnPoints = [],
      // make line from start to end
      line = new Line(points[0], points[points.length - 1]),
      // find the largest distance from intermediate poitns to this line
      maxDistance = 0,
      maxDistanceIndex = 0,
      p;
    for (var i = 1; i <= points.length - 2; i++) {
      var distance = line.distanceToPoint(points[i]);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxDistanceIndex = i;
      }
    }
    // check if the max distance is greater than our tollerance allows
    if (maxDistance >= tolerance) {
      p = points[maxDistanceIndex];
      line.distanceToPoint(p, true);
      // include this point in the output
      returnPoints = returnPoints.concat(
        douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance)
      );
      // returnPoints.push( points[maxDistanceIndex] );
      returnPoints = returnPoints.concat(
        douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance)
      );
    } else {
      // ditching this point
      p = points[maxDistanceIndex];
      line.distanceToPoint(p, true);
      returnPoints = [points[0]];
    }
    return returnPoints;
  };
  var result = douglasPeucker(points, tolerance);
  // always have to push the very last point on so it doesn't get left off
  result.push(points[points.length - 1]);
  return result;
};

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

const TRIPS = TRIPS_JSON.map(item => {
  const TRIP = item.routes[0].legs[0];
  const TRIP_DISTANCE = TRIP.distance.value;
  const TRIP_DURATION = TRIP.duration.value;

  const OFFSET = item.start_time;
  const START_TIME = 1577836800 - OFFSET;
  let total = START_TIME;
  let duration = 0;
  let TRIP_ARRAY = [];
  const STEPS = TRIP.steps.map(step => {
    const step_distance = step.distance.value;
    const step_duration = step.duration.value;
    const line = polyline.decode(step.polyline.points);
    const line_simplified = simplify(line, 0.00001);
    const points = [];
    line_simplified.forEach((point, i) => {
      if (line_simplified[i + 1]) {
        const next_point = line_simplified[i + 1];
        const distance_between =
          distanceBetween(
            point[0],
            point[1],
            next_point[0],
            next_point[1],
            "K"
          ) * 1000;
        const percent = distance_between / step_distance;
        duration = round(percent * step_duration, 0);
      }
      const timestamp = total;
      total = duration + total;

      if (
        line_simplified[i - 1] &&
        line_simplified[i - 1].timestamp !== timestamp
      ) {
        TRIP_ARRAY.push({
          coordinates: point,
          timestamp
        });
      }
    });
  });
  return {
    trip: TRIP_ARRAY
  };
});

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYnJlbmRhbi10cmFuc2l0bGFicyIsImEiOiJjazI5aHptaWEwdzJzM25vMnB0aHhqcjNlIn0.oZFZBkbrnOrF80fkS3xNgQ";

class TripDeck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: {
        latitude: 5.322635048060814,
        longitude: -4.013425118889425,
        zoom: 12,
        bearing: 0,
        pitch: 12 * 3
      },
      time: 10000
    };
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._updateTime = this._updateTime.bind(this);
    this._rotateCamera = this._rotateCamera.bind(this);
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
        trailLength: 100,
        autoHighlight: true,
        currentTime: this.state.time,
        widthUnits: "meters",
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
          return colorRange[Math.floor(Math.random() * colorRange.length)];
        }
      })
    ];
  };

  _onViewStateChange({ viewState }) {
    const viewstate = viewState;
    viewState.pitch = viewState.zoom * 3;
    this.setState({ viewState });
  }

  _animate() {
    if (this.state.time < 86400) {
      this._updateTime(this.state.time + 0.0005);
    } else {
      this._updateTime(0);
    }
    this._animationFrame = window.requestAnimationFrame(
      this._animate.bind(this)
    );
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

  _updateTime(value) {
    this.setState({ time: value });
  }

  componentDidMount() {
    setTimeout(() => {
      this._rotateCamera();
    }, 200);
  }

  render() {
    const {
      mapStyle = "mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz"
    } = this.props;
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
            mapStyle={mapStyle}
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        </DeckGL>
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "2rem",
            width: "calc(100vw - 4rem)"
          }}
        >
          <RangeSlider rangeChange={this._updateTime} />
        </div>
      </div>
    );
  }
}

export default TripDeck;
