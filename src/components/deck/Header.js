import React from "react";

import Fullscreen from "./Fullscreen";

import { ReactComponent as COA } from "../../images/COA.svg";
import { ReactComponent as Rotate } from "../../images/rotate.svg";
import { ReactComponent as Reset } from "../../images/reset.svg";

const Header = props => (
  <div className="d-flex justify-content-between">
    <COA />
    <div className="p-3 controls">
      <button className="btn" onClick={() => props.clickedControl("rotate")}>
        <Rotate />
      </button>
      <button className="btn" onClick={() => props.clickedControl("reset")}>
        <Reset />
      </button>
      <Fullscreen />
    </div>
  </div>
);

export default Header;
