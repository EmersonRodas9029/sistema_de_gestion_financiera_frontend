import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import '../index.css'
import '../styles/globals.css'

// ponytail: redirect bare pathnames to hash equivalents so HashRouter doesn't stack on top of them
if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
  window.location.replace('/' + '#' + window.location.pathname);
}

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="top-right" toastOptions={{ style: { background: '#321D28', color: '#fff' } }} />
    </QueryClientProvider>
  </React.StrictMode>,
)
