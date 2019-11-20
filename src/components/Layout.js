import React, { Component } from "react";
import { ReactComponent as COA } from "../images/COA.svg";
import { ReactComponent as Dashboard } from "../images/dashboard.svg";
import { ReactComponent as Map } from "../images/map.svg";
import { ReactComponent as ArrowRight } from "../images/arrow-right.svg";

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
          <header>
            <div>
              <strong className="text-uppercase">Page Title</strong>
            </div>
            <nav>
              <button className="btn">Control</button>
              <button className="btn">Control</button>
              <button className="btn">Control</button>
              <button className="btn">Control</button>
            </nav>
          </header>
        </main>
      </div>
    );
  }
}

export default Layout;
