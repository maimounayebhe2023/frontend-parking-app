import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../hooks/useAuth";

const DashboardLayout = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={logout} />
      <main className="main-content">{children || <Outlet />}</main>
    </div>
  );
};

export default DashboardLayout;
