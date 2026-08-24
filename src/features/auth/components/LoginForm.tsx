import { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle
} from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  error?: string;
  isLoading?: boolean;
}

export const LoginForm = ({ onLogin, error, isLoading }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData.username, formData.password);
  };

  return (
    <div className="w-full max-w-[400px] bg-[#101015] border border-white/[0.07] rounded-[20px] p-10">
      <h2 className="text-2xl font-extrabold text-white mb-1.5">Bienvenido de nuevo</h2>
      <p className="text-[13.5px] text-white/45 mb-8">Ingresa tus credenciales para continuar</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2 mb-5">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-[18px]">
        <div>
          <label className="block text-[12.5px] font-semibold text-white/60 mb-[7px]">Usuario</label>
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-[#0C0C10] border border-white/[0.08] focus-within:border-[#8A5CF6]/50 focus-within:ring-2 focus-within:ring-[#8A5CF6]/15 transition-all">
            <User size={16} className="text-white/35 flex-shrink-0" />
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-transparent border-0 p-0 text-sm text-white placeholder-white/30 focus:ring-0"
              placeholder="tu.usuario"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-white/60 mb-[7px]">Contraseña</label>
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-[#0C0C10] border border-white/[0.08] focus-within:border-[#8A5CF6]/50 focus-within:ring-2 focus-within:ring-[#8A5CF6]/15 transition-all">
            <Lock size={16} className="text-white/35 flex-shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-transparent border-0 p-0 text-sm text-white placeholder-white/30 focus:ring-0"
              placeholder="••••••••"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-white/35 hover:text-white/60 flex-shrink-0">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="button" className="text-[12.5px] font-semibold text-[#8A5CF6] hover:text-[#a67cf8]">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-[13px] rounded-xl text-white font-bold text-[14.5px] flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-[#8A5CF6]/20 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #8A5CF6 0%, #F26D5B 100%)' }}
        >
          <LogIn size={18} />
          <span>{isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}</span>
        </button>
      </form>

      <p className="mt-[22px] text-[12.5px] text-white/40 text-center">¿No tienes cuenta? Contacta a tu administrador</p>
    </div>
  );
};
