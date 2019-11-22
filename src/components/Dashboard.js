import React, { Component } from "react";

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
          <div className="rankings__top-item col" key={`top-${i}`}>
            <div className="panel">
              <div className="panel-body rankings__top-item-rank">
                #{item.rank}
              </div>
              <div className="panel-body rankings__top-item-content">
                <h2>{item.label}</h2>
                <h1 className="mb-0">
                  {item.value}
                  {item.key.unit}
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="rankings__list">
        {data.map((item, i) => (
          <div className="panel rankings__list-item" key={`item-${i}`}>
            <div
              className="panel-body text-center rankings__list-item-rank"
              style={{ minWidth: "7rem" }}
            >
              <h1 className="mb-0">#{item.rank}</h1>
            </div>
            <div className="panel-body rankings__list-item-content flex-grow-1">
              <h1 className="mb-0 mr-4" style={{ minWidth: "20rem" }}>
                {item.label}
              </h1>
              <h1 className="mb-0">
                {item.value}
                {item.key.unit}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getProgressColor = progress => {
  const progressNumber = Number(progress);
  if (progressNumber >= 80) {
    return "green";
  }
  if (progressNumber >= 50) {
    return "yellow";
  }

  if (progressNumber <= 50) {
    return "red";
  }
};

const Projects = props => {
  const data = props.data.map((item, i) => {
    item.rank = i + 1;
    return item;
  });

  return (
    <div className="container-fluid">
      <div className="row">
        {data.map((item, i) => (
          <div
            className="col-4 d-flex flex-column mb-3 project"
            key={`project-${i}`}
          >
            <div className="panel flex-grow-1">
              <div className="panel-body flex-grow-1">
                <div className="project__header">
                  <h2 className="mb-0">{item.project}</h2>
                </div>
                <div className="project__content">
                  <div className="row">
                    <div className="col-6">
                      <h5>USD</h5>
                      <h4>{item.project_cost_usd}</h4>
                    </div>
                    <div className="col-6">
                      <h5>FCFA</h5>
                      <h4>{item.project_cost_fcfa}</h4>
                    </div>
                    <div className="col-6">
                      <h5>STATUS</h5>
                      <h4>{item.project_status}</h4>
                    </div>
                    <div className="col-6">
                      <h5>MINISTRY</h5>
                      <h4>{item.project_ministry}</h4>
                    </div>
                  </div>
                </div>
                <div className="project__progress">
                  <h5>PROGRESS</h5>
                  <div className="project__progress-bar">
                    <div
                      className={`project__progress-bar--progress ${getProgressColor(
                        item.project_completion_percentage
                      )}`}
                      style={{
                        width: `${item.project_completion_percentage}%`
                      }}
                    ></div>
                    <div className={`project__progress-bar--progress-number`}>
                      {item.project_completion_percentage}%
                    </div>
                  </div>
                </div>
              </div>
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
    this.state = {
      data: props.data,
      sets: props.sets || []
    };
    this._changeDateRange = this._changeDateRange.bind(this);
    this._changeDataSet = this._changeDataSet.bind(this);
    this._formatData = this._formatData.bind(this);
    this._formatFinanceData = this._formatFinanceData.bind(this);
  }

  _changeDateRange(input) {
    const { sets } = this.state;
    sets
      .find(set => set.active)
      .ranges.map(range => {
        range.name === input.name
          ? (range.active = true)
          : (range.active = false);
        return range;
      });
    this.setState({ sets });
  }

  _changeDataSet(set) {
    const { sets } = this.state;
    sets.map(item => {
      item.active = false;
      if (item.name === set.name) item.active = true;
      return item;
    });
    this.setState({ sets });
  }

  _formatData(data) {
    const { views, sets } = this.props;
    const activeView = views.find(view => view.active);
    const activeRange = sets
      .find(set => set.active)
      .ranges.find(range => range.active);
    const activeSet = sets.find(set => set.active);
    const range = activeRange ? activeRange.name : null;
    const set = activeSet ? activeSet.name : null;

    data.map(item => {
      let value = "N/A";
      item.key = {
        singlular: "",
        plural: "",
        unit: ""
      };

      if (set === "total") {
        if (activeView.name === "accidents") {
          if (range === "yesterday") value = item.accidents_yesterday;
          if (range === "last_quarter") value = item.accidents_q3_2019;
          if (range === "last_year") value = item.accidents_2018;

          item.key = {
            singlular: "accident",
            plural: "accidents"
          };
        }

        if (activeView.name === "fatalities") {
          if (range === "yesterday") value = item.fatalities_yesterday;
          if (range === "last_quarter") value = item.fatalities_q3_2019;
          if (range === "last_year") value = item.fatalities_2018;

          item.key = {
            singlular: "fatality",
            plural: "fatalities"
          };
        }

        if (activeView.name === "response_time") {
          if (range === "yesterday") value = item.response_time_yesterday;
          if (range === "last_quarter") value = item.response_time_q3_2019;
          if (range === "last_year") value = item.response_time_2018;

          item.key = {
            singlular: "minute",
            plural: "minutes",
            unit: "min"
          };
        }

        if (activeView.name === "no_response") {
          if (range === "yesterday") value = item.nonresponse_yesterday;
          if (range === "last_quarter") value = item.nonresponse_q3_2019;
          if (range === "last_year") value = item.nonresponse_2018;

          item.key = {
            singlular: "%",
            plural: "%",
            unit: "%"
          };
        }
      }

      if (set === "change") {
        if (activeView.name === "accidents") {
          if (range === "last_year")
            value = item.accidents_q3_2019 - item.accidents_q3_2018;

          item.key = {
            singlular: "accident",
            plural: "accidents"
          };
        }

        if (activeView.name === "fatalities") {
          if (range === "last_year")
            value = item.fatalities_q3_2019 - item.fatalities_q3_2018;

          item.key = {
            singlular: "fatality",
            plural: "fatalities"
          };
        }

        if (activeView.name === "response_time") {
          if (range === "last_year")
            value = item.response_time_q3_2019 - item.response_time_q3_2018;

          item.key = {
            singlular: "minute",
            plural: "minutes",
            unit: "min"
          };
        }

        if (activeView.name === "no_response") {
          if (range === "last_year")
            value = item.nonresponse_q3_2019 - item.nonresponse_q3_2018;

          item.key = {
            singlular: "%",
            plural: "%",
            unit: "%"
          };
        }
      }

      item.value = value !== "N/A" ? Number(value) : "N/A";

      item.label = item.commune;

      return item;
    });

    data.sort((a, b) => (Number(a.value) > Number(b.value) ? 1 : -1));

    return data;
  }

  _formatFinanceData() {
    const { sets, data } = this.state;
    const active = sets.find(set => set.active);

    if (active.name === "progress") {
      data.sort((a, b) =>
        Number(a.project_completion_percentage) <
        Number(b.project_completion_percentage)
          ? 1
          : -1
      );
    }

    if (active.name === "ministry") {
      data.sort((a, b) => (a.project_ministry > b.project_ministry ? 1 : -1));
    }
    return data;
  }

  _getTitle(range, view) {
    if (range && view)
      return `${view.title || view.label || ""} ${range.label || ""}`;
  }

  render() {
    const { views, sets, type } = this.props;
    const { data } = this.state;
    const activeRange = sets
      .find(set => set.active)
      .ranges.find(range => range.active);

    return (
      <div className="dashboard">
        {views.map((view, i) => (
          <div
            key={`view-${i}`}
            className={`dashboard__view ${view.active ? "active" : ""}`}
          >
            <div className="dashboard__nav">
              {sets.map((set, i) => (
                <button
                  key={`set-${i}`}
                  className={`btn ${set.active ? "active" : ""}`}
                  onClick={() => this._changeDataSet(set)}
                >
                  {set.label}
                </button>
              ))}
            </div>
            <div className="dashboard__content">
              <div className="dashboard__content-header mb-4">
                <h1 className="mb-0">{this._getTitle(activeRange, view)}</h1>
                <div>
                  {sets.map((set, i) =>
                    set.active
                      ? set.ranges.map(range => (
                          <button
                            key={`set-${range.name}-${i}`}
                            className={`btn  ${range.active ? "active" : ""}`}
                            onClick={() => this._changeDateRange(range)}
                          >
                            {range.label}
                          </button>
                        ))
                      : null
                  )}
                </div>
              </div>
              {type === "finance" ? (
                <Projects data={this._formatFinanceData(data)}></Projects>
              ) : (
                <Rankings data={this._formatData(data)} />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Dashboard;
