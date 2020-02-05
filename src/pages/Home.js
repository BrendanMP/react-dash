import React, { Component } from "react";

import axios from "axios";

import googleMapsClient from "@google/maps";

import BarChart from "../components/charts/--BarChart";
import LineChart from "../components/charts/LineChart";

googleMapsClient.createClient({
  key: "AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw"
});

// https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw

// https://maps.googleapis.com/maps/api/directions/json?origin=5.2544696%2C-3.9296293&destination=5.3036192%2C-4.00463&key=AIzaSyDu0pWPJJZTJowhPaUJvSralWi3tGjZofw

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {
        type: "bar",
        data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [
            {
              label: "Data Set 1",
              data: [4, 16, 3, 5, 2, 3],
              backgroundColor: [73, 227, 206]
            },
            {
              label: "Data Set 2",
              data: [12, 19, 5, 6, 3, 4],
              backgroundColor: [216, 254, 181]
            },
            {
              label: "Data Set 3",
              data: [8, 3, 10, 12, 3, 4],
              backgroundColor: [254, 120, 78]
            }
          ]
        }
      }
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="container py-5 px-5">
        <BarChart data={this.state.chartData.data} />
        <section className="mt-4">
          <LineChart data={this.state.chartData.data} />
        </section>
      </div>
    );
  }
}

export default Home;
