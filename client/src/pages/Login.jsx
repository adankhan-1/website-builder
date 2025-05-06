import { useState } from "react";
import { login } from "../api/index.js";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const { setUserId } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await login(formData);
      const { id, role, firstName, lastName, email, approved } = response.data.user;
  
      if (!approved) {
        setErrorMessage("Account pending for approval");
        return;
      }
  
      setUserId(id);
      localStorage.setItem('userId', id);
      localStorage.setItem('name', `${firstName} ${lastName}`);
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);
  
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
      setErrorMessage("Invalid credentials, please try again");
    }
  };  

  return (
    <div className="flex items-center justify-center min-h-screen bg-image px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col items-center">
          <img
            alt="Website Builder"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=cyan&shade=400"
            className="h-10 w-auto mb-4"
          />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center">
            Sign in to your account
          </h2>
        </div>
  
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded bg-white text-black"
            />
          </div>
  
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded bg-white text-black"
            />
          </div>
  
          <button
            type="submit"
            className="w-full justify-center rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-700"
          >
            Sign in
          </button>
  
          {errorMessage && (
            <p className="text-sm text-center text-red-500">{errorMessage}</p>
          )}
  
          <p className="text-sm text-center mt-2 text-gray-600">
            <Link to="/register" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );  
}