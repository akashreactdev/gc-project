import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Club from "../pages/club/Club";
import Member from "../pages/member/Member";
import Work from "../pages/work/Work";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClubMember from "../pages/clubmember/ClubMember";

const AppRoute = () => {
  // const [token, setToken] = useState(
  //   localStorage.getItem("token") ? localStorage.getItem("token") : null
  // );

  // console.log("token",token)

  // const PrivateRoute = ({ children }) => {
  //   return token ? children : <Navigate to="/login" />;
  // };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/club" element={<Club />} />
        <Route path="/member" element={<Member />} />
        <Route path="/work" element={<Work />} />
        <Route path="/clubmember/:ids" element={<ClubMember />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        // closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default AppRoute;
