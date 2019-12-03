import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import Finance from "./pages/finance/Finance";
import Traffic from "./pages/traffic/Traffic";
import TrafficController from "./pages/traffic/TrafficController";
import Incidents from "./pages/incidents/Incidents";
import Accidents from "./pages/accidents/Accidents";
import Socket from "./pages/Socket";

import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Switch>
          <Route path="/finance/home">
            <Finance />
          </Route>
          <Route path="/traffic/controller">
            <TrafficController />
          </Route>
          <Route path="/traffic/">
            <Traffic />
          </Route>
          <Route path="/socket/">
            <Socket />
          </Route>
          <Route path="/accidents/controller">
            <Accidents controller={true} />
          </Route>
          <Route path="/accidents/">
            <Accidents />
          </Route>
          <Route path="/incidents/controller">
            <Incidents controller={true} />
          </Route>
          <Route path="/incidents/">
            <Incidents />
          </Route>
          <Route path="/">
            <Traffic controller={true} />
          </Route>
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
