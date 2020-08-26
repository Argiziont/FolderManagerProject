import React, { Component } from "react";
import DataForm from "./DataForm";
import { loadData, DeleteFolder, DeleteFile } from "./RESTDataManagment";
//import {  } from "./RESTDataManagment";
import InteractiveList from "./ExperementalList";

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = {
      folders: [],
      loading: true,
    };
    this.updateData = this.updateData.bind(this);
  }

  async componentDidMount() {
    await this.updateData();
  }

  static renderFoldersTable(folders, UpdateFoldedData) {
    return (
      <div>
        {folders.map((folder) => (
          <InteractiveList
            key={folder.item1}
            FolderName={folder.item2}
            FilesNamesArray={folder.item3}
            FilesIdsArray={folder.item4}
            FolderId={folder.item1}
            DeleteHandler={async () =>
              await DeleteFolder(folder.item1, () => UpdateFoldedData())
            }
            UpdateHandler={() => UpdateFoldedData()}
          ></InteractiveList>
        ))}
      </div>
    );
  }
  render() {
    let contents = this.state.loading ? (
      <p>
        <em> Loading... </em>
      </p>
    ) : (
      FetchData.renderFoldersTable(
        this.state.folders,
        async () => await this.updateData()
      )
    );

    return (
      <div>
        <h1 id="tabelLabel"> Folders List </h1> {contents}
        <DataForm UpdateData={async () => await this.updateData()} />
        <h3>File Upload using React!</h3>
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
