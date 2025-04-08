// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Página Inicial</h1>
      <Link to="/login">Login</Link> | <Link to="/register">Cadastro</Link>
    </div>
  );
}
