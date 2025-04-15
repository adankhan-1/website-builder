import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditTemplate from './pages/EditTemplate';
import Templates from './pages/Templates';
import './App.css';
import PrivateRoute from './routes/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <PrivateRoute>
              <Templates />
            </PrivateRoute>
          }
        />
        <Route path="/edit-template/:templateId" element={<EditTemplate />} />
      </Routes>
    </BrowserRouter>
  );
}