import React, {Component} from 'react';
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
} from 'deck.gl'
import {StaticMap} from 'react-map-gl';
import {format, addSeconds} from 'date-fns'
import polyline from 'google-polyline';
import {PhongMaterial} from '@luma.gl/core';
import socketIOClient from "socket.io-client";
import Typed from "react-typed";
import {useSpring, animated} from 'react-spring'

import TRIPS_JSON from '../../data/adbijan/trips.json';
import RangeSlider from '../../components/RangeSlider';
import COMMUNES_JSON from "../../data/adbijan/communes";

function distanceBetween(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 === lat2) && (lon1 === lon2)) {
    return 0;
  } else {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
      dist = dist * 1.609344
    }
    if (unit === "N") {
      dist = dist * 0.8684
    }
    return dist;
  }
}

function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function Line(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;

  this.distanceToPoint = function (point) {
    // slope
    var m = (this.p2[0] - this.p1[0]) / (this.p2[1] - this.p1[1]),
      // y offset
      b = this.p1[0] - (m * this.p1[1]),
      d = [];
    // distance to the linear equation
    d.push(Math.abs(point[0] - (m * point[1]) - b) / Math.sqrt(Math.pow(m, 2) + 1));
    // distance to p1
    d.push(Math.sqrt(Math.pow((point[1] - this.p1[1]), 2) + Math.pow((point[0] - this.p1[0]), 2)));
    // distance to p2
    d.push(Math.sqrt(Math.pow((point[1] - this.p2[1]), 2) + Math.pow((point[0] - this.p2[0]), 2)));
    // return the smallest distance
    return d.sort(function (a, b) {
      return (a - b); //causes an array to be sorted numerically and ascending
    })[0];
  };
};

var simplify = function (points, tolerance) {
  var douglasPeucker = function (points, tolerance) {
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
      returnPoints = returnPoints.concat(douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance));
      // returnPoints.push( points[maxDistanceIndex] );
      returnPoints = returnPoints.concat(douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance));
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

const transitionInterpolator = new LinearInterpolator(['bearing']);

const colorRange = [
  [220, 53, 69],
  [255, 193, 7],
  [32, 201, 151],
];

let TRIPS = TRIPS_JSON.map((item) => {
  const TRIP = item.routes[0].legs[0];
  const TRIP_DISTANCE = TRIP.distance.value;
  const TRIP_DURATION = TRIP.duration.value;

  const OFFSET = item.start_time;
  const START_TIME = 1577836800 - OFFSET;
  let total = START_TIME;
  let duration = 0;
  let trip = []
  const STEPS = TRIP.steps.map(step => {
    const step_distance = step.distance.value;
    const step_duration = step.duration.value;
    const line = polyline.decode(step.polyline.points);
    const line_simplified = simplify(line, 0.00001);
    const points = [];
    line_simplified.forEach((point, i) => {
      if (line_simplified[i + 1]) {
        const next_point = line_simplified[i + 1];
        const distance_between = distanceBetween(point[0], point[1], next_point[0], next_point[1], 'K') * 1000;
        const percent = distance_between / step_distance;
        duration = round(percent * step_duration, 0);
      }
      const timestamp = total;
      total = duration + total;

      if (line_simplified[i - 1] && line_simplified[i - 1].timestamp !== timestamp) {
        trip.push({
          coordinates: point,
          timestamp
        })
      }
    });
  });
  return {
    trip,
    start: START_TIME,
    end: START_TIME + TRIP_DURATION,
    origin: TRIP.start_address,
    destination: TRIP.end_address,
    speed: round((TRIP_DISTANCE / TRIP_DURATION) * 3.6, 0)
  }
})

TRIPS.sort((a, b) => (a.speed > b.speed) ? 1 : -1);

TRIPS = TRIPS.map((trip, i) => {
  const third = TRIPS.length/3;
  trip.percentile = 1
  if (i > third ) trip.percentile = 2
  if (i > third * 2 ) trip.percentile = 3
  return trip
})

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiYnJlbmRhbi10cmFuc2l0bGFicyIsImEiOiJjazI5aHptaWEwdzJzM25vMnB0aHhqcjNlIn0.oZFZBkbrnOrF80fkS3xNgQ';

function ActiveTrip(props) {
  const fade = useSpring({opacity: 1, transform: 'translate(0,0)', from: {opacity: 0, transform: 'translate(-100%,0)'}})
  return (
    <animated.div style={fade}>
      <div className='panel mb-2' style={{lineHeight: 1.2}}>
        <div className="panel-body p-3 px-4">
          <div><strong className='mr-2'>Origin</strong> {props.trip.origin.substring(0, props.trip.origin.indexOf(','))}</div>
          <div><strong
            className='mr-2'>Destination</strong> {props.trip.destination.substring(0, props.trip.destination.indexOf(','))}</div>
          <div><strong className='mr-2'>Avg Speed</strong> {props.trip.speed}kmph</div>
        </div>
      </div>
    </animated.div>
  )
}

class Traffic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewState: {
        latitude: 5.322635048060814,
        longitude: -4.013425118889425,
        zoom: 12,
        bearing: 0,
        pitch: 12 * 3,
      },
      time: 39640,
      date: new Date('2019-10-10 0:00'),
      trips: TRIPS,
      active: []
    }
    this._onViewStateChange = this._onViewStateChange.bind(this)
    this._updateTime = this._updateTime.bind(this)
    this._rotateCamera = this._rotateCamera.bind(this)
    this._flyTo = this._flyTo.bind(this);
  }

  _renderLayers = () => {
    return [
      new TripsLayer({
        id: 'trips-layer',
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
            return [p.coordinates[1], p.coordinates[0]]
          })
        },
        getTimestamps: d => d.trip.map(p => {
          return p.timestamp
        }),
        getColor: d => {
          return colorRange[d.percentile - 1]
        },
        parameters: {
          depthTest: false
        }
      }),
      new GeoJsonLayer({
        id: 'communes-fill',
        data: COMMUNES_JSON,
        stroked: false,
        filled: true,
        opacity: 0,
        pickable: true,
        onClick: (info) => {
          const {bounds} = info.object.properties;
          if (bounds) this._flyTo(bounds);
        }
      }),
      new GeoJsonLayer({
        id: 'communes-stroke',
        data: COMMUNES_JSON,
        stroked: true,
        filled: false,
        opacity: 0.05,
        lineWidthMinPixels: 2,
        getWidth: 2,
        getLineColor: [32, 201, 151],
      }),
    ]
  }

  _onViewStateChange({viewState}) {
    const viewstate = viewState;
    viewState.pitch = viewState.zoom * 3;
    this.setState({viewState});
  }

  _rotateCamera() {
    const bearing = this.state.viewState.bearing + 30;
    this.setState({
      viewState: {
        ...this.state.viewState,
        bearing,
        transitionDuration: 90000,
        transitionInterpolator,
        onTransitionEnd: this._rotateCamera,
      },
    });
  }

  _updateTime(value) {
    // const active = this.state.trips.filter((trip) => {
    //   if (
    //     value > trip.start &&
    //     value < trip.end
    //   ) {
    //     return trip
    //   }
    // })

    this.setState({
      time: value,
      active: []
    })
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
        transitionInterpolator: new FlyToInterpolator({curve: 5}),
        transitionEasing: (t) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        onTransitionEnd: this._rotateCamera
      }
    });
  }

  componentDidMount() {
  }

  render() {
    const {mapStyle = 'mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz'} = this.props;
    const {viewState, time, date} = this.state;
    return (
      <div>
        <DeckGL
          viewState={viewState}
          layers={this._renderLayers()}
          controller={{type: MapController, doubleClickZoom: false}}
          onViewStateChange={this._onViewStateChange}
        >
          <StaticMap
            id='map'
            reuseMaps
            mapStyle={mapStyle}
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        </DeckGL>
        <div style={{position: 'fixed', top: '2rem', right: '2rem', width: '20vw'}}>
          <div className="panel">
            <div className="panel-body lead mb-0">{format(addSeconds(date, time || 0), 'h:mm a')}</div>
          </div>
        </div>
        <div style={{position: 'fixed', top: '2rem', left: '2rem', width: '25vw'}}>
          {this.state.active.map((trip, i) => (
            <ActiveTrip trip={trip} index={i} key={i}/>
          ))}
        </div>
        {
          this.props.controller ?
            <div style={{position: 'fixed', bottom: '2rem', left: '2rem', width: 'calc(100vw - 4rem)'}}>
              <RangeSlider speed={2} rangeChange={this._updateTime} time={this.state.time}/>
            </div>
            :
            <div></div>
        }
      </div>
    )
  }
}

export default Traffic