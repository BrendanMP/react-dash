import React, { Component } from "react";
import { HorizontalBar } from "react-chartjs-2";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data } = this.props;

    return (
      <div className="chart-wrapper" style={{ paddingTop: "80%" }}>
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            top: 0,
            left: 0
          }}
        >
          <HorizontalBar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              legend: { display: false },
              scales: {
                // xAxes: [{ stacked: true }],
                // yAxes: [{ stacked: true }]
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default BarChart;
