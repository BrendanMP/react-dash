import React, { Component } from "react";
import { ReactComponent as COA } from "../images/COA.svg";
import { ReactComponent as DashboardIcon } from "../images/dashboard.svg";
import { ReactComponent as MapIcon } from "../images/map.svg";
import { ReactComponent as ArrowRight } from "../images/arrow-right.svg";
import { ReactComponent as ArrowLeft } from "../images/arrow-left.svg";

import DeckGL, {
  MapController,
  GeoJsonLayer,
  HexagonLayer,
  FlyToInterpolator,
  LinearInterpolator
} from "deck.gl";

import Fullscreen from "./deck/Fullscreen";
import Deck from "./deck/Deck";
import { StaticMap } from "react-map-gl";
import { TransitionGroup } from "react-transition-group";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYnJlbmRhbi10cmFuc2l0bGFicyIsImEiOiJjazI5aHptaWEwdzJzM25vMnB0aHhqcjNlIn0.oZFZBkbrnOrF80fkS3xNgQ";

const MAPBOX_STYLE =
  "mapbox://styles/brendan-transitlabs/ck2m1hpe701041cpgdrcqtduz";

const INITIAL_VIEWSTATE = {
  latitude: 5.322635048060814,
  longitude: -4.013425118889425,
  zoom: 13,
  bearing: 0,
  pitch: 13 * 3,
  pitch_modifer: 3
};

const renderNavIcons = name => {
  switch (name) {
    case "map":
      return <MapIcon />;
    case "dashboard":
      return <DashboardIcon />;
    default:
      return "";
  }
};

const NavIcons = props => {
  const { views } = props;
  return (
    <ul className="list-unstyled">
      {views.map((view, i) => (
        <li key={i}>
          <button
            className={`btn ${view.active ? "active" : ""}`}
            onClick={() => props.clickedNavItem(view.name)}
          >
            {renderNavIcons(view.name)}
          </button>
        </li>
      ))}
    </ul>
  );
};

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewState: {
        latitude: INITIAL_VIEWSTATE.latitude,
        longitude: INITIAL_VIEWSTATE.longitude,
        zoom: INITIAL_VIEWSTATE.zoom,
        bearing: 0,
        pitch: INITIAL_VIEWSTATE.zoom * INITIAL_VIEWSTATE.pitch_modifer
      },
      views: [
        {
          name: "map",
          label: "Map",
          active: true,
          submenuCollapsible: true,
          submenu: [
            {
              name: "accidents",
              label: "Accidents"
            },
            {
              name: "fatalities",
              label: "Fatalities"
            },
            {
              name: "response_time",
              label: "Response Time"
            },
            {
              name: "no_response",
              label: "No Response"
            }
          ]
        },
        {
          name: "dashboard",
          label: "Dashboard",
          active: false,
          submenuCollapsible: false,
          submenu: [
            {
              name: "accidents",
              label: "Accidents"
            },
            {
              name: "accidents",
              label: "Accidents"
            },
            {
              name: "fatalities",
              label: "Fatalities"
            }
          ]
        }
      ],
      submenuCollapsed: false
    };
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this._collapseNavButtons = this._collapseNavButtons.bind(this);
    this._clickedNavItem = this._clickedNavItem.bind(this);
  }

  _onViewStateChange({ viewState }) {
    const viewstate = viewState;
    viewState.pitch = viewState.zoom * 3;
    this.setState({ viewState });
  }

  _collapseNavButtons() {
    const { submenuCollapsed } = this.state;
    this.setState({ submenuCollapsed: !submenuCollapsed });
  }

  _clickedNavItem(name) {
    const { views, submenuCollapsed } = this.state;
    const active = views.find(view => view.name === name);
    views.map(view => {
      view === active ? (view.active = true) : (view.active = false);
      return view;
    });
    this.props.changeView(views);
    this.setState({
      submenuCollapsed: false
    });
  }

  render() {
    const { views, viewState, submenuCollapsed } = this.state;
    const active = views.find(view => view.active === true);
    return (
      <div className="page">
        <nav className="page__icon-nav">
          <COA />
          <NavIcons
            views={views}
            clickedNavItem={name => this._clickedNavItem(name)}
          />
          <footer>
            {active.submenuCollapsible ? (
              <button className="btn" onClick={this._collapseNavButtons}>
                {submenuCollapsed ? <ArrowRight /> : <ArrowLeft />}
              </button>
            ) : null}
          </footer>
        </nav>
        <nav
          className={`page__button-nav ${!submenuCollapsed ? "active" : ""}`}
        >
          {active.submenu.map((item, i) => (
            <button className="btn" key={i}>
              {item.label}
            </button>
          ))}
        </nav>
        <main
          className={`page__content ${
            !active.submenuCollapsible ? "non-collapsible" : ""
          }`}
        >
          <div
            className={`page__content-view ${
              active.name === "map" ? "active" : ""
            }`}
          >
            <DeckGL
              viewState={viewState}
              controller={{ type: MapController, doubleClickZoom: false }}
              onViewStateChange={this._onViewStateChange}
            >
              <StaticMap
                id="map"
                reuseMaps
                mapStyle={MAPBOX_STYLE}
                preventStyleDiffing={true}
                mapboxApiAccessToken={MAPBOX_TOKEN}
              />
            </DeckGL>
          </div>

          <div
            className={`page__content-view ${
              active.name === "dashboard" ? "active" : ""
            }`}
          >
            <div style={{ paddingLeft: "12vw" }}>Dashboard Component</div>
          </div>
        </main>
      </div>
    );
  }
}

export default Layout;
