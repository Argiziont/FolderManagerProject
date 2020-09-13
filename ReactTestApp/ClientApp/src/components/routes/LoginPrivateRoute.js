import React from "react";
import { Route, Redirect } from "react-router-dom";

export const LoginPrivateRoute = ({
  Cookies,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      Cookies.get("user") ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/Login", state: { from: props.location } }}
        />
      )
    }
  />
);
