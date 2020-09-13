import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import { SnackbarProvider } from "notistack";

import SnackMessage from "./SnackNotification/SnackMessage";

import App from "./App";
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const rootElement = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <SnackbarProvider
      maxSnack={3}
      content={(key, message) => <SnackMessage id={key} message={message} />}
    >
      <App />
    </SnackbarProvider>
  </BrowserRouter>,
  rootElement
);

registerServiceWorker();
