//login function of firebas, useState takes the values and useNavigate
import { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            //entering by auth.js
            const {user} = await login(email, password);

            //getting role
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if(!userSnap.exists()){
                throw new Error("User doesn't exists")
            }

            const {role} = userSnap.data()

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