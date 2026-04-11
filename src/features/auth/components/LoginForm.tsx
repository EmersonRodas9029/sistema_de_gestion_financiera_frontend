import { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  LogIn
} from 'lucide-react';

interface LoginFormProps {
  onBack: () => void;
  onLogin: (email: string, password: string) => void;
}

export const LoginForm = ({ onBack, onLogin }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData.email, formData.password);
  };

  return (
    <div className="space-y-6">
      {/* Botón de regreso */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Volver</span>
      </button>

      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Accede a tu cuenta</h2>
        <p className="text-gray-600">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campo Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F05984] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>
        </div>

        {/* Campo Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F05984] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Opciones adicionales */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
            <span className="text-sm text-gray-600">Recordarme</span>
          </label>
          <button 
            type="button"
            className="text-sm text-[#F05984] hover:text-[#d14d75] font-medium"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Botón de login */}
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 transition-all hover:shadow-lg transform hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #321D28 0%, #BC455F 100%)' }}
        >
          <LogIn size={20} />
          <span>Iniciar Sesión</span>
        </button>

        {/* Demo credentials */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-xs text-gray-600 mb-2">Credenciales de demostración:</p>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Admin:</span> admin@budgease.com / admin123</p>
            <p><span className="font-medium">Cliente:</span> cliente@budgease.com / cliente123</p>
          </div>
        </div>
      </form>
    </div>
  );
};
