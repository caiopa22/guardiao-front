import { BrowserRouter, Route, Routes } from 'react-router';
import AccessPage from './pages/AccessPage';
import "./index.css"
import VaultPage from './pages/VaultPage';
import SecretsPage from './pages/SecretsPage';
import LandingPage from './pages/LandingPage';
import { Toaster } from 'sonner';
import { useTheme } from './hooks/useTheme';
import Sandbox from './pages/Sandbox';
import PrivateRoute from './pages/PrivateRoute';
import Dashboard from './pages/Dashboard';

// Componente principal que define as rotas
export default function App() {

  const { theme } = useTheme();

  return (
    <div className={`${theme} overflow-x-hidden`}>
      <Toaster className={`${theme}`} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<LandingPage />}
          />
          <Route
            path="/sandbox"
            element={<Sandbox />}
          />
          <Route
            path="/secrets"
            element={
              <PrivateRoute>
                <SecretsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/vault"
            element={
              <PrivateRoute>
                <VaultPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/access"
            element={<AccessPage />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}