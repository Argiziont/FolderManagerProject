import React, { useState, useEffect } from "react";
import { FolderManagmentForm } from "../components";
import { userActions } from "../actions";
import { IFolder } from "../helpers";
import { FoldersTable } from "./FoldersTable";
import { useSignalr } from "@known-as-bmf/react-signalr";
interface FolderPageLayoutProps {
  SnackCallback(notiInfo: string[]): void;
  setConnectedState(connected: boolean): void;
}

export const FolderPageLayout: React.FC<FolderPageLayoutProps> = ({
  SnackCallback,
  setConnectedState,
}) => {
  const updateData = async () => {
    await userActions.loadFolders().then((data) => {
      setFolders(data);
      setLoading(false);
      setAutorized(true);
    });
  };

  const signalrEndpoint =
    "https://localhost:44396/hubs/Folders?token={" +
    JSON.parse(sessionStorage.getItem("user") || "[]").accessToken +
    "}";
  const [folders, setFolders] = useState<IFolder[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [autorized, setAutorized] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const { on } = useSignalr(signalrEndpoint);

  useEffect(() => {
    let cleanupFunction = false;

    const updateSub = on<any>("DataUpdate").subscribe(() => {
      if (!cleanupFunction) updateData();
    });
    const overloadSub = on<any>("Overload").subscribe(() => {
      if (!cleanupFunction) {
        userActions.logout();
        setConnected(false);
        SnackCallback([
          "Server is full, sorry, you are disconnected",
          "error",
          "Error",
        ]);
      }
    });
    const connectedSub = on<any>("ConnectionSuccessful").subscribe(() => {
      if (!cleanupFunction) {
        setConnected(true);
        setConnectedState(true);
      }
    });
    const disconnectSub = on<any>("Disconnection").subscribe(() => {
      if (!cleanupFunction) {
        setConnected(false);
        setConnectedState(false);
        setAutorized(false);
      }
    });

    return () => {
      updateSub.unsubscribe();
      overloadSub.unsubscribe();
      connectedSub.unsubscribe();
      disconnectSub.unsubscribe();
      cleanupFunction = true;
    };
  }, [on, SnackCallback, setConnectedState]);

  useEffect(() => {
    let cleanupFunction = false;
    if (!cleanupFunction) {
      updateData();
    }
    return () => {
      cleanupFunction = true;
    };
  }, []);

  return (
    <div>
      {connected && loading && autorized ? (
        <p> Loading... </p>
      ) : (
        <>
          <h1> Folders List </h1>

          <FoldersTable
            folders={folders}
            UpdateFoldedData={updateData}
            SnackCallback={SnackCallback}
          ></FoldersTable>
        </>
      )}
      <FolderManagmentForm
        UpdateData={() => updateData()}
        SnackNotification={SnackCallback}
      />
    </div>
  );
};
