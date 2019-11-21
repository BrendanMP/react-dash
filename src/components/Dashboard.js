import React, { Component } from "react";
import PropTypes from "prop-types";

const Rankings = () => (
  <div className="rankings container-fluid px-0">
    <div className="ranking__cards row">
      <div className="col">
        <div className="panel">
          <div className="panel-body">
            <h5>Leader</h5>
            <h1>Cocody</h1>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="panel">
          <div className="panel-body">
            <h5>Leader</h5>
            <h1>Cocody</h1>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="panel">
          <div className="panel-body">
            <h5>Leader</h5>
            <h1>Cocody</h1>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div className="panel">
        <div className="panel-body">
          <h1 className="mb-0">#3</h1>
        </div>
        <div className="panel-body flex-grow-1">
          <h3 className="mb-0">Cocody</h3>
        </div>
      </div>
      <div className="panel">
        <div className="panel-body">
          <h1 className="mb-0">#3</h1>
        </div>
        <div className="panel-body flex-grow-1">
          <h3 className="mb-0">Cocody</h3>
        </div>
      </div>
      <div className="panel">
        <div className="panel-body">
          <h1 className="mb-0">#3</h1>
        </div>
        <div className="panel-body flex-grow-1">
          <h3 className="mb-0">Cocody</h3>
        </div>
      </div>
      <div className="panel">
        <div className="panel-body">
          <h1 className="mb-0">#3</h1>
        </div>
        <div className="panel-body flex-grow-1">
          <h3 className="mb-0">Cocody</h3>
        </div>
      </div>
    </div>
  </div>
);

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { views } = this.props;
    return (
      <div className="dashboard">
        {views.map((view, i) => (
          <div
            key={i}
            className={`dashboard__view ${view.active ? "active" : ""}`}
          >
            <div className="dashboard__nav">
              <button className="btn btn-dark">Trigger</button>
              <button className="btn btn-dark">Trigger</button>
              <button className="btn btn-dark">Trigger</button>
            </div>
            <div className="dashboard__content">
              <div className="dashboard__content-header">
                <h1 className="mb-4">Overall</h1>
              </div>
              <Rankings />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

Dashboard.propTypes = {};

export default Dashboard;
