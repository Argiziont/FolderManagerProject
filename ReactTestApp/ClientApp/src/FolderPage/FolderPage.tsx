import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { FolderPageLayout } from "./FolderPageLayout";
import { HubConnection } from "@microsoft/signalr";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  mainframe: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

type FolderPageProps = {
  SnackCallback(notiInfo: string[]): void;
  SetConnection: Function;
  connection?: HubConnection;
};
export const FolderPage: React.FC<FolderPageProps> = ({
  SnackCallback,
  SetConnection,
  connection,
}) => {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.mainframe}>
          <FolderPageLayout
            SnackCallback={SnackCallback}
            connection={connection}
            SetConnection={SetConnection}
          />
        </div>
      </div>
    </Container>
  );
};
//export const FolderPage;
