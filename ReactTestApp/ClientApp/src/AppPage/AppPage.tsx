import React, { useRef } from "react";
import { Router } from "react-router";
import { LoginPrivateRoute, HomePrivateRoute } from "../components/routes";
import { useSnackbar } from "notistack";

import { Layout } from "../Layout";
import { FolderPage } from "../FolderPage/";
import { history } from "../helpers";

import { SignInPage } from "../LoginForm";

export const AppPage: React.FC = () => {
  history.listen((location, action) => {});
  const { enqueueSnackbar } = useSnackbar();
  const handleConnected = (connected: boolean) => {
    NavBarRef.current.connectionChange(connected);
  };
  const NavBarRef = useRef<any>();
  const SetSnackCallback = (snackCallback: string[]) => {
    if (
      snackCallback[0] !== "" &&
      snackCallback[1] !== "" &&
      snackCallback[2] !== ""
    ) {
      enqueueSnackbar(snackCallback, {
        variant: "info",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        key: snackCallback[0],
        preventDuplicate: true,
      });
    }
  };

  return (
    <Layout NavBarRef={NavBarRef} connected={true}>
      <Router history={history}>
        <LoginPrivateRoute
          exact
          path="/"
          component={() => (
            <FolderPage
              setConnected={handleConnected}
              SnackCallback={SetSnackCallback}
            />
          )}
        />
        <HomePrivateRoute
          exact
          path="/Login"
          component={() => (
            <SignInPage
              setConnected={handleConnected}
              SnackCallback={SetSnackCallback}
            />
          )}
        />
      </Router>
    </Layout>
  );
};
