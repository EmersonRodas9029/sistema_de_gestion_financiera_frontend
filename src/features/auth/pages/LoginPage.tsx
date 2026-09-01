import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { authService } from '../services';
import { clientesService } from '../../clients/services';
import { Logo } from '../../../shared/components/ui/Logo';
import { Shield, PieChart, Users } from 'lucide-react';

const features = [
  { icon: Shield, color: '#8A5CF6', text: 'Seguridad bancaria de nivel empresarial' },
  { icon: PieChart, color: '#46C7E0', text: 'Reportes y análisis en tiempo real' },
  { icon: Users, color: '#F26D5B', text: 'Gestión multi-cliente y multi-rol' },
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    setError('');
    setIsLoading(true);
    try {
      const { token, userId, username: name, email, rol } = await authService.login(username, password);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', rol === 'CLIENTE' ? 'client' : rol === 'SUDO' ? 'sudo' : 'admin');
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', String(userId));
      localStorage.setItem('authToken', token);

      if (rol === 'CLIENTE') {
        // Se resuelve una vez aquí para que todas las páginas tengan clienteId disponible
        // sin depender de visitar Configuración. Para un CLIENTE, GET /clientes ya devuelve
        // solo su propio registro, así que si no hay match por email caemos al primero.
        const clientes = await clientesService.getAll().catch(() => []);
        const cliente = clientes.find(c => c.email?.toLowerCase() === email?.toLowerCase()) ?? clientes[0];
        if (cliente?.id != null) localStorage.setItem('clienteId', String(cliente.id));
      }

      navigate('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Credenciales incorrectas. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0C0C10] text-[#F5F5F7]">
      {/* Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#08080B] flex-col">
        <div className="absolute -top-32 -left-24 w-[480px] h-[480px] rounded-full bg-[#8A5CF6] opacity-20 blur-[90px]" />
        <div className="absolute -bottom-36 -right-20 w-[520px] h-[520px] rounded-full bg-[#F26D5B] opacity-20 blur-[100px]" />

        <div className="relative p-12">
          <div className="flex items-center gap-2.5">
            <Logo size={34} />
            <span className="font-display text-xl font-extrabold">BudgEase</span>
          </div>
        </div>

        <div className="relative flex-1 flex flex-col justify-center px-12 max-w-xl">
          <h1 className="font-display text-[44px] font-extrabold leading-[1.15]">
            Gestiona tus finanzas<br />con{' '}
            <span className="bg-gradient-to-r from-[#8A5CF6] to-[#F26D5B] bg-clip-text text-transparent">
              total claridad
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/55 max-w-md">
            La plataforma completa para el control financiero de tu negocio y tus clientes.
          </p>

          <div className="flex flex-col gap-[18px] mt-10">
            {features.map(({ icon: Icon, color, text }) => (
              <div key={text} className="flex items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}26`, color }}
                >
                  <Icon size={19} />
                </div>
                <span className="text-[14.5px] text-white/85">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative px-12 pb-10 text-[12.5px] text-white/30">© 2026 BudgEase</div>
      </div>

      {/* Form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="lg:hidden flex justify-center mb-8 absolute top-8">
          <Logo size={48} />
        </div>
        <LoginForm onLogin={handleLogin} error={error} isLoading={isLoading} />
      </div>
    </div>
  );
};
