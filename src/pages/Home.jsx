import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-400 p-4">
      
      <h1 className="text-4xl font-bold text-white mb-8">
        Home Page
      </h1>

      <div className="flex gap-6 mb-6">
        <Link 
          to="/login" 
          className="bg-white text-amber-500 font-semibold py-2 px-6 rounded-lg shadow hover:bg-amber-100 transition duration-300"
        >
          Login
        </Link>
        
        <Link 
          to="/register" 
          className="bg-white text-amber-500 font-semibold py-2 px-6 rounded-lg shadow hover:bg-amber-100 transition duration-300"
        >
          Register
        </Link>
      </div>

      <p className="text-white text-center text-sm max-w-md">
        Registration is only for students and will remain pending until authorized by an administrator.
      </p>

    </div>
  );
}
