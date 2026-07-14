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

// ponytail: apply persisted font-size/theme preferences before first paint (Tailwind's rem-based
// sizes scale off the root font-size, and the light theme is a CSS override keyed off data-theme —
// see index.css — so this alone makes both preferences work app-wide, on every page)
const FONT_SIZES = { small: '14px', medium: '16px', large: '18px' } as const;
try {
  const saved = JSON.parse(localStorage.getItem('settings_preferences') || '{}');
  document.documentElement.style.fontSize = FONT_SIZES[saved.fontSize as keyof typeof FONT_SIZES] || FONT_SIZES.medium;
  document.documentElement.setAttribute('data-theme', saved.theme === 'light' ? 'light' : 'dark');
  document.documentElement.setAttribute('data-color-scheme', saved.colorScheme || 'default');
} catch {
  document.documentElement.style.fontSize = FONT_SIZES.medium;
  document.documentElement.setAttribute('data-theme', 'dark');
  document.documentElement.setAttribute('data-color-scheme', 'default');
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
