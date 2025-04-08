import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="bg-yellow-500 min-h-screen">
      {user ? (
        <h1>Bem-vindo, {user.email}</h1>
      ) : (
        <p>Carregando usuário...</p>
      )}
    </div>
  );
}
