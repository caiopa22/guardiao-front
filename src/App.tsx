import { BrowserRouter, Route, Routes } from 'react-router';
import AccessPage from './pages/AccessPage';
import "./globals.css"
import VaultPage from './pages/VaultPage';
import SecretsPage from './pages/SecretsPage';
import { useTheme } from './context/useTheme';

// Componente principal que define as rotas
export default function App() {

  const { theme } = useTheme();

  return (
    <div className={`${theme}`}>
      <BrowserRouter>
        <Routes>
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