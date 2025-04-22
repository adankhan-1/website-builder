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
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
      <div className="mt-10 mb-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
      <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        Create an account
      </h2>

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
          className="w-full p-2 mb-4 border rounded bg-white text-black"
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded bg-white text-black"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded bg-white text-black"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded bg-white text-black"
        />

        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-cyan-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
          >
          Register
        </button>

        <p className="text-sm text-center mt-2 text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
      </div>
    </div>
  );
}
