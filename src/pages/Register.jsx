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
      // Create user in Firebase Auth
      const { user } = await signUp(form.email, form.password);

      // Create document in Firestore with status: "pending"
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
        role: "student",
        status: "pending",
        createdAt: new Date(),
        approved: false
      });

      navigate("/login"); // Redirects to login
      alert("Registration submitted. Please wait for approval.");

    } catch (error) {
      console.error(error);
      setError("Registration failed: " + error.message);
    }
  };

  return (
    <div className="bg-amber-400 min-h-screen flex justify-center items-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-amber-500 mb-6">
          Student Registration
        </h2>

        <input
          type="text"
          name="name"
          value={form.name}
          placeholder="Your Name"
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="email@gmail.com"
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Your Password"
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        />

        {error && (
          <p className="text-red-600 text-center mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-amber-500 text-white font-semibold py-3 rounded-lg hover:bg-amber-600 transition duration-300"
        >
          Register
        </button>
      </form>
    </div>
  );
}
