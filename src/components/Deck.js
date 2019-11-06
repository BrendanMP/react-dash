import React from 'react';
import socketIOClient from 'socket.io-client'
import DeckGL, {
  MapController,
  GeoJsonLayer,
  HexagonLayer,
  AmbientLight,
  PointLight,
  LightingEffect,
  FlyToInterpolator,
  LinearInterpolator
} from 'deck.gl';
import {StaticMap} from 'react-map-gl';
import {PhongMaterial} from '@luma.gl/core';

import COMMUNES_JSON from '../data/adbijan/communes.json';
import DOTS_JSON from '../data/adbijan/dots.json';


const MAPBOX_TOKEN =
  'pk.eyJ1IjoiYnJlbmRhbi10cmFuc2l0bGFicyIsImEiOiJjazI5aHptaWEwdzJzM25vMnB0aHhqcjNlIn0.oZFZBkbrnOrF80fkS3xNgQ';

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

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 2,
  position: [-0.144528, 49.739968, 80000],
});

const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight1,
});

const transitionInterpolator = new LinearInterpolator(['bearing']);

class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: {
        latitude: 5.322635048060814,
        longitude: -4.013425118889425,
        zoom: 10,
        bearing: 0,
        pitch: 12 *3,
      },

      layers: {
        hexagon: {
          elevationScale: 0,
          coverage: 1,
          opacity: 0
        }
      },
      endpoint: '0.0.0.0:3030'
    };
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._flyTo = this._flyTo.bind(this);
    this._rotateCamera = this._rotateCamera.bind(this);
    this._addData = this._addData.bind(this);
  }

  _onViewStateChange({viewState}) {
    const viewstate = viewState;
    viewState.pitch = viewState.zoom * 3;
    this.setState({viewState});
  }

  _renderLayers = () => {
    const {hexagon} = this.state.layers;
    return [
      new HexagonLayer({
        id: 'hex-layer',
        colorRange,
        material,
        data: DOTS_JSON.features,
        pickable: true,
        opacity: hexagon.opacity,
        stroked: true,
        filled: true,
        extruded: true,
        lineWidthMinPixels: 1,
        getPosition: d => d.geometry.coordinates,
        elevationScale: hexagon.elevationScale,
        coverage: 1,
        radius: 30,
        transitions: {
          elevationScale: 2400,
          coverage: 1200,
          opacity: 500
        },
        getFillColor: d => [32, 201, 151],
        onClick: e => console.log(e),
      }),
      new GeoJsonLayer({
        id: 'communes-stroke',
        data: COMMUNES_JSON,
        stroked: true,
        filled: false,
        opacity: 0.4,
        lineWidthMinPixels: 2,
        getLineColor: [32, 201, 151],
      }),
      new GeoJsonLayer({
        id: 'communes-fill',
        data: COMMUNES_JSON,
        stroked: true,
        filled: true,
        opacity: 0,
        pickable: true,
        onClick: (info) => {
          const {bounds} = info.object.properties;
          if (bounds) this._flyTo(bounds)
          this.props.clickedLayer(info)
        }
      }),
    ]
  }

  _addData = () => {
    const state = this.state;
    // state.layers.hexagon.elevationScale = 1;
    // state.layers.hexagon.opacity = 1;
    this.setState(state);
  }

  _rotateCamera() {
    const bearing = this.state.viewState.bearing + 120;
    this.setState({
      viewState: {
        ...this.state.viewState,
        bearing,
        transitionDuration: 100000,
        transitionInterpolator,
        onTransitionEnd: this._rotateCamera,
      }
    });
  }

  _flyTo(bounds) {
    const socket = socketIOClient(this.state.endpoint);
    if (this.props.controller) {
      socket.emit('update', bounds);
    }

    this.setState({
      viewState: {
        ...this.state.viewState,
        longitude: bounds.longitude || this.state.viewState.longitude,
        latitude: bounds.latitude || this.state.viewState.latitude,
        zoom: bounds.zoom || this.state.viewState.zoom,
        pitch: bounds.pitch || this.state.viewState.pitch,
        bearing: 0,
        transitionDuration: 800,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: (t) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        onTransitionEnd: this._rotateCamera
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.command !== this.props.command) {
      const result = COMMUNES_JSON.features.find(item => {
        return item.properties.name.toLowerCase() === this.props.command.trim().toLowerCase()
      })

      if (result) {
        this._flyTo(result.properties.bounds)
      }
    }
  }

  componentDidMount() {
    if (!this.props.controller) {
      const socket = socketIOClient(this.state.endpoint);
      socket.on('update', (bounds) => {
        
        console.log('receive socket data', bounds);
        this._flyTo(bounds);
      })
    }
    setTimeout(() => {
      this._addData()
    }, 1000)
  }

  render() {
    const {mapStyle = 'mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz'} = this.props;
    const {viewState} = this.state;

    return (
      <div>
        <DeckGL
          viewState={viewState}
          layers={this._renderLayers()}
          controller={{type: MapController, doubleClickZoom: false}}
          effects={[lightingEffect]}
          onViewStateChange={this._onViewStateChange}
        >
          <StaticMap
            reuseMaps
            mapStyle={mapStyle}
            preventStyleDiffing={true}
            mapboxApiAccessToken={MAPBOX_TOKEN}
          />
        </DeckGL>
      </div>
    )
  }
}

export default Deck

