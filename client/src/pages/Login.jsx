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

      const response = await login(formData); // response is assigned here
      console.log("Login successful:", response);
      const userId = response.data.userId;     // read only after successful response
      setUserId(userId);                       // update auth context
      localStorage.setItem('userId', userId);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
      setErrorMessage("Invalid credentials, please try again");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Website Builder"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=cyan&shade=400"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 mb-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email</label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded bg-white text-black"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded bg-white text-black"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-cyan-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
            >
              Sign in
            </button>
          </div>

          {/* Error message */}
          {errorMessage && (
            <p className="text-sm text-center text-red-500">
              {errorMessage}
            </p>
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