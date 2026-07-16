import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { authService } from '../services';
import { clientesService } from '../../clients/services';
import { Logo } from '../../../shared/components/ui/Logo';
import {
  Shield,
  CreditCard,
  PieChart,
  ArrowRight,
  Users,
  Target
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    setError('');
    setIsLoading(true);
    try {
      const { token, userId, username: name, email, rol } = await authService.login(username, password);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', rol === 'CLIENTE' ? 'client' : 'admin');
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', String(userId));
      localStorage.setItem('authToken', token);

      if (rol === 'CLIENTE' && email) {
        // Único enlace usuario -> cliente es el email; se resuelve una vez aquí para
        // que todas las páginas tengan clienteId disponible sin depender de visitar Configuración.
        const clientes = await clientesService.getAll().catch(() => []);
        const cliente = clientes.find(c => c.email?.toLowerCase() === email.toLowerCase());
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
    <div className="min-h-screen flex">
      {/* Left side - Hero section with gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(135deg, #321D28 0%, #6E4068 50%, #BC455F 100%)'
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F05984] rounded-full mix-blend-overlay filter blur-3xl"></div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col w-full">
          <div className="p-12">
            <div className="flex items-center space-x-2">
              <Logo size={40} />
              <span className="text-2xl font-bold">BudgEase</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-12">
            <div className="space-y-8 max-w-md">
              <div>
                <h1 className="text-5xl font-bold leading-tight text-white">
                  Gestiona tus<br />finanzas de forma<br />inteligente
                </h1>
                <p className="text-xl text-white/80 mt-4">
                  La plataforma completa para el control financiero de tu negocio y clientes
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield size={18} className="text-white" />
                  </div>
                  <span className="text-white/90">Seguridad bancaria de nivel empresarial</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PieChart size={18} className="text-white" />
                  </div>
                  <span className="text-white/90">Reportes y análisis en tiempo real</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users size={18} className="text-white" />
                  </div>
                  <span className="text-white/90">Gestión multi-cliente y multi-rol</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-12"></div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {!showLogin ? (
            <div className="text-center space-y-8">
              <div className="lg:hidden flex justify-center mb-8">
                <Logo size={64} />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">¡Bienvenido!</h2>
                <p className="text-gray-600">
                  Comienza a gestionar tus finanzas de manera eficiente
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-8">
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <Target className="w-8 h-8 text-[#F05984] mb-2" />
                  <h3 className="font-semibold text-gray-900">Metas</h3>
                  <p className="text-sm text-gray-600">Alcanza tus objetivos</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <CreditCard className="w-8 h-8 text-[#F05984] mb-2" />
                  <h3 className="font-semibold text-gray-900">Gastos</h3>
                  <p className="text-sm text-gray-600">Control total</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <PieChart className="w-8 h-8 text-[#F05984] mb-2" />
                  <h3 className="font-semibold text-gray-900">Reportes</h3>
                  <p className="text-sm text-gray-600">Análisis detallado</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <Shield className="w-8 h-8 text-[#F05984] mb-2" />
                  <h3 className="font-semibold text-gray-900">Seguro</h3>
                  <p className="text-sm text-gray-600">Datos protegidos</p>
                </div>
              </div>

              <button
                onClick={() => setShowLogin(true)}
                className="w-full py-4 px-6 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 transition-all hover:shadow-lg transform hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #321D28 0%, #BC455F 100%)' }}
              >
                <span>Iniciar Sesión</span>
                <ArrowRight size={20} />
              </button>

              <p className="text-sm text-gray-500">
                ¿No tienes cuenta? Contacta a tu administrador
              </p>
            </div>
          ) : (
            <LoginForm
              onBack={() => {
                setShowLogin(false);
                setError('');
              }}
              onLogin={handleLogin}
              error={error}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};
