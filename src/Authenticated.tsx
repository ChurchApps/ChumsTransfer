import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Header, UserHelper } from "./components";
import { Settings } from "./settings/Settings";

// import UserContext from "./UserContext";

export const Authenticated: React.FC = () => {
  //to force rerender on login
  // var user = React.useContext(UserContext)?.userName;
  // var church = React.useContext(UserContext)?.churchName;

  if (UserHelper.churchChanged) {
    UserHelper.churchChanged = false;
    return <Navigate to="/people" />
  }
  else return (
    <>
      <Header></Header>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Navigate to={window.location.pathname} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </>
  );
};
