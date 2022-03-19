import React from "react";
import UserContext from "./UserContext";

import { ApiHelper } from "./components";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Login } from "./Login";

import { Authenticated } from "./Authenticated";
import { Logout } from "./Logout";
import ReactGA from "react-ga";
import { EnvironmentHelper } from "./helpers";
import { Home } from "./Home";

export const ControlPanel = () => {
  console.log("***CONTROL PANEL")

  const location = useLocation();
  if (EnvironmentHelper.GoogleAnalyticsTag !== "") {
    ReactGA.initialize(EnvironmentHelper.GoogleAnalyticsTag);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
  React.useEffect(() => { if (EnvironmentHelper.GoogleAnalyticsTag !== "") ReactGA.pageview(location.pathname + location.search); }, [location]);

  let user = React.useContext(UserContext).userName; //to force rerender on login
  if (user === null) return null;
  return (
    <Routes>
      <Route path="/logout" element={<Logout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Authenticated />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation()
  if (!ApiHelper.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

