import { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
  AlertCircle
} from 'lucide-react';

interface LoginFormProps {
  onBack: () => void;
  onLogin: (username: string, password: string) => void;
  error?: string;
  isLoading?: boolean;
}

export const LoginForm = ({ onBack, onLogin, error, isLoading }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData.username, formData.password);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Volver</span>
      </button>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Accede a tu cuenta</h2>
        <p className="text-gray-600">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 block">
            Usuario
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F05984] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
              placeholder="tu.usuario"
              required
            />
          </div>
        </div>

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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 transition-all hover:shadow-lg transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          style={{ background: 'linear-gradient(135deg, #321D28 0%, #BC455F 100%)' }}
        >
          <LogIn size={20} />
          <span>{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</span>
        </button>
      </form>
    </div>
  );
};
