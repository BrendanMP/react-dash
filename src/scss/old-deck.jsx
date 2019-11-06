import React from 'react';
import DeckGL from '@deck.gl/react';
import {
  GeoJsonLayer,
  ScatterplotLayer,
  PathLayer
} from '@deck.gl/layers';
import {
  AmbientLight,
  PointLight,
  LightingEffect
} from '@deck.gl/core';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {StaticMap} from 'react-map-gl';
import {PhongMaterial} from '@luma.gl/core';
import {
  MapController,
  FlyToInterpolator,
  LinearInterpolator
} from 'deck.gl';
import {DataFilterExtension} from '@deck.gl/extensions';
// import SpeechRecognition from "react-speech-recognition";

// GeoJson
import communesJson from '../data/adbijan/communes.json';
import intersectionsJson from '../data/adbijan/intersections.json';
import dots from '../data/adbijan/dots.json';
import incidentsJson from '../data/adbijan/incidents';
import tripJson from '../data/adbijan/trips';
import roadJson from '../data/adbijan/roads';

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
        zoom: 12,
        bearing: 0,
        pitch: 60,
      },
      elevationScale: 0,
      coverage: 1,
      opacity: 0,
      filterValue: 0,
    };
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._flyTo = this._flyTo.bind(this);
    this._rotateCamera = this._rotateCamera.bind(this);
    this._onLoad = this._onLoad.bind(this);
    this._zoomLoad = this._zoomLoad.bind(this);
    this._addData = this._addData.bind(this);
    this._voiceCommand = this._voiceCommand.bind(this);
  }

  _voiceCommand = (value) => {
    console.log(value);
    if (value.trim().includes('zoom out')) {
      this.setState({
        viewState: {
          ...this.state.viewState,
          zoom: this.state.viewState.zoom - 1,
          transitionDuration: 1000,
          transitionInterpolator: new LinearInterpolator(),
        }
      })
    }

    if (value.trim().includes('zoom in') || value.trim().includes('enhance')) {
      this.setState({
        viewState: {
          ...this.state.viewState,
          zoom: this.state.viewState.zoom + 1,
          transitionDuration: 1000,
          transitionInterpolator: new LinearInterpolator(),
        }
      })
    }

    if (value.trim().includes('rotate')) {
      this._rotateCamera();
    }

    if (value.trim().includes('accidents')) {
      this._addData();
    }
  }

  componentDidMount() {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
      let interimTranscripts = '';
      let finalTranscripts = '';
      const speechToText = event.results[0][0].transcript;

      for(let i = event.resultIndex; i < event.results.length; i++){
        let transcript = event.results[i][0].transcript;
        transcript.replace("\n", "<br>");
        if(event.results[i].isFinal) {
          finalTranscripts += transcript;
        }else{
          interimTranscripts += transcript;
        }
      }
      if (interimTranscripts) {
        this._voiceCommand(interimTranscripts)
      }
    }
  }

  _onLoad() {
    setTimeout(() => {
      this._zoomLoad();
    }, 1000)
  }

  _zoomLoad() {
    this.setState({
      viewState: {
        ...this.state.viewState,
        zoom: 13,
        transitionDuration: 5000,
        transitionInterpolator: new FlyToInterpolator({speed: 2}),
        transitionEasing: (t) => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
      }
    })
  }

  _addData() {
    // this._rotateCamera();
    this.setState({
      elevationScale: 0.5,
      coverage: 1,
      opacity: 1,
    })
  }

  _rotateCamera() {
    // change bearing by 120 degrees.
    const bearing = this.state.viewState.bearing + 120;
    this.setState({
      viewState: {
        ...this.state.viewState,
        bearing,
        transitionDuration: 100000,
        transitionInterpolator,
        onTransitionEnd: this._rotateCamera
      }
    });
  }

  _pause() {

  }

  _onViewStateChange({viewState}) {
    this.setState({viewState});
  }

  _flyTo(info, event, object) {
    console.log(info);
  }


  _renderLayers() {
    const {
      communes = communesJson,
      points = dots.features,
      intersections = intersectionsJson.features,
      incidents = incidentsJson,
      trips = tripJson,
      roads = roadJson,
    } = this.props;

    return [
      // new PathLayer({
      //   id: 'path-layer',
      //   data: roads.features,
      //   pickable: true,
      //   widthScale: 20,
      //   widthMinPixels: 2,
      //   getPath: d => {
      //     return d.geometry.coordinates
      //   },
      //   getColor: d => [255,255,255],
      // }),
      new HexagonLayer({
        id: 'hex-layer',
        colorRange,
        material,
        data: points,
        pickable: true,
        opacity: this.state.opacity,
        stroked: true,
        filled: true,
        extruded: true,
        lineWidthMinPixels: 1,
        getPosition: d => d.geometry.coordinates,
        elevationScale: this.state.elevationScale,
        coverage: this.state.coverage,
        radius: 40,
        transitions: {
          elevationScale: 2400,
          coverage: 1200,
          opacity: 1200
        },
        getFillColor: d => [32, 201, 151],
        onClick: e => console.log(e),
      }),
      new GeoJsonLayer({
        id: 'communes-stroke',
        data: communes,
        stroked: true,
        filled: false,
        opacity: 0.05,
        lineWidthMinPixels: 2,
        getLineColor: [32, 201, 151],
      }),
      new GeoJsonLayer({
        id: 'communes-fill',
        data: communes,
        stroked: true,
        filled: true,
        opacity: 0,
        pickable: true,
        // getFillColor:  [32, 201, 151],
        onClick: (info, event) => {
          this.props.clickedLayer(info);
        },
        onHover: (info, event) => {
          if (info.layer) {
            info.layer.setState({opacity: 1});
          }
        }
      }),
      new ScatterplotLayer({
        id: 'incidents',
        data: incidents.incidents,
        getRadius: 100,
        getPosition: d => d.geometry.coordinates,
        getFillColor: d => [216, 254, 181],
        filterRange: [0, 1],
        getFilterValue: f => f.properties.timestamp,
        extensions: [new DataFilterExtension({filterSize: 1})]
      }),

      // new ScatterplotLayer({
      //   id: 'scatterplot-layer',
      //   data: intersections,
      //   pickable: true,
      //   opacity: 1,
      //   stroked: true,
      //   filled: true,
      //   radiusScale: 6,
      //   radiusMinPixels: 1,
      //   radiusMaxPixels: 100,
      //   lineWidthMinPixels: 1,
      //   getPosition: d => d.geometry.coordinates,
      //   getRadius: d => 10,
      //   getFillColor: d => [216, 254, 181],
      //   getLineColor: d => [216, 254, 181],
      //   // onHover: ({object, x, y}) => {
      //   //   const tooltip = `${object.name}\n${object.address}`;
      //   //   /* Update tooltip
      //   //      http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
      //   //   */
      //   // }
      // })
    ];
  }

  render() {
    const {mapStyle = 'mapbox://styles/brendan-transitlabs/ck2jngjl03qiu1coxtdo5cizd'} = this.props;
    const {viewState} = this.state;

    return (
      <div className='deck'>
        <DeckGL
          layers={this._renderLayers()}
          effects={[lightingEffect]}
          viewState={viewState}
          onLoad={this._onLoad}
          controller={{type: MapController, doubleClickZoom: false}}
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
    );
  }
}

export default Deck