import { Component, type ReactNode } from 'react';
import { Logo } from './Logo';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error(error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center" style={{ backgroundColor: '#1a0f14' }}>
        <Logo size={56} />
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Algo salió mal</h1>
          <p className="text-white/60">Ocurrió un error inesperado. Intenta recargar la página.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#F05984' }}
        >
          Recargar
        </button>
      </div>
    );
  }
}
