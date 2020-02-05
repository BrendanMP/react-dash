import React, { Component } from "react";
import { Pie } from "react-chartjs-2";

class PieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data } = this.props;

    return (
      <div className="chart-wrapper" style={{ paddingTop: "100%" }}>
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            top: 0,
            left: 0
          }}
        >
          <Pie
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              legend: { display: false },
              tooltips: false
            }}
          />
        </div>
      </div>
    );
  }
}

export default PieChart;
