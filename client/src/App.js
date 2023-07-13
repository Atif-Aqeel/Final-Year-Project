import React from "react";
import { Route, Routes } from "react-router-dom";
import "assests/sass/main.scss";

import Header from "components/ui/Header";
import Signup from "pages/Signup";
import Login from "pages/Login";
import SetPassword from "pages/SetPassword";
import Dashboard from "pages/Dashboard";

const App = (props) => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="signup" element={<Signup />} />
        <Route path="dashboard/*" element={<Dashboard />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
