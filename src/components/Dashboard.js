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
          <div className="col" key={`top-${i}`}>
            <div className="panel">
              <div className="panel-body">
                <h1 className="mb-4">
                  #{item.rank} {item.label}
                </h1>
                <div className="h3 mb-3">
                  <span className="mr-2">{item.value}</span>
                  <span className="text-capitalize">
                    {item.value === 1 ? item.key.singlular : item.key.plural}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        {data.map((item, i) => (
          <div className="panel" key={`item-${i}`}>
            <div
              className="panel-body text-center"
              style={{ minWidth: "7rem" }}
            >
              <h1 className="mb-0">{item.rank}</h1>
            </div>
            <div className="panel-body flex-grow-1">
              <h2 className="mb-2">{item.label}</h2>
              <div className="h3 mb-0">
                <span className="mr-1">{item.value}</span>
                <span className="text-capitalize">
                  {item.value === 1 ? item.key.singlular : item.key.plural}
                </span>
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
      data: props.data.data,
      ranges: [
        {
          name: "yesterday",
          label: "Yesterday",
          active: true
        },
        {
          name: "last_quarter",
          label: "Last Quarter",
          active: false
        },
        {
          name: "last_year",
          label: "Last Year",
          active: false
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
          plural: "minutes"
        };
      }

      if (activeView.name === "no_response") {
        if (range === "yesterday") value = item.nonresponse_yesterday;
        if (range === "last_quarter") value = item.nonresponse_q3_2019;
        if (range === "last_year") value = item.nonresponse_2018;

        item.key = {
          singlular: "%",
          plural: "%"
        };
      }

      item.value = Number(value);

      item.label = item.commune;

      return item;
    });

    data.sort((a, b) => (Number(a.value) > Number(b.value) ? 1 : -1));

    return data;
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
              <button className={`btn`}>Total</button>
              <button className={`btn`}>Change</button>
              <button className={`btn`}>Overall</button>
            </div>
            <div className="dashboard__content">
              <div className="dashboard__content-header">
                <h1 className="mb-4">{view.name}</h1>
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
