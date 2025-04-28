import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-400 text-center p-6">
      
      <h1 className="text-4xl font-bold text-red-600 mb-6">
        Access Denied
      </h1>

      <p className="text-lg text-white mb-8 max-w-md">
        You do not have permission to access this page.
      </p>

      <Link
        to="/login"
        className="bg-white text-amber-500 font-semibold px-6 py-3 rounded-lg shadow hover:bg-amber-100 transition duration-300"
      >
        Back to Login
      </Link>

    </div>
  );
};

export default Unauthorized;
