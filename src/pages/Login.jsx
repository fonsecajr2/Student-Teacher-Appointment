//login function of firebas, useState takes the values and useNavigate
import { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            //entering by auth.js
            const {userData} = await login(email, password);
            const role = userData.role;

            //redirecting on base of role
            if (role === "student") navigate("/dashboard/student");
            else if (role === "teacher") navigate("/dashboard/teacher");
            else if (role === "admin") navigate("/dashboard/admin");
            else throw new Error("Unknown");

        } catch (error){
            alert("Erro no Login" + error.message)
        }
    };

    return(
        <div className='flex items-center justify-center min-h-screen bg-amber-400'>
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-4"
            >
                <input type="email"
                value={email}
                placeholder='email@gmail.com'
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input type="password" 
                value={password}
                placeholder='Your Password'
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button type='submit'
                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Login
                </button>
            </form>
        </div>
    )
}