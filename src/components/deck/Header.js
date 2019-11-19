import React, { Component } from "react";
import Clock from "./Clock";

const Header = props => (
  <div className="panel">
    <div className="panel-body flex-grow-1 flex-row">
      <div className="flex-grow-1">Header</div>
      <div>
        <Clock time={props.time} day={props.day} />
      </div>
    </div>
  </div>
);

export default Header;
