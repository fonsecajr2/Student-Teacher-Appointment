import { useState } from 'react';
import { signUp } from '../services/auth';
import { db } from '../services/firebase'
import { doc, setDoc} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';

export default function Login(){
    
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    })

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try{
            //creating student by auth in firebase
            const {user} = await signUp(form.email, form.password);

            //creating doc with role: student
            await setDoc(doc(db, "users", user.uid), {
                name: form.name,
                email: form.email,
                role: "student",
            });

            navigate("/dashboard")
        } catch (error){
            console.error(error);
            setError("Error in Registering: " + error.message);
        }
    };


    return(
        <div className='bg-amber-500 min-h-screen'>
            <form onSubmit={handleSubmit}>
                <input type="text"
                name='name'
                value={form.name}
                placeholder='Your Name'
                onChange={handleChange}
                required
                />
                <input type="email"
                name='email'
                value={form.email}
                placeholder='email@gmail.com'
                onChange={handleChange}
                required
                />
                <input type="password" 
                name='password'
                value={form.password}
                placeholder='Your Password'
                onChange={handleChange}
                required
                />

                {error && <p className='text-red-500'>{error}</p>}
                <button type='submit'>Register</button>
            </form>
        </div>
    );
}