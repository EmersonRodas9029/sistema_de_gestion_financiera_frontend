import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { clientesService, usuariosService } from '../../../clients/services';
import { authService } from '../../../auth/services';
import { type TipoNotificacion } from '../../../notifications/services';
import { configuracionesService } from '../../services';
import {
  Settings,
  User,
  Bell,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertCircle,
  Trash2,
  Target,
  Activity,
  BarChart3,
  Palette,
  CheckCircle as CheckCircleIcon,
  AlertTriangle
} from 'lucide-react';
import { Switch } from '@headlessui/react';
import { containerVariants, itemVariants, logout, isStrongPassword, PASSWORD_REQUIREMENT_MESSAGE } from '../../../../shared/utils';

interface SettingsSection {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface ProfileSettings {
  name: string;
  username: string;
  email: string;
  phone: string;
  position: string;
  avatar?: string;
}

interface NotificationSettings {
  enabledTypes: TipoNotificacion[];
}

// Los mismos 5 tipos reales que genera useAutoNotifications y muestra NotificationsPage (labels/iconos en sync).
const NOTIFICATION_TYPES: { value: TipoNotificacion; label: string; description: string }[] = [
  { value: 'PRESUPUESTO_EXCEDIDO', label: 'Presupuesto', description: 'Avisos al acercarte o exceder el límite de un presupuesto' },
  { value: 'GASTO_RECURRENTE', label: 'Gasto recurrente', description: 'Avisos de cobros recurrentes próximos o vencidos' },
  { value: 'META_PROGRESO', label: 'Metas', description: 'Hitos de progreso (50%/100%) y vencimientos próximos de tus metas' },
  { value: 'RECORDATORIO', label: 'Recordatorios', description: 'Recordatorios generales de la cuenta' },
  { value: 'SISTEMA', label: 'Sistema', description: 'Avisos del sistema' },
];

// Clave genérica en /api/configuraciones (tipo JSON) usada para persistir qué tipos
// de notificación tiene habilitados el cliente; no hay endpoint dedicado de preferencias.
const CLAVE_TIPOS_NOTIFICACION = 'notif_tipos_habilitados';

interface SecuritySettings {
  twoFactorAuth: boolean;
  lastPasswordChange: string;
}

interface PreferenceSettings {
  theme: 'light' | 'dark';
  colorScheme: 'default' | 'blue' | 'green' | 'purple';
  fontSize: 'small' | 'medium' | 'large';
  defaultView: 'grid' | 'list';
  itemsPerPage: number;
}

// Datos iniciales: se toman del usuario autenticado (localStorage), no de valores inventados
const getDefaultProfile = (): ProfileSettings => ({
  name: localStorage.getItem('userName') || 'Usuario',
  username: localStorage.getItem('userName') || '',
  email: localStorage.getItem('userEmail') || '',
  phone: '',
  position: localStorage.getItem('userRole') === 'client' ? 'Cliente' : 'Administrador',
});

const getDefaultNotifications = (): NotificationSettings => ({
  enabledTypes: NOTIFICATION_TYPES.map(t => t.value),
});

const getDefaultSecurity = (): SecuritySettings => ({
  twoFactorAuth: false,
  lastPasswordChange: '2024-01-15'
});

const getDefaultPreferences = (): PreferenceSettings => ({
  theme: 'dark',
  colorScheme: 'default',
  fontSize: 'medium',
  defaultView: 'grid',
  itemsPerPage: 20
});

// Componente Switch personalizado
const CustomSwitch = ({ enabled, onChange, label, description }: { enabled: boolean; onChange: (value: boolean) => void; label: string; description: string }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group">
    <div className="flex-1">
      <p className="text-white font-medium">{label}</p>
      <p className="text-white/40 text-sm">{description}</p>
    </div>
    <Switch
      checked={enabled}
      onChange={onChange}
      className={`${enabled ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F]' : 'bg-white/20'} relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 shadow-lg`}
    >
      <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-md`} />
    </Switch>
  </div>
);

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [notifConfigId, setNotifConfigId] = useState<number | null>(null);

  // Cargar datos reales del usuario autenticado
  useEffect(() => {
    const userId = localStorage.getItem('userId');

    const load = async () => {
      let resolvedClienteId: number | null = null;

      try {
        // GET /api/usuarios no trae un objeto "cliente" anidado: solo id/username/email/rol.
        const usuarios = await usuariosService.getAll();
        const me = usuarios.find(u => String(u.id) === userId);
        if (me) {
          setProfile(prev => ({
            ...prev,
            name: me.username || prev.name,
            username: me.username || prev.username,
            email: me.email || prev.email,
            position: me.rol === 'CONTADOR' ? 'Contador' : 'Cliente',
          }));

          // El único enlace usuario -> cliente es el email; se resuelve contra /api/clientes.
          if (me.rol === 'CLIENTE' && me.email) {
            const clientes = await clientesService.getAll();
            const cliente = clientes.find(c => c.email?.toLowerCase() === me.email!.toLowerCase());
            if (cliente) {
              if (cliente.id != null) {
                resolvedClienteId = Number(cliente.id);
                localStorage.setItem('clienteId', String(resolvedClienteId));
              }
              setProfile(prev => ({
                ...prev,
                name: cliente.nombreCompleto || prev.name,
                phone: cliente.telefono || prev.phone,
              }));
            }
          }
        }
      } catch {
        // no se pudo cargar el usuario autenticado; se mantiene el perfil basado en localStorage
      }
      setClienteId(resolvedClienteId);

      if (resolvedClienteId != null) {
        try {
          const configs = await configuracionesService.getAll();
          const mia = configs.find(c => c.clienteId === resolvedClienteId && c.clave === CLAVE_TIPOS_NOTIFICACION);
          if (mia) {
            setNotifConfigId(mia.id ?? null);
            const tipos = JSON.parse(mia.valor) as unknown;
            if (Array.isArray(tipos)) {
              setNotifications(prev => ({ ...prev, enabledTypes: tipos as TipoNotificacion[] }));
            }
          }
        } catch {
          // sin conexión o valor inválido: se mantiene lo que había en localStorage
        }
      }

      setIsLoading(false);
    };

    load();
  }, []);

  // Cargar configuraciones desde localStorage, sobre una base de valores por defecto por si
  // quedó guardada una forma antigua (campos removidos/renombrados en una versión previa).
  const [profile, setProfile] = useState<ProfileSettings>(() => {
    const saved = localStorage.getItem('settings_profile');
    return { ...getDefaultProfile(), ...(saved ? JSON.parse(saved) : {}) };
  });

  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('settings_notifications');
    return { ...getDefaultNotifications(), ...(saved ? JSON.parse(saved) : {}) };
  });

  const [security, setSecurity] = useState<SecuritySettings>(() => {
    const saved = localStorage.getItem('settings_security');
    return { ...getDefaultSecurity(), ...(saved ? JSON.parse(saved) : {}) };
  });

  const [preferences, setPreferences] = useState<PreferenceSettings>(() => {
    const saved = localStorage.getItem('settings_preferences');
    return { ...getDefaultPreferences(), ...(saved ? JSON.parse(saved) : {}) };
  });

  // Guardar configuraciones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('settings_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('settings_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('settings_security', JSON.stringify(security));
  }, [security]);

  useEffect(() => {
    localStorage.setItem('settings_preferences', JSON.stringify(preferences));
    const FONT_SIZES = { small: '14px', medium: '16px', large: '18px' } as const;
    document.documentElement.style.fontSize = FONT_SIZES[preferences.fontSize];
    document.documentElement.setAttribute('data-theme', preferences.theme);
    document.documentElement.setAttribute('data-color-scheme', preferences.colorScheme);
  }, [preferences]);

  const sections: SettingsSection[] = [
    {
      id: 'profile',
      name: 'Perfil',
      icon: <User size={20} />,
      description: 'Información personal y de contacto'
    },
    {
      id: 'notifications',
      name: 'Notificaciones',
      icon: <Bell size={20} />,
      description: 'Preferencias de notificaciones'
    },
    {
      id: 'security',
      name: 'Seguridad',
      icon: <Shield size={20} />,
      description: 'Configuración de seguridad y privacidad'
    },
    {
      id: 'preferences',
      name: 'Preferencias',
      icon: <Palette size={20} />,
      description: 'Apariencia y comportamiento'
    }
  ];

  // Calcular estadísticas
  const activeConfigurations = [
    profile.name !== getDefaultProfile().name,
    notifications.enabledTypes.includes('PRESUPUESTO_EXCEDIDO'),
    security.twoFactorAuth,
    preferences.colorScheme !== 'default'
  ].filter(Boolean).length;

  const totalConfigurations = 4;
  const completionPercentage = (activeConfigurations / totalConfigurations) * 100;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (clienteId != null) {
        const valor = JSON.stringify(notifications.enabledTypes);
        try {
          if (notifConfigId != null) {
            await configuracionesService.update(notifConfigId, { clave: CLAVE_TIPOS_NOTIFICACION, valor, tipo: 'JSON' });
          } else {
            const created = await configuracionesService.create({ clienteId, clave: CLAVE_TIPOS_NOTIFICACION, valor, tipo: 'JSON' });
            setNotifConfigId(created.id ?? null);
          }
        } catch (e) {
          toast.error(e instanceof Error ? e.message : 'Error al guardar las preferencias de notificaciones');
        }
      }
      setShowSuccess(true);
      toast.success('Cambios guardados');
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (!isStrongPassword(passwordData.new)) {
      toast.error(PASSWORD_REQUIREMENT_MESSAGE);
      return;
    }
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    setIsChangingPassword(true);
    try {
      await usuariosService.changePassword(userId, {
        passwordActual: passwordData.current,
        passwordNueva: passwordData.new,
      });
      toast.success('Contraseña actualizada');
      setPasswordData({ current: '', new: '', confirm: '' });
      setSecurity({ ...security, lastPasswordChange: new Date().toISOString() });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al cambiar la contraseña');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteConfirmText('');
    setDeletePassword('');
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    const userId = Number(localStorage.getItem('userId'));
    const username = localStorage.getItem('userName');
    if (!userId || !username) return;
    setIsDeletingAccount(true);
    try {
      // Re-verificar la contraseña actual contra el backend antes de un borrado irreversible
      await authService.login(username, deletePassword);
    } catch {
      toast.error('Contraseña incorrecta');
      setIsDeletingAccount(false);
      return;
    }
    try {
      if (clienteId != null) await clientesService.remove(clienteId);
      await usuariosService.remove(userId);
      logout();
      toast.success('Cuenta eliminada');
      navigate('/login');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al eliminar la cuenta');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const resetData = () => {
    if (window.confirm('¿Esto restaurará todas las configuraciones a los valores por defecto. ¿Continuar?')) {
      setProfile(getDefaultProfile());
      setNotifications(getDefaultNotifications());
      setSecurity(getDefaultSecurity());
      setPreferences(getDefaultPreferences());
      toast.success('Configuración restaurada a valores por defecto');
    }
  };

  // Skeleton Loader
  if (isLoading) {
    return (
      <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
        <div className="animate-pulse space-y-6">
          <div className="flex justify-between">
            <div className="h-8 w-48 bg-white/10 rounded-lg" />
            <div className="h-10 w-32 bg-white/10 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white/10 rounded-xl" />
            ))}
          </div>
          <div className="flex gap-6">
            <div className="w-64 h-96 bg-white/10 rounded-xl" />
            <div className="flex-1 h-96 bg-white/10 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 min-h-screen p-6"
      style={{ backgroundColor: '#1a0f14' }}
    >
      {/* Header Mejorado */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-r from-[#321D28] via-[#4a2d40] to-[#321D28] rounded-2xl p-6 border border-white/10 shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05984]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#BC455F]/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#F05984] to-[#BC455F] rounded-xl shadow-lg">
              <Settings size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Configuración</h1>
              <p className="text-white/50 text-sm mt-1">Personaliza tu experiencia en FinanSys</p>
            </div>
          </div>
          <div className="flex gap-2">
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-xl text-green-400 text-sm font-medium"
                >
                  <CheckCircleIcon size={16} />
                  <span>Cambios guardados</span>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300 disabled:opacity-50 font-medium"
            >
              {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{isSaving ? 'Guardando...' : 'Guardar cambios'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Tarjetas de Estadísticas Resumen */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Configuraciones Activas</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{activeConfigurations}/{totalConfigurations}</p>
              <p className="text-white/30 text-xs mt-1">Completado: {completionPercentage.toFixed(0)}%</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <Settings size={24} className="text-[#F05984]" />
            </div>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full"
            />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Última Actualización</p>
              <p className="text-2xl font-bold text-green-400 mt-1 tracking-tight">Hoy</p>
              <p className="text-white/30 text-xs mt-1">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <Activity size={24} className="text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#1e1b2e] to-[#2d2a3d] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Seguridad Activa</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1 tracking-tight">
                {security.twoFactorAuth ? 'Alta' : 'Media'}
              </p>
              <p className="text-white/30 text-xs mt-1">2FA: {security.twoFactorAuth ? 'Activado' : 'Desactivado'}</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <Shield size={24} className="text-yellow-400" />
            </div>
          </div>
        </motion.div>

      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar con animaciones */}
        <motion.div 
          variants={itemVariants}
          className="lg:w-64 space-y-1"
        >
          <AnimatePresence mode="wait">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeSection === section.id 
                    ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg shadow-[#F05984]/20' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="flex-shrink-0">{section.icon}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{section.name}</p>
                  <p className="text-xs opacity-70">{section.description}</p>
                </div>
                {activeSection === section.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Content con animación de entrada */}
        <motion.div 
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl"
        >
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <User size={18} className="text-[#F05984]" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <label className="text-white/60 text-sm mb-1 block">Nombre completo</label>
                    <input type="text" value={profile.name} readOnly className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 cursor-not-allowed" />
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <label className="text-white/60 text-sm mb-1 block">Usuario</label>
                    <input type="text" value={profile.username} readOnly className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 cursor-not-allowed" />
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <label className="text-white/60 text-sm mb-1 block">Email</label>
                    <input type="email" value={profile.email} readOnly className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 cursor-not-allowed" />
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <label className="text-white/60 text-sm mb-1 block">Teléfono</label>
                    <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors" />
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <label className="text-white/60 text-sm mb-1 block">Cargo</label>
                    <input type="text" value={profile.position} readOnly className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 cursor-not-allowed" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Target size={18} className="text-[#F05984]" />
                  Tipos de notificaciones
                </h3>
                <div className="space-y-3">
                  {NOTIFICATION_TYPES.map((t) => (
                    <CustomSwitch
                      key={t.value}
                      enabled={notifications.enabledTypes.includes(t.value)}
                      onChange={(val) => setNotifications({
                        ...notifications,
                        enabledTypes: val
                          ? [...notifications.enabledTypes, t.value]
                          : notifications.enabledTypes.filter(v => v !== t.value),
                      })}
                      label={t.label}
                      description={t.description}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Lock size={18} className="text-[#F05984]" />
                  Contraseña
                </h3>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <label className="text-white/60 text-sm mb-1 block">Contraseña actual</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={passwordData.current} onChange={(e) => setPasswordData({...passwordData, current: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <label className="text-white/60 text-sm mb-1 block">Nueva contraseña</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? 'text' : 'password'} value={passwordData.new} onChange={(e) => setPasswordData({...passwordData, new: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors" />
                      <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white">
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <label className="text-white/60 text-sm mb-1 block">Confirmar nueva contraseña</label>
                    <input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
                  >
                    {isChangingPassword ? 'Cambiando...' : 'Cambiar contraseña'}
                  </motion.button>
                  <p className="text-white/40 text-sm">Último cambio de contraseña: {new Date(security.lastPasswordChange).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Palette size={18} className="text-[#F05984]" />
                  Apariencia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <label className="text-white/60 text-sm mb-1 block">Tema</label>
                    <select value={preferences.theme} onChange={(e) => setPreferences({...preferences, theme: e.target.value as PreferenceSettings['theme']})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="dark">Oscuro</option>
                      <option value="light">Claro</option>
                    </select>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <label className="text-white/60 text-sm mb-1 block">Esquema de colores</label>
                    <select value={preferences.colorScheme} onChange={(e) => setPreferences({...preferences, colorScheme: e.target.value as PreferenceSettings['colorScheme']})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="default">Predeterminado</option>
                      <option value="blue">Azul</option>
                      <option value="green">Verde</option>
                      <option value="purple">Púrpura</option>
                    </select>
                    <p className="text-white/30 text-xs mt-1">Solo aplica con el tema oscuro</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <label className="text-white/60 text-sm mb-1 block">Tamaño de fuente</label>
                    <select value={preferences.fontSize} onChange={(e) => setPreferences({...preferences, fontSize: e.target.value as PreferenceSettings['fontSize']})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="small">Pequeño</option>
                      <option value="medium">Mediano</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#F05984]" />
                  Vistas predeterminadas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <label className="text-white/60 text-sm mb-1 block">Vista por defecto</label>
                    <select value={preferences.defaultView} onChange={(e) => setPreferences({...preferences, defaultView: e.target.value as PreferenceSettings['defaultView']})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="grid">Cuadrícula</option>
                      <option value="list">Lista</option>
                    </select>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <label className="text-white/60 text-sm mb-1 block">Elementos por página</label>
                    <select value={preferences.itemsPerPage} onChange={(e) => setPreferences({...preferences, itemsPerPage: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="space-y-4 p-5 border border-red-500/30 rounded-xl bg-red-500/5">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={20} className="text-red-400" />
                  <h3 className="text-red-400 font-semibold">Zona de peligro</h3>
                </div>
                <p className="text-white/60 text-sm">Estas acciones son irreversibles. Ten cuidado.</p>
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetData}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-400 hover:text-yellow-300 transition-all"
                  >
                    <RefreshCw size={16} />
                    <span>Restaurar configuración</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all"
                  >
                    <Trash2 size={16} />
                    <span>Eliminar cuenta</span>
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal de confirmación de eliminación mejorado */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertCircle className="text-red-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Eliminar cuenta</h2>
                  <p className="text-white/40 text-sm">Esta acción es irreversible</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-white/60 mb-4">¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible y perderás todos tus datos.</p>
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <p className="text-white text-sm mb-2">Por favor, escribe <span className="font-bold text-red-400">ELIMINAR</span> para confirmar:</p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-400 transition-all"
                    placeholder="ELIMINAR"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="delete-account-password" className="block text-white text-sm mb-2">
                    Confirma tu contraseña actual:
                  </label>
                  <input
                    id="delete-account-password"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-400 transition-all"
                    placeholder="Contraseña"
                    autoComplete="current-password"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmDeleteAccount}
                    disabled={deleteConfirmText !== 'ELIMINAR' || !deletePassword || isDeletingAccount}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isDeletingAccount ? 'Eliminando…' : 'Eliminar cuenta'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};