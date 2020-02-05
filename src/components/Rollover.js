import React, { Component } from "react";
import Typed from "react-typed";

class Rollover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false
    };
    this.onHover = this.onHover.bind(this);
  }

  onHover() {
    this.setState({ hovered: !this.state.hovered });
  }

  render() {
    const { hovered } = this.state;
    const { init, hover } = this.props;
    return (
      <div
        onMouseEnter={this.onHover}
        onMouseLeave={this.onHover}
        style={{ cursor: "pointer" }}
      >
        {hovered && init !== hover ? (
          <Typed
            strings={[hover.toString()]}
            key={hover}
            showCursor={false}
            typeSpeed={50}
          />
        ) : (
          <Typed
            strings={[init.toString()]}
            key={init}
            showCursor={false}
            typeSpeed={50}
          />
        )}
        &nbsp;
      </div>
    );
  }
}

export default Rollover;
