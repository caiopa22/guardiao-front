import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"
import App from './App.tsx'
import { ThemeProvider } from './context/themeContext.tsx'
import { AuthProvider } from './context/authContext.tsx'
import { Toaster } from 'sonner'
import { UserProvider } from './context/userContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </UserProvider>
  </StrictMode>,
)
