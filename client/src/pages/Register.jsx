import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/index.js';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      
        try {
          const response = await register(formData);
          console.log("Signup successful:", response.data);
          navigate('/login');
        } catch (err) {
          console.error("Signup failed:", err.response?.data?.message || err.message);
        }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-image px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center mb-6">
          Create an account
        </h2>
  
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
  
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-white text-black"
          />
  
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-white text-black"
          />
  
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-white text-black"
          />
  
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-white text-black"
          />
  
          <button
            type="submit"
            className="w-full justify-center rounded-md bg-cyan-500 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-700"
          >
            Register
          </button>
  
          <p className="text-sm text-center mt-2 text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );  
}
