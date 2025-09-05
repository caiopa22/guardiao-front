import { BrowserRouter, Route, Routes } from 'react-router';
import AccessPage from './pages/AccessPage';
import "./index.css"
import VaultPage from './pages/VaultPage';
import SecretsPage from './pages/SecretsPage';
import LandingPage from './pages/LandingPage';
import { Toaster } from 'sonner';
import { useTheme } from './hooks/useTheme';

// Componente principal que define as rotas
export default function App() {

  const { theme } = useTheme();

  return (
    <div className={`${theme}`}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<LandingPage />}
          />
          <Route
            path="/secrets"
            element={<SecretsPage />}
          />
          <Route
            path="/vault"
            element={<VaultPage />}
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