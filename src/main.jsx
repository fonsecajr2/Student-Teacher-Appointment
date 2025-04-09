import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProtectedProvider } from './context/ProtectedContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProtectedProvider>
      <App />
    </ProtectedProvider>
  </StrictMode>,
)
