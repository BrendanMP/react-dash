import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

import 'mapbox-gl/dist/mapbox-gl.css';

import Home from './pages/Home';
import Controller from './pages/Controller';
import Map from './pages/Map';
import Test from './pages/Test';
import Socket from './pages/Socket';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/test">
            <Test/>
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
            <Home/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
