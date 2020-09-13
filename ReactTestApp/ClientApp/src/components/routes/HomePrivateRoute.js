import React from "react";
import { Route, Redirect } from "react-router-dom";

export const HomePrivateRoute = ({
  Cookies,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      Cookies.get("user") ? (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      ) : (
        <Component {...props} />
      )
    }
  />
);
