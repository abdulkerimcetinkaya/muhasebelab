import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { UnitelerProvider } from './contexts/UnitelerContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <UnitelerProvider>
        <App />
      </UnitelerProvider>
    </AuthProvider>
  </StrictMode>,
)
