import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const kc = window.keycloak;

  return (
    <Route
      {...rest}
      render={(props) => {
        const userInfo = Digit.SessionStorage.get("User");

        const userType = userInfo?.info?.type?.toLowerCase();

        const currentPath = props.location.pathname.toLowerCase();

        const isEmployeeRoute = currentPath.includes("/employee");

        const isCitizenRoute = currentPath.includes("/citizen");

        function getLoginRedirectionLink() {
          if (isEmployeeRoute) {
            return "/digit-ui/employee/user/login";
          }

          return "/digit-ui/citizen/login";
        }

        // Not authenticated
        if (!userInfo || !kc?.authenticated) {
          return (
            <Redirect
              to={{
                pathname: getLoginRedirectionLink(),
                state: {
                  from: props.location.pathname + props.location.search,
                },
              }}
            />
          );
        }

        // Prevent cross portal access
        const isUnauthorized = (isEmployeeRoute && userType === "citizen") || (isCitizenRoute && userType === "employee");

        if (isUnauthorized) {
          return (
            <Redirect
              to={{
                pathname: "/digit-ui/access-denied",
              }}
            />
          );
        }

        return <Component {...props} />;
      }}
    />
  );
};
