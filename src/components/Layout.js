import React, { Component } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { ReactComponent as COA } from "../images/COA.svg";
import { ReactComponent as DashboardIcon } from "../images/dashboard.svg";
import { ReactComponent as MapIcon } from "../images/map.svg";
import { ReactComponent as ArrowRight } from "../images/arrow-right.svg";
import { ReactComponent as ArrowLeft } from "../images/arrow-left.svg";
import { ReactComponent as Rank } from "../images/rank.svg";
import { ReactComponent as Rotate } from "../images/rotate.svg";
import { ReactComponent as Reset } from "../images/reset.svg";
import { ReactComponent as Ministries } from "../images/ministries.svg";
import Fullscreen from "./deck/Fullscreen";
import Timeline from "./deck/Timeline";

const renderNavIcons = name => {
  switch (name) {
    case "map":
      return <MapIcon />;
    case "dashboard":
      return <DashboardIcon />;
    case "ministries":
      return <Ministries />;
    default:
      return "";
  }
};

const renderControlIcons = name => {
  switch (name) {
    case "rotate":
      return <Rotate />;
    case "reset":
      return <Reset />;
    default:
      return "";
  }
};

const NavIcons = props => {
  const { views } = props;
  return (
    <ul className="list-unstyled mb-0">
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
      views: props.views,
      submenuCollapsed: false
    };
    this._collapseNavButtons = this._collapseNavButtons.bind(this);
    this._clickedNavItem = this._clickedNavItem.bind(this);
    this._updateTime = this._updateTime.bind(this);
  }

  _collapseNavButtons() {
    const { submenuCollapsed } = this.state;
    this.setState({ submenuCollapsed: !submenuCollapsed });
  }

  _clickedNavItem(name) {
    const { submenuCollapsed } = this.state;
    const { views } = this.props;
    this.props.changeView(name);
    this.setState({
      submenuCollapsed: false
    });
  }
  _clickedSubMenu(name, view) {
    this.props.clickedSubMenu(name, view);
  }

  _updateTime(time) {
    this.props.updateTime(time);
  }

  render() {
    const { submenuCollapsed } = this.state;
    const { views, submenu } = this.props;
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
            <button
              disabled={
                !submenu.length || !active.submenuCollapsible ? true : false
              }
              className={`btn`}
              onClick={this._collapseNavButtons}
            >
              {submenuCollapsed ? <ArrowRight /> : <ArrowLeft />}
            </button>
          </footer>
        </nav>
        <div
          className={`page__button-nav ${!submenuCollapsed ? "active" : ""}`}
        >
          {submenu.map((item, i) => (
            <button
              className={`btn ${item.active ? "active" : ""}`}
              key={`${i}`}
              onClick={() => this._clickedSubMenu(item.name, active.name)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <main
          className={`page__content ${
            !submenu.length || submenuCollapsed
              ? "collapsed "
              : " " + !active.submenuCollapsible
              ? "non-collapsible"
              : ""
          }`}
        >
          <div className={`page__content-header`}>
            <div className="page__controls">
              {this.props.controls.map((control, i) => (
                <button
                  key={`control-${control.name}-${i}`}
                  className="btn"
                  onClick={() => this.props.clickedControl(control)}
                >
                  {renderControlIcons(control)}
                </button>
              ))}
              <Fullscreen />
            </div>
          </div>
          {this.props.children}
          {this.props.timeline ? (
            <div className="page__content-footer">
              <Timeline
                time={this.props.time}
                day={this.props.day}
                update={this._updateTime}
              />
            </div>
          ) : null}
        </main>
      </div>
    );
  }
}

export default Layout;
