import React from "react";
import { useNavigate, Link } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-[#FFF2E9] text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 bg-white shadow">
        <a href="/">
          <img
            src="/website-builder-logo.png"
            alt="Website Builder"
            className="h-16 w-auto"
          />
        </a>{" "}
        <div className="space-x-4">
          <button
            onClick={handleLogin}
            className="px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Login
          </button>
          <button
            onClick={handleSignup}
            className="px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600 transition"
          >
            Signup
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-20">
        {/* Left: Text content */}
        <div className="md:w-1/2 mb-12 md:mb-0 md:ml-20">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
            Build your website <br /> the easy way
          </h1>
          <p className="text-lg mb-8 max-w-lg">
            Creating a website doesn’t need to be complicated. With Website
            Builder, you can effortlessly design your website – no coding
            required. Select from our list of templates and start customizing.
          </p>
          <button
            onClick={handleLogin}
            className="px-6 py-3 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition text-lg"
          >
            Start creating for free
          </button>
        </div>

        {/* Right: Image */}
        <div className="md:w-1/2">
          <img
            src="https://res.cloudinary.com/adankhan/image/upload/v1745227151/uploads/qklg6rbcoocbgn3zd0sp.jpg"
            alt="Website Editor Preview"
            className="rounded shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
