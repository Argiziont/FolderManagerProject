import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface LoginPrivateRouteProps extends RouteProps {
  // tslint:disable-next-line:no-any
  component: any;
}

//export  const HomePrivateRoute: React.FC<HomePrivateRouteProps> = ({ component, ...rest })=>{
export const LoginPrivateRoute = (props: LoginPrivateRouteProps) => {
  const { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={(props) =>
        sessionStorage.getItem("user") ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/Login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};
