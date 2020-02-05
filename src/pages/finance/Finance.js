import React, { Component } from "react";
import axios from "axios";

import Layout from "../../components/Layout";
import Dashboard from "../../components/Dashboard";
import Ministries from "../../components/Ministries";

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
          active: false,
          submenuCollapsible: false,
          controls: [],
          data: FINANCE_JSON.data,
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
        },
        {
          name: "ministries",
          label: "Ministries",
          active: true,
          submenuCollapsible: false,
          controls: [],
          data: FINANCE_JSON.data,
          submenu: []
        }
      ],
      data: []
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
    const { views } = this.state;
    const active = views.find(view => view.active === true);

    active.submenu.map(item => {
      item.name === name ? (item.active = true) : (item.active = false);
      return item;
    });

    this.setState({ views });
  }

  async componentDidMount() {
    const { views } = this.state;
    try {
      const projects = await axios.get(
        `https://tl-socket-server.herokuapp.com/api/projects`
      );
      const ministries = await axios.get(
        `https://tl-socket-server.herokuapp.com/api/ministries`
      );

      const menu = ministries.data
        .map(item => {
          item.name = item.id;
          item.label = item.labelshort;
          return item;
        })
        .sort((a, b) => (a.labelshort > b.labelshort ? 1 : -1));

      menu[0].active = true;

      views.find(item => item.name === "ministries").submenu = menu;

      this.setState({ data: projects.data, views });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { views, data, ministries } = this.state;
    const active = views.find(view => view.active === true);
    return (
      <Layout
        views={views}
        submenu={active.submenu}
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
                views={view.submenu}
              ></Dashboard>
            ) : null}

            {view.name === "ministries" ? (
              <Ministries view={active} data={data} />
            ) : null}
          </div>
        ))}
      </Layout>
    );
  }
}

export default Finance;
