import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../../helper/Helper";
import Register from "../register/Signup";

const REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Login = () => {
  const [authInput, setAuthInput] = useState({
    email: "",
    password: "",
  }); 

  //validation
  const [validEmail, setValidEmail] = useState(false);  
  const [validPassword, setValidPassword] = useState(false);

  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );  

  const navigate = useNavigate();

    useEffect(()=>{
      if(token){
        navigate("/dashboard")
      }
    },[])


  const onClickSignInButton = () => {
    if (
      authInput.email.trim().length === 0 &&
      authInput.password.trim().length === 0
    ) {
      setValidEmail(true);
      setValidPassword(true);
    }
    if (authInput.email.trim().length === 0) {
      setValidEmail(true);
    } else if (!authInput.email.trim().match(REGEX)) {
      toast.error("Please Input Valid Email Address", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (authInput.password.trim().length === 0) {
      setValidPassword(true);
    } else {
      var urlencoded = new URLSearchParams();
      urlencoded.append("email", authInput.email);
      urlencoded.append("password", authInput.password);
      fetch(`${API_URL}/api/admin/AdminSignin`, {
        method: "POST",
        body: urlencoded,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.status === 200) {
            localStorage.setItem("token", data.token);
            toast.success(data.message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            navigate("/dashboard");
          } else {
            toast.error(data.message, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onChangeEmailInput = (e) => {
    if (e.target.value.trim().length === 0) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
    setAuthInput({ ...authInput, email: e.target.value });
  };

  const onChangePasswordInput = (e) => {
    if (e.target.value.trim().length === 0) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
    setAuthInput({ ...authInput, password: e.target.value });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={5}
        sx={{
          marginTop: "50px",
          width: "100%",
          maxWidth: "450px",
          height: "50%",
          padding: "20px",
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight={"600"}>
          GREEN CERT
        </Typography>
        <Box>
          <TextField
            value={authInput.email}
            onChange={onChangeEmailInput}
            label="Email address"
            error={validEmail && true}
            sx={{ width: "100%", marginTop: "30px !important" }}
            variant="outlined"
          />
          <Typography variant="body1" color="red">
            {validEmail && "Please input email address"}
          </Typography>
          <TextField
            value={authInput.password}
            onChange={onChangePasswordInput}
            error={validPassword && true}
            label="Password"
            type={"password"}
            sx={{ width: "100%", marginTop: "30px !important" }}
            variant="outlined"
          />
          {validPassword && (
            <Typography variant="body1" color="red">
              Please input password
            </Typography>
          )}
        </Box>
        <Box
          sx={{ display: "flex", justifyContent: "center", margin: "30px 0" }}
        >
          <Button
            variant="contained"
            sx={{ padding: "8px 40px 8px 40px", fontWeight: "700" }}
            onClick={onClickSignInButton}
          >
            Sign In
          </Button>
        </Box>
        <Link to="/register" style={{ textAlign: "center" }}>
          <Typography>Register</Typography>
        </Link>
      </Paper>
      {/* <Routes>
        <Route path="/register" element={<Register/>}/>
      </Routes> */}
    </Box>
  );
};

export default Login;
