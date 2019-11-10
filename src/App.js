import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

import 'mapbox-gl/dist/mapbox-gl.css';

import Finance from './pages/finance/Finance';
import Controller from './pages/Controller';
import Map from './pages/Map';
import TripDeck from './pages/TripDeck';
import Socket from './pages/Socket';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/finance/home">
            <Finance/>
          </Route>
          <Route path="/map">
            <Map/>
          </Route>
          <Route path="/socket">
            <Socket/>
          </Route>
          <Route path="/controller">
            <Controller/>
          </Route>
          <Route path="/">
            <TripDeck/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
