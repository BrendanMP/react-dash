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

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data.data,
      ranges: [
        {
          name: "yesterday",
          label: "Yesterday",
          active: false
        },
        {
          name: "last_quarter",
          label: "Last Quarter",
          active: false
        },
        {
          name: "last_year",
          label: "Last Year",
          active: true
        }
      ]
    };
    this._changeDateRange = this._changeDateRange.bind(this);
    this._formatData = this._formatData.bind(this);
  }

  _changeDateRange(range) {
    const { ranges } = this.state;
    ranges.map(item => {
      item.active = false;
      if (item.name === range.name) item.active = true;
      return item;
    });
    this.setState({ ranges: ranges });
  }

  _formatData(data) {
    const { ranges } = this.state;
    const { views } = this.props;
    const activeView = views.find(view => view.active);
    const activeRange = ranges.find(range => range.active);

    const range = activeRange.name;

    data.map(item => {
      let value = 0;

      item.key = {
        singlular: "foo",
        plural: "bar"
      };

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

      item.value = Number(value);

      item.label = item.commune;

      return item;
    });

    data.sort((a, b) => (Number(a.value) > Number(b.value) ? 1 : -1));

    return data;
  }

  _getTitle(range, view) {
    return `${view.title || view.label} ${range.label}`;
  }

  render() {
    const { views } = this.props;
    const { ranges, data } = this.state;
    const activeRange = ranges.find(range => range.active);

    return (
      <div className="dashboard">
        {views.map((view, i) => (
          <div
            key={i}
            className={`dashboard__view ${view.active ? "active" : ""}`}
          >
            <div className="dashboard__nav">
              <button className={`btn active`}>Total</button>
              <button className={`btn`}>Change</button>
              <button className={`btn`}>Overall</button>
            </div>
            <div className="dashboard__content">
              <div className="dashboard__content-header mb-4">
                <h1 className="mb-0">{this._getTitle(activeRange, view)}</h1>
                <div>
                  {ranges.map((range, i) => (
                    <button
                      key={i}
                      className={`btn  ${range.active ? "active" : ""}`}
                      onClick={() => this._changeDateRange(range)}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
              <Rankings data={this._formatData(data)} />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

Dashboard.propTypes = {};

export default Dashboard;
