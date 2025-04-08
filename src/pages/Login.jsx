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
            await login(email, password);
            navigate("/dashboard");
        } catch (error){
            alert("Erro no Login" + error.message)
        }
    };

    return(
        <div>
            <form onSubmit={handleLogin}>
                <input type="email"
                value={email}
                placeholder='email@gmail.com'
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <input type="password" 
                value={password}
                placeholder='Your Password'
                onChange={(e) => setPassword(e.target.value)}
                required
                />

                <button type='submit'>Login</button>
            </form>
        </div>
    )
}