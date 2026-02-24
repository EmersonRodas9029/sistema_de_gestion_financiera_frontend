import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { 
  TrendingUp, 
  Shield, 
  CreditCard, 
  PieChart,
  ArrowRight,
  Star,
  Users,
  Target
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (email: string, password: string) => {
    // Aquí irá la lógica real de autenticación
    console.log('Login attempt:', { email, password });
    
    // Por ahora, simulamos un login exitoso y redirigimos
    // En un caso real, verificarías las credenciales y obtendrías el rol
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', email.includes('admin') ? 'admin' : 'client');
    localStorage.setItem('userName', email.split('@')[0]);
    
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero section with gradient */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Fondo con gradiente usando los colores de la paleta */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: 'linear-gradient(135deg, #321D28 0%, #6E4068 50%, #BC455F 100%)'
          }}
        >
          {/* Patrón de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F05984] rounded-full mix-blend-overlay filter blur-3xl"></div>
          </div>
        </div>

        {/* Contenido del hero */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo y marca */}
          <div>
            <div className="flex items-center space-x-2 mb-12">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold">FinanSys</span>
            </div>
          </div>

          {/* Texto principal */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Gestiona tus<br />finanzas de forma<br />inteligente
            </h1>
            <p className="text-xl text-white/80 max-w-md">
              La plataforma completa para el control financiero de tu negocio y clientes
            </p>

            {/* Características */}
            <div className="space-y-4 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield size={18} className="text-white" />
                </div>
                <span className="text-white/90">Seguridad bancaria de nivel empresarial</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <PieChart size={18} className="text-white" />
                </div>
                <span className="text-white/90">Reportes y análisis en tiempo real</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users size={18} className="text-white" />
                </div>
                <span className="text-white/90">Gestión multi-cliente y multi-rol</span>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div>
              <div className="text-3xl font-bold">+10k</div>
              <div className="text-sm text-white/70">Usuarios activos</div>
            </div>
            <div>
              <div className="text-3xl font-bold">$2.5M</div>
              <div className="text-sm text-white/70">Transacciones</div>
            </div>
            <div>
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-sm text-white/70">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {!showLogin ? (
            /* Landing/Welcome section */
            <div className="text-center space-y-8">
              {/* Logo para móvil */}
              <div className="lg:hidden flex justify-center mb-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #321D28 0%, #BC455F 100%)' }}
                >
                  <TrendingUp size={32} className="text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">¡Bienvenido!</h2>
                <p className="text-gray-600">
                  Comienza a gestionar tus finanzas de manera eficiente
                </p>
              </div>

              {/* Features grid */}
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

              {/* Testimonios */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center space-x-1 text-yellow-400 mb-2">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-gray-600 italic">
                  "Desde que uso FinanSys, el control de mis finanzas nunca fue tan fácil"
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-2">
                  — María González, Contadora
                </p>
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
            /* Login Form */
            <LoginForm onBack={() => setShowLogin(false)} onLogin={handleLogin} />
          )}
        </div>
      </div>
    </div>
  );
};
