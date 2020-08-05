import React, { Component } from "react";
import { DataForm } from "./DataForm";
//import { loadData } from "./RESTReqs";
export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { folders: [], loading: true };
    this.AddData = this.AddData.bind(this);
  }

  componentDidMount() {
    //const { data } = loadData();
    this.loadData();
    alert(JSON.stringify(this.state.folders));
    //this.setState({
    //  folders: data,
    //  loading: false,
    //});
  }

  static renderFoldersTable(folders) {
    return (
      <div>
        <table className="table table-striped" aria-labelledby="tabelLabel">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {folders.map((folder) => (
              <tr key={folder.id}>
                <td>{folder.id}</td>
                <td>{folder.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <DataForm AddPhone={this.AddPhone} />
      </div>
    );
  }
  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      FetchData.renderFoldersTable(this.state.folders)
    );

    return (
      <div>
        <h1 id="tabelLabel">Folders List</h1>
        {contents}
        <button className="btn btn-primary" onClick={this.AddData}>
          ADD
        </button>
      </div>
    );
  }

  async loadData() {
    const response = await fetch("Folder");
    const data = await response.json();
    this.setState({ folders: data, loading: false });
  }

  async AddData(data) {
    let Senddata = {
      //Name: data.Name,
      Name: "data.Name",
      File: null,
    };
    fetch("https://localhost:44396/Folder", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(Senddata),
    }).then((r) =>
      r.json().then((res) => {
        if (res) {
          this.loadData();
        }
      })
    );
  }
}
