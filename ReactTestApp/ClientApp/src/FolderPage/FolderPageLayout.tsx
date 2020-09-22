import React, { Component } from "react";
import { InteractiveList, DataForm } from "../components";
import { userActions } from "../actions";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";
//import { connection } from "../helpers";
interface Ifolder {
  item1: string;
  item2: string;
  item3: string[];
  item4: number[];
}
type FolderPageLayoutProps = {
  SnackCallback: Function;
  SetConnection: Function;
  connection?: HubConnection;
};
type FolderPageLayoutState = {
  folders: Ifolder[];
  loading: boolean;
  autorized: boolean;
};
export class FolderPageLayout extends Component<
  FolderPageLayoutProps,
  FolderPageLayoutState
> {
  static displayName = FolderPageLayout.name;
  state: FolderPageLayoutState = {
    folders: [],
    loading: true,
    autorized: false,
  };
  _isMounted: boolean = false;

  constructor(props: FolderPageLayoutProps) {
    super(props);
    this.updateData = this.updateData.bind(this);
  }

  async componentDidMount() {
    this._isMounted = true;
    if (
      this.props.connection &&
      this.props.connection.state === signalR.HubConnectionState.Disconnected
    ) {
      this.props.connection.start().then((result) => {
        this.props.connection &&
          this.props.connection.on("Notify", (message) => {});
        this.props.connection &&
          this.props.connection.on("DataUpdate", (message) => {
            this.updateData();
          });
        this.props.connection &&
          this.props.connection.on("Overload", (message) => {
            this.props.connection && this.props.connection.stop();
            userActions.logout();
          });
      });
    }
    await this.updateData();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.connection?.stop();
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
  static renderFoldersTable(
    folders: Ifolder[],
    UpdateFoldedData: Function,
    SnackCallback: Function
  ) {
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
}
