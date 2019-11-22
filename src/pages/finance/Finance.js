import React, { Component } from "react";

import Layout from "../../components/Layout";
import Dashboard from "../../components/Dashboard";

import FINANCE_JSON from "../../data/finance/finance";

const MINISTRIES = [
  ...new Set(FINANCE_JSON.data.map(item => item.project_ministry))
];

const MINISTSRIES_SET = MINISTRIES.map((item, i) => {
  return {
    name: item
      .toLowerCase()
      .split(" ")
      .join("_"),
    label: item,
    active: false,
    ranges: []
  };
});

const STATUS = [...new Set(FINANCE_JSON.data.map(item => item.project_status))];

const STATUS_SET = STATUS.map((item, i) => {
  return {
    name: item
      .toLowerCase()
      .split(" ")
      .join("_"),
    label: item,
    active: false,
    ranges: []
  };
});

class Finance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      views: [
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
          name: "project_status",
          label: "Status",
          title: "Projects",
          active: true,
          sets: [
            {
              name: "all",
              label: "All",
              title: "All Projects",
              active: true,
              ranges: []
            },
            ...STATUS_SET
          ]
        },
        {
          name: "ministry",
          label: "Ministry",
          title: "Ministry of",
          active: false,
          sets: [
            {
              name: "all",
              label: "All",
              title: "All Ministries",
              active: true,
              ranges: []
            },
            ...MINISTSRIES_SET
          ]
        },
        {
          name: "frozen",
          label: "Frozen",
          active: false,
          sets: [
            {
              name: "frozen",
              label: "Frozen",
              title: "Frozen Projects",
              active: true,
              ranges: []
            }
          ]
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
                data={view.data}
                type={"finance"}
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
