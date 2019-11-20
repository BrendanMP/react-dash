import React, { Component } from "react";
import { ReactComponent as COA } from "../images/COA.svg";
import { ReactComponent as Dashboard } from "../images/dashboard.svg";
import { ReactComponent as Map } from "../images/map.svg";
import { ReactComponent as ArrowRight } from "../images/arrow-right.svg";

import Fullscreen from "./deck/Fullscreen";

class Layout extends Component {
  render() {
    return (
      <div className="page">
        <nav className="page__icon-nav">
          <COA />
          <ul className="list-unstyled">
            <li>
              <button className="btn active">
                <Map />
              </button>
            </li>
            <li>
              <button className="btn">
                <Dashboard />
              </button>
            </li>
          </ul>
          <footer>
            <button className="btn">
              <ArrowRight />
            </button>
          </footer>
        </nav>
        <nav className="page__button-nav">
          <button className="btn active">Accidents</button>
          <button className="btn">Fatalities</button>
          <button className="btn">Response Time</button>
          <button className="btn">No Response</button>
        </nav>
        <main className="page__content">
          <header className="d-flex align-items-center">
            <div className="flex-grow-1 pl-2">
              <strong className="text-uppercase">Page Title</strong>
            </div>
            <nav className="page__controls">
              <button className="btn px-2">
                <Fullscreen />
              </button>
              <button className="btn px-2">
                <Fullscreen />
              </button>
              <button className="btn px-2">
                <Fullscreen />
              </button>
              <button className="btn px-2">
                <Fullscreen />
              </button>
            </nav>
          </header>
        </main>
      </div>
    );
  }
}

export default Layout;
