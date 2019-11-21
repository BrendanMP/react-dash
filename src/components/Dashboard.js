import React, { Component } from "react";
import PropTypes from "prop-types";

const Rankings = props => {
  const data = props.data.map((item, i) => {
    item.rank = i + 1;
    return item;
  });

  const top = data.splice(0, 3);

  return (
    <div className="rankings container-fluid px-0">
      <div className="rankings__top row">
        {top.map((item, i) => (
          <div className="col">
            <div className="panel" key={`top-${i}`}>
              <div className="panel-body">
                <h5>{item.rank} - Leader</h5>
                <h1>{item.name}</h1>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        {data.map(item => (
          <div className="panel">
            <div className="panel-body">
              <h1 className="mb-0">{item.rank}</h1>
            </div>
            <div className="panel-body flex-grow-1">
              <h3 className="mb-0">{item.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
                <h1 className="mb-4">{view.label}</h1>
              </div>
              <Rankings data={view.data} />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

Dashboard.propTypes = {};

export default Dashboard;
