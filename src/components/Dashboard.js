import React, { Component } from "react";

const Rankings = props => {
  const data = props.data
    .sort((a, b) =>
      Number(a.accidents_2018) > Number(b.accidents_2018) ? 1 : -1
    )
    .map((item, i) => {
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
                <h1 className="mb-4">
                  {item.rank} - {item.commune}
                </h1>
                <h4>Total Accidents 2018</h4>
                <h2>{item.accidents_2018}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        {data.map(item => (
          <div className="panel">
            <div
              className="panel-body text-center"
              style={{ minWidth: "7rem" }}
            >
              <h1 className="mb-0">{item.rank}</h1>
            </div>
            <div className="panel-body flex-grow-1">
              <h3 className="mb-0">{item.commune}</h3>
              <div>{item.accidents_2018}</div>
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
    const { views, data } = this.props;
    return (
      <div className="dashboard">
        {views.map((view, i) => (
          <div
            key={i}
            className={`dashboard__view ${view.active ? "active" : ""}`}
          >
            <div className="dashboard__nav">
              <button className="btn">Yesterday</button>
              <button className="btn">Last Quarter</button>
              <button className="btn">Last Year</button>
            </div>
            <div className="dashboard__content">
              <div className="dashboard__content-header">
                <h1 className="mb-4">{view.label}</h1>
              </div>
              <Rankings data={data.data} />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

Dashboard.propTypes = {};

export default Dashboard;
