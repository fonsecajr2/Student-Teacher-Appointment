import { useState } from 'react';
import { signUp } from '../services/auth';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Criação do usuário no Firebase Auth
      const { user } = await signUp(form.email, form.password);

      // Criação do documento no Firestore com status: "pending"
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
        role: "student",
        status: "pending",
        createdAt: new Date(),
    });

    navigate("/login"); // Redireciona para login, não para o dashboard
    alert("Register Sended. Wait for aproval");

    } catch (error) {
      console.error(error);
      setError("Erro ao registrar: " + error.message);
    }
  };

  return (
    <div className='bg-amber-500 min-h-screen flex justify-center items-center'>
      <form onSubmit={handleSubmit} className='bg-white p-6 rounded shadow-md w-full max-w-sm'>
        <h2 className='text-xl font-bold mb-4 text-center'>Cadastro de Estudante</h2>

        <input
          type="text"
          name='name'
          value={form.name}
          placeholder='Seu nome'
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="email"
          name='email'
          value={form.email}
          placeholder='email@gmail.com'
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="password"
          name='password'
          value={form.password}
          placeholder='Sua senha'
          onChange={handleChange}
          required
          className="w-full p-2 mb-3 border rounded"
        />

        {error && <p className='text-red-600 mb-3'>{error}</p>}

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'
        >
          Registrar
        </button>
      </form>
    </div>
  );
}
