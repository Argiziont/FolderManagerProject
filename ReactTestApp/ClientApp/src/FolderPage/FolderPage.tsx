import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { FolderPageLayout } from "./FolderPageLayout";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  mainframe: {
    width: "100%", // Fix issue.
    marginTop: theme.spacing(1),
  },
}));

interface FolderPageProps {
  SnackCallback(notiInfo: string[]): void;
  setConnected(connected: boolean): void;
}
export const FolderPage: React.FC<FolderPageProps> = ({
  SnackCallback,
  setConnected,
}) => {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.mainframe}>
          <FolderPageLayout
            setConnectedState={setConnected}
            SnackCallback={SnackCallback}
          />
        </div>
      </div>
    </Container>
  );
};
