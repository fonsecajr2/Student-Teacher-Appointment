// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rota protegida */}
        <Route
          path="/dashboard/student"
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/teacher"
          element={
            <PrivateRoute>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
