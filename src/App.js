import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/antd.min.css";
import "./index.css";
import AdminLayout from "./layout/AdminLayout";
function App() {
  return (
    <>
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    </>
  );
}

export default App;
