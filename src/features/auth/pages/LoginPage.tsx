import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { 
  TrendingUp, 
  Shield, 
  CreditCard, 
  PieChart,
  ArrowRight,
  Users,
  Target
} from 'lucide-react';

// Credenciales de prueba
const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@budgease.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin'
  },
  client: {
    email: 'cliente@budgease.com',
    password: 'cliente123',
    role: 'client',
    name: 'Cliente'
  }
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (email: string, password: string) => {
    // Limpiar error anterior
    setError('');
    
    // Validar credenciales
    if (email === TEST_CREDENTIALS.admin.email && password === TEST_CREDENTIALS.admin.password) {
      // Login como admin
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', TEST_CREDENTIALS.admin.role);
      localStorage.setItem('userName', TEST_CREDENTIALS.admin.name);
      localStorage.setItem('userEmail', TEST_CREDENTIALS.admin.email);
      navigate('/');
    } 
    else if (email === TEST_CREDENTIALS.client.email && password === TEST_CREDENTIALS.client.password) {
      // Login como cliente
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', TEST_CREDENTIALS.client.role);
      localStorage.setItem('userName', TEST_CREDENTIALS.client.name);
      localStorage.setItem('userEmail', TEST_CREDENTIALS.client.email);
      navigate('/');
    }
    else {
      // Credenciales inválidas
      setError('Credenciales incorrectas. Por favor, intenta de nuevo.');
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
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-white" />
              </div>
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
            />
          )}
        </div>
      </div>
    </div>
  );
};
