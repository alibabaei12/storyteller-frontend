import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// PrivateRoute component to wrap routes that require authentication
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the children (protected route)
  return children;
};

export default PrivateRoute;
