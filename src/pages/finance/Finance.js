import React, { Component } from "react";

import Layout from "../../components/Layout";
import Dashboard from "../../components/Dashboard";

import FINANCE_JSON from "../../data/finance/finance";

class Finance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      views: [
        {
          name: "map",
          label: "Map",
          active: false,
          submenuCollapsible: true,
          controls: []
        },
        {
          name: "dashboard",
          label: "Dashboard",
          active: true,
          submenuCollapsible: false,
          controls: [],
          data: FINANCE_JSON.data
        }
      ],
      submenu: [
        {
          name: "ministry",
          label: "Ministry",
          active: true
        },
        {
          name: "progress",
          label: "Progress",
          active: false
        }
      ],
      sets: [
        {
          name: "ministry",
          label: "Ministy",
          active: true,
          ranges: []
        },
        {
          name: "progress",
          label: "Progress",
          active: false,
          ranges: []
        }
      ]
    };
    this._changeView = this._changeView.bind(this);
    this._clickedSubMenu = this._clickedSubMenu.bind(this);
  }

  _changeView(name) {
    const { views } = this.state;
    const active = views.find(view => view.name === name);
    views.map(view => {
      view === active ? (view.active = true) : (view.active = false);
      return view;
    });
    this.setState({ views });
  }

  _clickedSubMenu(name, view) {
    const { views, submenu } = this.state;
    const active = submenu.find(view => view.active === true);

    submenu.map(item => {
      item.name === name ? (item.active = true) : (item.active = false);
      return item;
    });

    this.setState({ submenu });
  }

  render() {
    const { views, submenu, sets } = this.state;
    const active = views.find(view => view.active === true);
    return (
      <Layout
        views={views}
        submenu={submenu}
        controls={active.controls}
        changeView={this._changeView}
        clickedSubMenu={this._clickedSubMenu}
      >
        {views.map((view, i) => (
          <div
            key={i}
            className={`page__content-view ${
              active.name === view.name ? "active" : ""
            }`}
          >
            {view.name === "dashboard" ? (
              <Dashboard
                sets={sets}
                data={view.data}
                views={submenu}
              ></Dashboard>
            ) : null}
          </div>
        ))}
      </Layout>
    );
  }
}

export default Finance;
