import React, { Component } from "react";
import DataForm from "./DataForm";
import { loadData } from "./RESTDataManagment";
export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { folders: [], loading: true };
    this.updateData = this.updateData.bind(this);
  }

  async componentDidMount() {
    await this.updateData();
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
        <DataForm UpdateData={async () => await this.updateData()} />
      </div>
    );
  }
  async updateData() {
    this.setState({
      folders: await loadData(),
      loading: false,
    });
  }
}
