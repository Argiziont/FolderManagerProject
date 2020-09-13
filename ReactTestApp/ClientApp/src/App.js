import "./custom.css";
import React, { Component } from "react";
import { Router } from "react-router";
import { LoginPrivateRoute, HomePrivateRoute } from "./components/routes";
import Cookies from "universal-cookie";

import { Layout } from "./Layout";
import FolderPage from "./FolderPage/FolderPage";
import { history } from "./helpers/history";

import SignInPage from "./LoginForm/SignInPage";
import SnackNotification from "./SnackNotification/SnackNotification";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifyText: "",
      notifyType: "",
      notifyHeader: "",
      notityReady: false,
    };
    history.listen((location, action) => {});
    this.SnackCallback = this.SnackCallback.bind(this);
  }
  static displayName = App.name;

  SnackCallback = (notiInfo) => {
    this.setState({
      notifyText: notiInfo[0],
      notifyType: notiInfo[1],
      notifyHeader: notiInfo[2],
      notityReady: true,
    });
  };

  render() {
    const cookies = new Cookies();
    return (
      <Layout>
        {this.state.notityReady && (
          <SnackNotification
            text={this.state.notifyText}
            type={this.state.notifyType}
            header={this.state.notifyHeader}
          ></SnackNotification>
        )}
        <Router history={history}>
          <LoginPrivateRoute
            exact
            path="/"
            component={() => <FolderPage SnackCallback={this.SnackCallback} />}
            Cookies={cookies}
          />
          <HomePrivateRoute
            exact
            path="/Login"
            component={() => <SignInPage SnackCallback={this.SnackCallback} />}
            Cookies={cookies}
          />
        </Router>
      </Layout>
    );
  }
}
