import React, { Component } from "react";
import PieChart from "./charts/PieChart";
import Rollover from "./Rollover";

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context("../images/ministry/", false, /\.(png|jpe?g|svg)$/)
);

const getTotal = (arr, key) => {
  let initialValue = 0;
  return arr
    .reduce(function(total, currentValue) {
      return total + Number(currentValue[key]);
    }, initialValue)
    .toFixed(0);
};

const getBorderColor = item => {
  switch (item.projectstatus) {
    case "Completed":
      return "panel--success";
    case "Awaiting feasability study":
      return "panel--danger";
    case "Financed":
      return "panel--warning";
  }
};

const formatDollars = num => {
  if (isNaN(num)) return num;

  if (num < 9999) {
    return num;
  }

  if (num < 1000000) {
    return Math.round(num / 1000) + "K";
  }

  if (num < 100000000000000) {
    return "$" + Math.round(num / 1000000).toLocaleString() + "M";
  }
};

class Ministries extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { view, data } = this.props;

    const active = view.submenu.find(item => item.active);

    if (active) {
      active.image = images.find(str => str.includes(active.name));
    }

    const filteredData = data.filter(item => {
      if (item.projectministryid === active.name) {
        return true;
      }
    });

    const total_all = getTotal(data, "projectcostusd");
    const total_proposed = getTotal(filteredData, "projectcostusd");
    const total_financed = getTotal(
      filteredData.filter(
        item =>
          item.projectstatus === "Completed" ||
          item.projectstatus === "Financed"
      ),
      "projectcostfcfabillions"
    );
    const total_frozen = getTotal(
      filteredData.filter(
        item => item.projectstatus === "Awaiting feasability study"
      ),
      "projectcostfcfabillions"
    );

    let completed = 0;
    let inProgress = 0;
    let awaiting = 0;
    let studied = 0;
    let frozen = 0;
    let unfrozen = 0;

    filteredData.map(item => {
      if (item.projectstatus === "Completed") {
        completed = completed + Number(item.projectcostusd);
      }

      if (item.projectstatus === "Awaiting feasability study") {
        awaiting = awaiting + Number(item.projectcostusd);
      }

      if (item.projectstatus === "Financed") {
        inProgress = inProgress + Number(item.projectcostusd);
      }

      if (item.projectstatus === "Studied and awaiting financing") {
        studied = studied + Number(item.projectcostusd);
      }

      if (item.frozen === "yes") {
        frozen = frozen + Number(item.projectcostusd);
      } else {
        unfrozen = unfrozen + Number(item.projectcostusd);
      }
    });

    const proposed = {
      labels: ["Financed", "Frozen"],
      datasets: [
        {
          data: [unfrozen, studied, frozen],
          backgroundColor: [
            "rgba(32, 201, 151, 0.8)",
            "rgba(255, 193, 7, 0.8)",
            "rgba(220, 53, 69, 0.8)"
          ],
          borderColor: "rgba(33,36,41, 0.8)",
          borderWidth: 2
        }
      ]
    };

    const completion = {
      labels: ["Completed", "In Progress", "Frozen"],
      datasets: [
        {
          data: [completed, frozen, awaiting],
          backgroundColor: [
            "rgba(32, 201, 151, 0.8)",
            "rgba(255, 193, 7, 0.8)",
            "rgba(220, 53, 69, 0.8)"
          ],

          borderColor: "rgba(33,36,41, 0.8)",
          borderWidth: 2
        }
      ]
    };

    return (
      <div>
        {active ? (
          <div>
            <div className="dashboard__nav" style={{ paddingTop: "3rem" }}>
              <h1 className="text-white mb-3">{active.labelfull}</h1>
            </div>
            <div className="dashboard__content py-5">
              <div className="row">
                <div className="col">
                  <div className="row">
                    <div className="col-12">
                      <div className="panel projects-stats">
                        <div className="panel-body flex-grow-1">
                          <div className="row">
                            <div className="col">
                              <h5 className="mb-3">Ministry Total Proposed</h5>
                              <h2>{formatDollars(total_proposed)}</h2>
                            </div>
                            <div className="col">
                              <h5 className="mb-3">Percent of All Proposed</h5>
                              <h2 className="mb-0">
                                {((total_proposed / total_all) * 100).toFixed(
                                  2
                                )}
                                %
                              </h2>
                            </div>
                            <div className="col">
                              <h5 className="mb-3">Financed Projects</h5>
                              <h2>
                                <Rollover
                                  init={
                                    filteredData.filter(
                                      item => item.projectstatus === "Financed"
                                    ).length
                                  }
                                  hover={formatDollars(inProgress)}
                                />
                              </h2>
                            </div>
                            <div className="col">
                              <h5 className="mb-3">Frozen Projects</h5>
                              <h2>
                                <Rollover
                                  init={
                                    filteredData.filter(
                                      item => item.frozen === "yes"
                                    ).length
                                  }
                                  hover={formatDollars(frozen)}
                                />
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col d-flex flex-column">
                      <div className="panel flex-grow-1 mb-0">
                        <div className="row panel-body flex-grow-1">
                          <div className="col-12">
                            <h3 className="header-label mb-4">
                              Total Proposed
                            </h3>
                          </div>
                          <div className="col-7 d-flex flex-column justify-content-center">
                            <div className="mx-4">
                              <PieChart data={proposed} />
                            </div>
                          </div>
                          <div className="col d-flex flex-column justify-content-center">
                            <div className="mb-4">
                              <h5 className="legend-label">Financed</h5>
                              <h1 className="mb-0 legend-item">
                                <span
                                  className="legend-square"
                                  style={{
                                    backgroundColor:
                                      proposed.datasets[0].backgroundColor[0]
                                  }}
                                ></span>
                                {formatDollars(unfrozen)}
                                {/*{unfrozen.toFixed(0)}*/}
                              </h1>
                            </div>
                            <div className="mb-4">
                              <h5 className="legend-label">
                                Awaiting Financing
                              </h5>
                              <h1 className="mb-0 legend-item">
                                <span
                                  className="legend-square"
                                  style={{
                                    backgroundColor:
                                      proposed.datasets[0].backgroundColor[1]
                                  }}
                                ></span>
                                {formatDollars(studied)}
                              </h1>
                            </div>
                            <div className="mb-0">
                              <h5 className="legend-label">
                                Awaiting Feasibilty Study
                              </h5>
                              <h1 className="mb-0 legend-item">
                                <span
                                  className="legend-square"
                                  style={{
                                    backgroundColor:
                                      proposed.datasets[0].backgroundColor[2]
                                  }}
                                ></span>
                                {formatDollars(frozen)}
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col d-flex flex-column">
                      <div className="panel flex-grow-1 mb-0">
                        <div className="row panel-body flex-grow-1">
                          <div className="col-12">
                            <h3 className="header-label mb-4">
                              Completion Status
                            </h3>
                          </div>
                          <div className="col-7 d-flex flex-column justify-content-center">
                            <div className="mx-4">
                              <PieChart data={completion} />
                            </div>
                          </div>
                          <div className="col d-flex flex-column justify-content-center">
                            <div className="mb-4">
                              <h5 className="legend-label">Completed</h5>
                              <h1 className="mb-0 legend-item">
                                <span
                                  className="legend-square"
                                  style={{
                                    backgroundColor:
                                      completion.datasets[0].backgroundColor[0]
                                  }}
                                ></span>
                                {formatDollars(completed)}
                              </h1>
                            </div>
                            <div className="mb-4">
                              <h5 className="legend-label">In Progress</h5>
                              <h1 className="mb-0 legend-item">
                                <span
                                  className="legend-square"
                                  style={{
                                    backgroundColor:
                                      completion.datasets[0].backgroundColor[1]
                                  }}
                                ></span>
                                {formatDollars(inProgress)}
                              </h1>
                            </div>
                            <div className="mb-0">
                              <h5 className="legend-label">Frozen</h5>
                              <h1 className="mb-0 legend-item">
                                <span
                                  className="legend-square"
                                  style={{
                                    backgroundColor:
                                      completion.datasets[0].backgroundColor[2]
                                  }}
                                ></span>
                                {formatDollars(awaiting)}
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <article className="mt-5">
                    <h3 className="header-label mb-4">Projects</h3>
                    <div className="row">
                      {filteredData.map(item => (
                        <div
                          key={item.id}
                          className="col-4 mb-3 d-flex flex-column"
                        >
                          <div
                            className={`panel flex-grow-1 ${getBorderColor(
                              item
                            )}`}
                          >
                            <div className="panel-body flex-grow-1">
                              <h5 className="text-white">{item.project}</h5>
                              <p className="mb-0">{item.projectstatus}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
                <div className="col-3">
                  <div className="" style={{ position: "sticky", top: 85 }}>
                    <div className="panel-body flex-grow-1 pb-4">
                      <div
                        className="img-square mb-4"
                        style={{ backgroundImage: `url(${active.image})` }}
                      ></div>
                      <h5>Minister</h5>
                      <h3 className="mb-0 text-white">{active.ministername}</h3>
                      <div className="row">
                        <div className="col">
                          <div className="mt-4">
                            <h5>Time In Office</h5>
                            <h3 className="text-white">
                              {active.ministerterm} Months
                            </h3>
                          </div>
                        </div>
                        <div className="col">
                          <div className="mt-4">
                            <h5>Metric</h5>
                            <h3 className="text-white">+1</h3>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h5>Minister's Chief of Staff</h5>
                        <div className="text-white">
                          <div className="d-flex justify-content-between">
                            <span>Name</span>
                            <span style={{ whiteSpace: "nowrap" }}>
                              {active.ministercos}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Email</span>
                            <span>Unknown</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Phone</span>
                            <span>Unknown</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="">Secondary Phone</span>
                            <span>Unknown</span>
                          </div>
                        </div>
                        <div className="mt-5 pt-3">
                          <button className="btn btn-outline-primary rounded-0 w-100">
                            View Rankings
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Ministries;
