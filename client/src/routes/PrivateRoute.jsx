// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const PrivateRoute = ({ children }) => {
//   const { userId, loading } = useAuth();

//   if (loading) return <div>Loading...</div>;

//   return userId ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;


import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;