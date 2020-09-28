import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import registerServiceWorker from "./services/registerServiceWorker";
import { SnackbarProvider } from "notistack";

import { SnackMessage } from "./SnackNotification";
import { AppPage } from "./AppPage";

const baseUrl = document
  .getElementsByTagName("base")[0]
  .getAttribute("href") as string;
const rootElement = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <SnackbarProvider
      maxSnack={3}
      content={(key: string, message: string[]) =>
        message && <SnackMessage id={key.toString()} message={message} />
      }
    >
      <AppPage />
    </SnackbarProvider>
  </BrowserRouter>,
  rootElement
);

registerServiceWorker();
