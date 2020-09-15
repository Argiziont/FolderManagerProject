import React, { Component } from "react";
import DataForm from "../components//DataForm";
//import {  } from "./RESTDataManagment";
import InteractiveList from "../components/InteractiveList";
import { userActions } from "../actions";

export class FolderPageLayout extends Component {
  static displayName = FolderPageLayout.name;

  constructor(props) {
    super(props);
    this.state = {
      folders: [],
      loading: true,
      autorized: false,
    };
    this.updateData = this.updateData.bind(this);
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    await this.updateData();
    // userActions.getAllUsers().then((response) => {
    //   if (typeof response !== "string") {
    //     this.setState({
    //       autorized: true,
    //     });
    //   }
    // });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  static renderFoldersTable(folders, UpdateFoldedData, SnackCallback) {
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
              userActions.deleteFolder(
                folder.item1,
                () => UpdateFoldedData(),
                SnackCallback
              )
            }
            UpdateHandler={() => UpdateFoldedData()}
            SnackCallback={SnackCallback}
          ></InteractiveList>
        ))}
      </div>
    );
  }
  render() {
    let contents =
      this.state.loading && this.state.autorized ? (
        <p>
          <em> Loading... </em>
        </p>
      ) : (
        FolderPageLayout.renderFoldersTable(
          this.state.folders,
          () => this.updateData(),
          this.props.SnackCallback
        )
      );

    return (
      <div>
        <h1 id="tabelLabel"> Folders List </h1> {contents}
        <DataForm
          UpdateData={() => this.updateData()}
          SnackNotification={this.props.SnackCallback}
        />
      </div>
    );
  }
  async updateData() {
    await userActions.loadFolders().then((data) => {
      this._isMounted &&
        this.setState({
          folders: data,
          loading: false,
          autorized: true,
        });
    });
  }
}
