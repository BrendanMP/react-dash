import React, { Component } from "react";
import Deck from "../components/Deck";

class Map extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Deck time={0} />
      </div>
    );
  }
}

export default Map;
