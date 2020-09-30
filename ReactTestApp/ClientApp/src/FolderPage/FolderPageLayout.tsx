import React, { useState, useEffect } from "react";
import { useSignalr } from "@known-as-bmf/react-signalr";
import { debounceTime } from "rxjs/operators";

import { FolderManagmentForm } from "../components";
import { userActions } from "../actions";
import { IFolder } from "../helpers";
import { FoldersTable } from "./FoldersTable";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [autorized, setAutorized] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const { on } = useSignalr(signalrEndpoint);

  useEffect(() => {
    let cleanupFunction = false;

    const updateSub = on<any>("DataUpdate")
      .pipe(debounceTime(200))
      .subscribe(() => {
        if (!cleanupFunction) updateData();
      });
    const overloadSub = on<any>("Overload")
      .pipe(debounceTime(200))
      .subscribe(() => {
        if (!cleanupFunction) {
          userActions.logout();
          setConnected(false);
          setConnectedState(false);
          SnackCallback([
            "Server is full, sorry, you are disconnected",
            "error",
            "Error",
          ]);
        }
      });
    const connectedSub = on<any>("ConnectionSuccessful")
      .pipe(debounceTime(200))
      .subscribe(() => {
        if (!cleanupFunction) {
          setConnected(true);
          setConnectedState(true);
        }
      });
    const disconnectSub = on<any>("Disconnection")
      .pipe(debounceTime(200))
      .subscribe(() => {
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
  }, [on, setConnectedState, SnackCallback]);

  return (
    <div>
      {!connected || loading || !autorized ? (
        <p> Loading... </p>
      ) : (
        <>
          <h1> Folders List </h1>

          <FoldersTable
            folders={folders}
            UpdateFoldedData={updateData}
            SnackCallback={SnackCallback}
          ></FoldersTable>
          <FolderManagmentForm
            UpdateData={() => updateData()}
            SnackNotification={SnackCallback}
          />
        </>
      )}
    </div>
  );
};
