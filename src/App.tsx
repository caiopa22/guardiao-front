import { BrowserRouter, Route, Routes } from 'react-router';
import AccessPage from './pages/AccessPage';
import "./index.css"
import VaultPage from './pages/VaultPage';

// Componente principal que define as rotas
export default function App() {

  return (
    <BrowserRouter>
      <Routes>
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
  );
}