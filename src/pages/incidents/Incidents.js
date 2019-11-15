import React, {Component} from 'react';
import DeckGL, {
  MapController,
  TripsLayer,
  ScatterplotLayer,
  FlyToInterpolator,
  LinearInterpolator,
  GeoJsonLayer,
  PathLayer
} from 'deck.gl'
import {StaticMap} from 'react-map-gl';
import {DataFilterExtension} from '@deck.gl/extensions';
import polyline from 'google-polyline';
import socketIOClient from 'socket.io-client';
import {addSeconds, format} from "date-fns";

import RangeSlider from '../../components/RangeSlider';
import Alerts from '../../components/deck/Alerts';

import INCIDENT_JSON from '../../data/adbijan/incidents_points.json';
import INCIDENT_TRIP_JSON from '../../data/adbijan/incidents_responders.json';
import INCIDENT_TRAFFIC_JSON from '../../data/adbijan/incidents_traffic.json';
import COMMUNES_JSON from "../../data/adbijan/communes";

const transitionInterpolator = new LinearInterpolator(['bearing']);

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

const Line = function (p1, p2) {
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

const simplify = function (points, tolerance) {
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

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [254, 120, 78]
];

const INCIDENT_POINTS = INCIDENT_JSON.incidents;

let TRIPS = INCIDENT_TRIP_JSON.map((item) => {
  const TRIP = item.routes[0].legs[0];
  const TRIP_DISTANCE = TRIP.distance.value;
  const TRIP_DURATION = TRIP.duration_in_traffic.value;

  const OFFSET = item.start_time;
  const START_TIME = OFFSET - 1577836800;
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

let TRAFFIC = INCIDENT_TRAFFIC_JSON.map((item) => {
  const TRIP = item.routes[0].legs[0];
  const TRIP_DISTANCE = TRIP.distance.value;
  const TRIP_DURATION = TRIP.duration_in_traffic.value;

  const OFFSET = item.start_time;
  const START_TIME = OFFSET - 1577836800;
  let total = START_TIME;
  let duration = 0;
  let trip = []
  const STEPS = TRIP.steps.map(step => {
    const step_distance = step.distance.value;
    const step_duration = step.duration.value + (step.duration.value * 5);
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

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiYnJlbmRhbi10cmFuc2l0bGFicyIsImEiOiJjazI5aHptaWEwdzJzM25vMnB0aHhqcjNlIn0.oZFZBkbrnOrF80fkS3xNgQ';

const INITIAL_VIEWSTATE = {
  latitude: 5.322635048060814,
  longitude: -4.013425118889425,
  zoom: 13,
  bearing: 0,
  pitch: 13 * 3,
}

class Incidents extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewState: INITIAL_VIEWSTATE,
      time: 31500,
      incidents: INCIDENT_JSON,
      active: [],
      focussed: null,
    }
    this._onViewStateChange = this._onViewStateChange.bind(this)
    this._updateTime = this._updateTime.bind(this)
    this._flyTo = this._flyTo.bind(this)
    this._flyToIncident = this._flyToIncident.bind(this)
    this._zoomOut = this._zoomOut.bind(this)
    this._resetCamera = this._resetCamera.bind(this)
    this._rotateCamera = this._rotateCamera.bind(this)
  }

  _renderLayers = () => [
    new TripsLayer({
      id: 'incident-traffic',
      data: TRAFFIC,
      opacity: 1,
      widthMinPixels: 5,
      rounded: true,
      trailLength: 5000,
      autoHighlight: true,
      currentTime: this.state.time,
      widthUnits: 'meters',
      getPath: d => d.trip.map(p => [p.coordinates[1], p.coordinates[0]]),
      getTimestamps: d => d.trip.map(p => p.timestamp),
      getColor: d => {
        return colorRange[5]
      },
      parameters: {
        depthTest: false
      }
    }),
    new TripsLayer({
      id: 'incident-reponse',
      data: TRIPS,
      opacity: 1,
      widthMinPixels: 5,
      rounded: true,
      trailLength: 100,
      autoHighlight: true,
      currentTime: this.state.time,
      widthUnits: 'meters',
      getPath: d => d.trip.map(p => [p.coordinates[1], p.coordinates[0]]),
      getTimestamps: d => d.trip.map(p => p.timestamp),
      getColor: d => {
        return colorRange[1]
      },
      parameters: {
        depthTest: false
      }
    }),
    new ScatterplotLayer({
      id: 'incidents',
      data: INCIDENT_POINTS,
      opacity: 1,
      getRadius: d => d.properties.severity * 2,
      getPosition: d => d.geometry.coordinates,
      getFillColor: d => {
        if (d.properties.status === 'detected') return [220, 53, 69];
        if (d.properties.status === 'responding') return [255, 193, 7];
        if (d.properties.status === 'clearing') return [32, 201, 151];
        return colorRange[2]
      },
      getFilterValue: d => {
        return [
          d.properties.start_timestamp,
          d.properties.end_timestamp
        ]
      },
      filterRange: [
        [0, this.state.time],
        [this.state.time, 86400]
      ],
      filterSoftRange: [
        [0, this.state.time - 50],
        [this.state.time + 50, 86400]
      ],
      extensions: [
        new DataFilterExtension({filterSize: 2})
      ],
      parameters: {
        depthTest: false
      }
    }),
  ]

  _onViewStateChange({viewState}) {
    const {focussed} = this.state;
    viewState.pitch = viewState.zoom * 3;
    this.setState({
      viewState,
      focussed: viewState.zoom >= INITIAL_VIEWSTATE.zoom ? focussed : null
    });
  }

  _animate() {
    this.state.time < 86400 ? this._updateTime(this.state.time + 0.0005) : this._updateTime(0);
    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }

  _updateTime(value) {
    const active = INCIDENT_POINTS.filter((incident) => {
      if (
        value > incident.properties.start_timestamp &&
        value < incident.properties.end_timestamp
      ) {
        if (
          incident.properties.start_timestamp === this.state.time &&
          incident.properties.status === 'detected'
        ) {
          this._flyToIncident(incident)
          this.setState({focussed: incident})
        }
        return incident
      }
    })

    if (active !== this.state.active) {

    }

    this.setState({
      time: value,
      active,
    })
  }

  _rotateCamera() {
    const bearing = this.state.viewState.bearing + 120;
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
        transitionInterpolator: new FlyToInterpolator({curve: 5}),
        transitionEasing: (t) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        onTransitionEnd: () => {
          if (zoomOut) {
            setTimeout(() => this._zoomOut(), 1200)
          }
        }
      }
    });
  }

  _flyToIncident(incident) {
    this.setState({focussed: incident})
    const bounds = {
      latitude: incident.geometry.coordinates[1],
      longitude: incident.geometry.coordinates[0],
      zoom: 15,
    }
    this._flyTo(bounds, true);
  }

  _zoomOut() {
    this.setState({
      viewState: {
        ...this.state.viewState,
        zoom: this.state.viewState.zoom  - 1,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator({curve: 5}),
        transitionEasing: (t) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
      }
    });
  }

  _resetCamera() {
    this.setState({
      viewState: {
        ...this.state.viewState,
        longitude: INITIAL_VIEWSTATE.longitude || this.state.viewState.longitude,
        latitude: INITIAL_VIEWSTATE.latitude || this.state.viewState.latitude,
        zoom: INITIAL_VIEWSTATE.zoom || this.state.viewState.zoom,
        pitch: INITIAL_VIEWSTATE.pitch || this.state.viewState.pitch,
        bearing: 0,
        transitionDuration: 800,
        transitionInterpolator: new FlyToInterpolator({curve: 5}),
        transitionEasing: (t) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
      }
    });
  }

  componentDidMount() {
    // setTimeout(() => this._rotateCamera(), 200)
  }

  render() {
    const {mapStyle = 'mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz'} = this.props;
    const {viewState, focussed} = this.state;
    const timestamp = new Date('1-1-2020');
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
          ></StaticMap>
        </DeckGL>
        <div style={{position: 'fixed', top: '2rem', left: '2rem'}}>
          <Alerts alerts={this.state.active} clicked={this._flyToIncident} time={this.state.time}/>
        </div>
        <div style={{position: 'fixed', top: '2rem', right: '2rem', width: '25vw'}}>
          {this.state.focussed ?
            <div className="panel flex-column">
              <div className="p-3 pb-0">
                <h3 className='mb-0 font-weight-lighter'>Incident Analytics</h3>
              </div>
              <div className="panel-body p-3 ">

                <div className="mb-4">
                  <h6>Status</h6>
                  <h5 className='text-capitalize'>
                    {focussed.properties.status} @ {format(addSeconds(timestamp, focussed.properties.start_timestamp), 'h:mm a')}
                  </h5>
                </div>
                <div className="mb-4">
                  <h5>Response Team Origin</h5>
                  <h5>{focussed.properties.response_origin}</h5>
                </div>

                <div className="mb-4">
                  <h6>Response Team ETA</h6>
                  <h5>{format(addSeconds(timestamp, focussed.properties.end_timestamp), 'h:mm a')}</h5>
                </div>



                {/*<p>Casualties: UNKNOWN <br/> Estimate: 3</p>*/}
                {/*<p>Response team deployed</p>*/}
                {/*<p>*/}
                {/*  Arriving from {this.state.focussed.properties.response_origin} <br/>*/}
                {/*  Estimated time: 12 minutes*/}
                {/*</p>*/}
                {/*<p>*/}
                {/*  Estimated time to clear intersection: <br/>*/}
                {/*  29 Minutes*/}
                {/*</p>*/}
                {/*<p className='mb-0'>*/}
                {/*  Intersection cleared, traffic returned to normal*/}
                {/*</p>*/}
              </div>
            </div>
            : null
          }
        </div>
        <div style={{position: 'fixed', bottom: '2rem', left: '2rem', width: 'calc(100vw - 4rem)'}}>
          <RangeSlider
            speed={1}
            rangeChange={this._updateTime}
            time={this.state.time}
          />
        </div>
      </div>
    )
  }
}

export default Incidents