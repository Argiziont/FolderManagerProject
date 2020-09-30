import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

interface HomePrivateRouteProps extends RouteProps {
  // tslint:disable-next-line:no-any
  component: any;
}

//export  const HomePrivateRoute: React.FC<HomePrivateRouteProps> = ({ component, ...rest })=>{
export const HomePrivateRoute = (props: HomePrivateRouteProps) => {
  const { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={(props) =>
        sessionStorage.getItem("user") ? (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
