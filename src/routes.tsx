import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProjectPage } from './pages/ProjectPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { useStore } from './lib/store';

export function AppRoutes() {
  const token = useStore((state) => state.token);

  return (
    <Routes>
      <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/" />} />
      <Route path="/" element={token ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/project/:id" element={token ? <ProjectPage /> : <Navigate to="/login" />} />
    </Routes>
  );
}