
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import App from './App.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import "./styles/index.ts"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <App />
        <Toaster position="top-right" />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
