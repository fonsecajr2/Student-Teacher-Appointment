// src/pages/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acesso negado</h1>
      <p className="text-lg mb-6">Você não tem permissão para acessar esta página.</p>
      <Link
        to="/login"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Voltar para o Login
      </Link>
    </div>
  );
};

export default Unauthorized;
