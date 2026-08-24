import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center" style={{ backgroundColor: '#08080B' }}>
    <Logo size={56} />
    <div>
      <h1 className="text-5xl font-bold text-white mb-2">404</h1>
      <p className="text-white/60">La página que buscas no existe.</p>
    </div>
    <Link
      to="/"
      className="px-5 py-2.5 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
      style={{ backgroundColor: '#8A5CF6' }}
    >
      Volver al inicio
    </Link>
  </div>
);
