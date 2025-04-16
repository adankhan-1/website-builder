import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditTemplate from './pages/EditTemplate';
import Templates from './pages/Templates';
import Projects from './pages/Projects';
import './App.css';
import PrivateRoute from './routes/PrivateRoute';
import EditProject from './pages/EditProject';
import CreateProject from './pages/CreateProject';

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
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-project/:templateId"
          element={
            <PrivateRoute>
              <CreateProject />
            </PrivateRoute>
          }
        />
        <Route 
          path="/edit-template/:templateId/:projectId" 
          element={
            <EditTemplate />
          } 
        />
        <Route 
          path="/edit-project/:projectId" 
          element={
            <EditProject />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}