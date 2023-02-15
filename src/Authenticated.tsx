import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Header, UserHelper } from "./components";

// import UserContext from "./UserContext";

export const Authenticated: React.FC = () => {

  if (UserHelper.churchChanged) {
    UserHelper.churchChanged = false;
    return <Navigate to="/" />
  }
  else return (
    <>
      <Header></Header>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Navigate to={window.location.pathname} />} />
        </Routes>
      </div>
    </>
  );
};
