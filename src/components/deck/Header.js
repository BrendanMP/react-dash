import React from "react";
import { ReactComponent as COA } from "../../images/COA.svg";

const Header = props => (
  <div className="d-flex justify-content-between">
    <COA />
    <div className="p-3">
      <button className="btn">Fullscreen</button>
      <button className="btn">Rotate</button>
      <button className="btn">Reset</button>
    </div>
  </div>
);

export default Header;
