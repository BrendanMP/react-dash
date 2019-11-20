import React from "react";

import { HashRouter, Switch, Route } from "react-router-dom";

import "mapbox-gl/dist/mapbox-gl.css";

import Finance from "./pages/finance/Finance";
import Traffic from "./pages/traffic/Traffic";
import TrafficSandbox from "./pages/traffic/TrafficSandbox";
import Incidents from "./pages/incidents/Incidents";
import Accidents from "./pages/accidents/Accidents";
import Layout from "./components/Layout";

function App() {
  return (
    <HashRouter>
      <div className="App">
        <Switch>
          <Route path="/layout">
            <Layout />
          </Route>
          <Route path="/finance/home">
            <Finance />
          </Route>
          <Route path="/traffic/sandbox">
            <TrafficSandbox controller={true} />
          </Route>
          <Route path="/traffic/controller">
            <Traffic controller={true} />
          </Route>
          <Route path="/traffic/">
            <Traffic />
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
