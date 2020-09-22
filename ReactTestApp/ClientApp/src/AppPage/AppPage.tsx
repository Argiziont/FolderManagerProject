import React, { useState } from "react";
import { Router } from "react-router";
import { LoginPrivateRoute, HomePrivateRoute } from "../components/routes";
import { HubConnection } from "@microsoft/signalr";

import { Layout } from "../Layout";
import { FolderPage } from "../FolderPage/";
import { history } from "../helpers/history";

import { SignInPage } from "../LoginForm";
import { SnackNotification } from "../SnackNotification/SnackNotification";

// const SnackCallback: React.FC<string[]> = (notiInfo) => {
//   this.setState({
//     notifyText: notiInfo[0],
//     notifyType: notiInfo[1],
//     notifyHeader: notiInfo[2],
//     notityReady: true,
//   });
// };

export const AppPage: React.FC = () => {
  history.listen((location, action) => {});
  const [snackCallback, SetSnackCallback] = useState<string[]>();
  const [connection, SetConnection] = useState<HubConnection>();

  return (
    <Layout connection={connection}>
      {snackCallback && (
        <SnackNotification
          text={snackCallback[0]}
          type={snackCallback[1]}
          header={snackCallback[2]}
        ></SnackNotification>
      )}
      <Router history={history}>
        <LoginPrivateRoute
          exact
          path="/"
          component={() => (
            <FolderPage
              SnackCallback={SetSnackCallback}
              connection={connection}
              SetConnection={SetConnection}
            />
          )}
        />
        <HomePrivateRoute
          exact
          path="/Login"
          component={() => (
            <SignInPage
              SnackCallback={SetSnackCallback}
              SetConnection={SetConnection}
            />
          )}
        />
      </Router>
    </Layout>
  );
};
