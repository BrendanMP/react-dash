import React, { Component } from "react";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };
  }

  render() {
    const { data } = this.state;
    const { title } = this.props;

    return (
      <div className="dashboard">
        <div className="dashboard__nav">
          <button className="btn btn-lg text-left">Aggregate</button>
          <button className="btn btn-lg text-left">Change</button>
        </div>
        <div className="dashboard__content">
          <header className="mb-4">
            <h1>{title || "No Title"}</h1>
          </header>
          <main className="pr-5">
            {data.map((item, i) => (
              <div className="dashboard__rankings">
                <div className="panel">
                  <div className="panel-body h4 mb-0 flex-grow-0">#{i + 1}</div>
                  <div className="panel-body flex-grow-1">
                    <div>{item.name || "no name"}</div>
                    <div>
                      <span className="badge">Good</span>
                    </div>
                    <div>326 Accidents</div>
                    <div>0.04 / Vehicle</div>
                  </div>
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    );
  }
}

export default Dashboard;
