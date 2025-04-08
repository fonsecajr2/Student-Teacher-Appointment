// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Componente que protege uma rota
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // Se estiver logado, renderiza o componente normalmente
  if (user) {
    return children;
  }

  // Se não estiver logado, redireciona para /login
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
