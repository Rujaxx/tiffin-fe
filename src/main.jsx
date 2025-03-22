import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import AdminTable from "./pages/AdminPage/AdminTable";
import HomePage from "./pages/HomePage/HomePage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<AdminTable />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
