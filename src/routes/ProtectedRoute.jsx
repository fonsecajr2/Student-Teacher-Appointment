// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

import { useProtected } from "../context/ProtectedContext";

// Componente que protege uma rota
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, role, loading } = useProtected();

  // Se nao estiver logado, renderiza o componente login
  if (!user) {
    return <Navigate to="/login" replace/>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace/>
  } 
  // Se estiver logado, redireciona para child div
  return children;
};

export default ProtectedRoute;
