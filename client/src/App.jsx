import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Projects from './pages/Projects';
import './App.css';
import PrivateRoute from './routes/PrivateRoute';
import EditProject from './pages/EditProject';
import CreateProject from './pages/CreateProject';
import AdminDashboard from './pages/AdminDashboard';
import EditFiles from './pages/EditFiles';
import LandingPage from './pages/LandingPage';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminAddTemplate from './pages/AdminAddTemplate';
import Unauthorized from './components/Unauthorized';
import AdminRoute from './routes/AdminRoute';
import AdminViewTemplates from './pages/AdminViewTemplates';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
        {/* <Route 
          path="/edit-template/:templateId/:projectId" 
          element={
            <PrivateRoute>
              <EditTemplate />
            </PrivateRoute>
          } 
        /> */}
        <Route 
          path="/edit-project/:projectId" 
          element={
            <PrivateRoute>
              <EditProject />
            </PrivateRoute>
          } 
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-files/:projectId"
          element={
            <PrivateRoute>
              <EditFiles />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/user-management/:type"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminUserManagement />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-template"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminAddTemplate />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/unauthorized"
          element={
              <Unauthorized />
          }
        />
        <Route
          path="/admin/view-templates"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminViewTemplates />
              </AdminRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}