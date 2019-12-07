import React, { Component } from "react";

class DemoLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Title",
      sub_title: "Sub Title",
      editting: false
    };
    this.storeLabels = this.storeLabels.bind(this);
    this.edit = this.edit.bind(this);
  }

  handleTitle = e => {
    this.setState({ title: e.target.value });
  };

  handleSubTitle = e => {
    this.setState({ sub_title: e.target.value });
  };

  edit() {
    this.setState({ editting: !this.state.editting });
  }

  storeLabels() {
    localStorage.setItem("title", this.state.title);
    localStorage.setItem("sub_title", this.state.sub_title);
    this.setState({ editting: false });
  }

  componentDidMount() {
    this.setState({
      title: localStorage.getItem("title"),
      sub_title: localStorage.getItem("sub_title")
    });
  }

  render() {
    const { editting } = this.state;
    return (
      <div>
        <div className="panel" onClick={this.edit}>
          <div className="panel-body">
            <h3 className="mb-2">{this.state.title || "Default"}</h3>
            <h4 className="mb-0">{this.state.sub_title || "Default"}</h4>
          </div>
        </div>
        {editting ? (
          <div className="panel">
            <div className="panel-body">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={this.state.title}
                  onChange={this.handleTitle}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Sub Title</label>
                <input
                  type="text"
                  value={this.state.sub_title}
                  onChange={this.handleSubTitle}
                  className="form-control"
                />
              </div>
              <button
                className="btn btn-light btn-block"
                onClick={this.storeLabels}
              >
                Store
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default DemoLabel;
