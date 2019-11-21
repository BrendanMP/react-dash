import React, { Component } from "react";
import PropTypes from "prop-types";

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
            <div className="dashboard__content">Tables n shit</div>
          </div>
        ))}
      </div>
    );
  }
}

Dashboard.propTypes = {};

export default Dashboard;
