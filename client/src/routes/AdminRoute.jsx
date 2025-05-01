import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");

  if (!role) {
    console.log('Role not found in localStorage');
    return <Navigate to="/login" />;
  }

  if (role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default AdminRoute;