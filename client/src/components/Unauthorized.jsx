import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-800 mb-6">
        You do not have permission to view this page.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default Unauthorized;