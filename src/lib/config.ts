// Definir tipos para import.meta.env
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_APP_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export const config = {
  apiUrl: (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api',
  appName: (import.meta as any).env?.VITE_APP_NAME || 'Sistema Financiero',
};
