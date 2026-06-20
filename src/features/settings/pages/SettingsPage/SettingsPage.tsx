import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertCircle,
  Trash2,
  Download,
  Upload,
  Database,
  Cloud,
  Target,
  Activity,
  BarChart3,
  Palette,
  CheckCircle as CheckCircleIcon,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Switch } from '@headlessui/react';
import { containerVariants, itemVariants } from '../../../../shared/utils';

interface SettingsSection {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface ProfileSettings {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  avatar?: string;
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  goalReminders: boolean;
  paymentReminders: boolean;
  budgetAlerts: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  biometricLogin: boolean;
  sessionTimeout: number;
  loginAlerts: boolean;
  deviceManagement: boolean;
  lastPasswordChange: string;
}

interface PreferenceSettings {
  theme: 'light' | 'dark' | 'system';
  colorScheme: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  animations: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  defaultView: 'grid' | 'list';
  itemsPerPage: number;
}

interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupLocation: string;
  lastBackup: string;
  backupSize: string;
  includeAttachments: boolean;
}

// Datos iniciales por defecto
const getDefaultProfile = (): ProfileSettings => ({
  name: 'Emerson Rodríguez',
  email: 'emerson@finansys.com',
  phone: '+34 612 345 678',
  company: 'FinanSys Solutions',
  position: 'Administrador',
  language: 'es',
  timezone: 'Europe/Madrid',
  dateFormat: 'DD/MM/YYYY',
  currency: 'USD'
});

const getDefaultNotifications = (): NotificationSettings => ({
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  marketingEmails: false,
  goalReminders: true,
  paymentReminders: true,
  budgetAlerts: true,
  weeklyReports: true,
  monthlyReports: true
});

const getDefaultSecurity = (): SecuritySettings => ({
  twoFactorAuth: false,
  biometricLogin: true,
  sessionTimeout: 30,
  loginAlerts: true,
  deviceManagement: true,
  lastPasswordChange: '2024-01-15'
});

const getDefaultPreferences = (): PreferenceSettings => ({
  theme: 'dark',
  colorScheme: 'default',
  fontSize: 'medium',
  compactMode: false,
  animations: true,
  soundEffects: true,
  hapticFeedback: false,
  defaultView: 'grid',
  itemsPerPage: 20
});

const getDefaultBackup = (): BackupSettings => ({
  autoBackup: true,
  backupFrequency: 'weekly',
  backupLocation: 'cloud',
  lastBackup: '2024-02-23 03:00',
  backupSize: '2.4 GB',
  includeAttachments: true
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
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Cargar configuraciones desde localStorage
  const [profile, setProfile] = useState<ProfileSettings>(() => {
    const saved = localStorage.getItem('settings_profile');
    return saved ? JSON.parse(saved) : getDefaultProfile();
  });

  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('settings_notifications');
    return saved ? JSON.parse(saved) : getDefaultNotifications();
  });

  const [security, setSecurity] = useState<SecuritySettings>(() => {
    const saved = localStorage.getItem('settings_security');
    return saved ? JSON.parse(saved) : getDefaultSecurity();
  });

  const [preferences, setPreferences] = useState<PreferenceSettings>(() => {
    const saved = localStorage.getItem('settings_preferences');
    return saved ? JSON.parse(saved) : getDefaultPreferences();
  });

  const [backup, setBackup] = useState<BackupSettings>(() => {
    const saved = localStorage.getItem('settings_backup');
    return saved ? JSON.parse(saved) : getDefaultBackup();
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
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('settings_backup', JSON.stringify(backup));
  }, [backup]);

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
    },
    {
      id: 'backup',
      name: 'Respaldo',
      icon: <Database size={20} />,
      description: 'Configuración de copias de seguridad'
    }
  ];

  // Calcular estadísticas
  const activeConfigurations = [
    profile.name !== getDefaultProfile().name,
    notifications.emailNotifications,
    security.twoFactorAuth,
    preferences.animations,
    backup.autoBackup
  ].filter(Boolean).length;

  const totalConfigurations = 5;
  const completionPercentage = (activeConfigurations / totalConfigurations) * 100;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (passwordData.new.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    console.log('Cambiar contraseña:', passwordData);
    setPasswordData({ current: '', new: '', confirm: '' });
    alert('Contraseña actualizada correctamente');
  };

  const handleExportData = () => {
    const data = {
      profile,
      notifications,
      security,
      preferences,
      backup
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finansys_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const resetData = () => {
    if (window.confirm('¿Esto restaurará todas las configuraciones a los valores por defecto. ¿Continuar?')) {
      setProfile(getDefaultProfile());
      setNotifications(getDefaultNotifications());
      setSecurity(getDefaultSecurity());
      setPreferences(getDefaultPreferences());
      setBackup(getDefaultBackup());
      alert('Configuración restaurada a valores por defecto');
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
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#1a2e2a] to-[#2d403a] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Último Respaldo</p>
              <p className="text-2xl font-bold text-blue-400 mt-1 tracking-tight">Exitoso</p>
              <p className="text-white/30 text-xs mt-1">{backup.lastBackup}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Database size={24} className="text-blue-400" />
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
                    <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors" />
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <label className="text-white/60 text-sm mb-1 block">Email</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors" />
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <label className="text-white/60 text-sm mb-1 block">Teléfono</label>
                    <input type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors" />
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <label className="text-white/60 text-sm mb-1 block">Empresa</label>
                    <input type="text" value={profile.company} onChange={(e) => setProfile({...profile, company: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors" />
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <label className="text-white/60 text-sm mb-1 block">Cargo</label>
                    <input type="text" value={profile.position} onChange={(e) => setProfile({...profile, position: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Globe size={18} className="text-[#F05984]" />
                  Preferencias Regionales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <label className="text-white/60 text-sm mb-1 block">Idioma</label>
                    <select value={profile.language} onChange={(e) => setProfile({...profile, language: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="es" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Español</option>
                      <option value="en" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Inglés</option>
                      <option value="fr" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Francés</option>
                      <option value="de" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Alemán</option>
                    </select>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <label className="text-white/60 text-sm mb-1 block">Zona horaria</label>
                    <select value={profile.timezone} onChange={(e) => setProfile({...profile, timezone: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="Europe/Madrid" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Madrid</option>
                      <option value="Europe/London" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Londres</option>
                      <option value="America/New_York" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Nueva York</option>
                      <option value="America/Mexico_City" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Ciudad de México</option>
                    </select>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <label className="text-white/60 text-sm mb-1 block">Formato de fecha</label>
                    <select value={profile.dateFormat} onChange={(e) => setProfile({...profile, dateFormat: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="DD/MM/YYYY" style={{ backgroundColor: '#1a0f14', color: 'white' }}>DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY" style={{ backgroundColor: '#1a0f14', color: 'white' }}>MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD" style={{ backgroundColor: '#1a0f14', color: 'white' }}>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
                    <label className="text-white/60 text-sm mb-1 block">Moneda</label>
                    <select value={profile.currency} onChange={(e) => setProfile({...profile, currency: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="USD" style={{ backgroundColor: '#1a0f14', color: 'white' }}>USD $</option>
                      <option value="EUR" style={{ backgroundColor: '#1a0f14', color: 'white' }}>EUR €</option>
                      <option value="GBP" style={{ backgroundColor: '#1a0f14', color: 'white' }}>GBP £</option>
                      <option value="MXN" style={{ backgroundColor: '#1a0f14', color: 'white' }}>MXN $</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Bell size={18} className="text-[#F05984]" />
                  Canales de notificación
                </h3>
                <div className="space-y-3">
                  <CustomSwitch
                    enabled={notifications.emailNotifications}
                    onChange={(val) => setNotifications({...notifications, emailNotifications: val})}
                    label="Email"
                    description="Recibir notificaciones por correo electrónico"
                  />
                  <CustomSwitch
                    enabled={notifications.pushNotifications}
                    onChange={(val) => setNotifications({...notifications, pushNotifications: val})}
                    label="Push"
                    description="Notificaciones push en el navegador"
                  />
                  <CustomSwitch
                    enabled={notifications.smsNotifications}
                    onChange={(val) => setNotifications({...notifications, smsNotifications: val})}
                    label="SMS"
                    description="Mensajes de texto"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Target size={18} className="text-[#F05984]" />
                  Tipos de notificaciones
                </h3>
                <div className="space-y-3">
                  <CustomSwitch
                    enabled={notifications.goalReminders}
                    onChange={(val) => setNotifications({...notifications, goalReminders: val})}
                    label="Recordatorios de metas"
                    description="Recordatorios sobre tus metas de ahorro"
                  />
                  <CustomSwitch
                    enabled={notifications.paymentReminders}
                    onChange={(val) => setNotifications({...notifications, paymentReminders: val})}
                    label="Recordatorios de pagos"
                    description="Alertas de pagos próximos a vencer"
                  />
                  <CustomSwitch
                    enabled={notifications.budgetAlerts}
                    onChange={(val) => setNotifications({...notifications, budgetAlerts: val})}
                    label="Alertas de presupuesto"
                    description="Notificaciones cuando te acerques al límite"
                  />
                  <CustomSwitch
                    enabled={notifications.weeklyReports}
                    onChange={(val) => setNotifications({...notifications, weeklyReports: val})}
                    label="Reportes semanales"
                    description="Resumen semanal de tus finanzas"
                  />
                  <CustomSwitch
                    enabled={notifications.monthlyReports}
                    onChange={(val) => setNotifications({...notifications, monthlyReports: val})}
                    label="Reportes mensuales"
                    description="Resumen mensual detallado"
                  />
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
                    className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    Cambiar contraseña
                  </motion.button>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-[#F05984]" />
                  Autenticación
                </h3>
                <div className="space-y-3">
                  <CustomSwitch
                    enabled={security.twoFactorAuth}
                    onChange={(val) => setSecurity({...security, twoFactorAuth: val})}
                    label="Autenticación de dos factores"
                    description="Añade una capa extra de seguridad"
                  />
                  <CustomSwitch
                    enabled={security.biometricLogin}
                    onChange={(val) => setSecurity({...security, biometricLogin: val})}
                    label="Login biométrico"
                    description="Usa huella digital o reconocimiento facial"
                  />
                  <CustomSwitch
                    enabled={security.loginAlerts}
                    onChange={(val) => setSecurity({...security, loginAlerts: val})}
                    label="Alertas de inicio de sesión"
                    description="Notificaciones de nuevos accesos"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-[#F05984]" />
                  Sesión
                </h3>
                <div className="bg-white/5 rounded-xl p-4">
                  <label className="text-white/60 text-sm mb-1 block">Tiempo de sesión (minutos)</label>
                  <select value={security.sessionTimeout} onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="60">1 hora</option>
                    <option value="120">2 horas</option>
                  </select>
                  <p className="text-white/40 text-sm mt-2">Último cambio de contraseña: {new Date(security.lastPasswordChange).toLocaleDateString()}</p>
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
                      <option value="light">Claro</option>
                      <option value="dark">Oscuro</option>
                      <option value="system">Sistema</option>
                    </select>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <label className="text-white/60 text-sm mb-1 block">Esquema de colores</label>
                    <select value={preferences.colorScheme} onChange={(e) => setPreferences({...preferences, colorScheme: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="default">Predeterminado</option>
                      <option value="blue">Azul</option>
                      <option value="green">Verde</option>
                      <option value="purple">Púrpura</option>
                    </select>
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
                  <Activity size={18} className="text-[#F05984]" />
                  Comportamiento
                </h3>
                <div className="space-y-3">
                  <CustomSwitch
                    enabled={preferences.compactMode}
                    onChange={(val) => setPreferences({...preferences, compactMode: val})}
                    label="Modo compacto"
                    description="Mostrar más información en menos espacio"
                  />
                  <CustomSwitch
                    enabled={preferences.animations}
                    onChange={(val) => setPreferences({...preferences, animations: val})}
                    label="Animaciones"
                    description="Efectos visuales en la interfaz"
                  />
                  <CustomSwitch
                    enabled={preferences.soundEffects}
                    onChange={(val) => setPreferences({...preferences, soundEffects: val})}
                    label="Efectos de sonido"
                    description="Reproducir sonidos en acciones"
                  />
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

          {activeSection === 'backup' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Database size={18} className="text-[#F05984]" />
                  Configuración de respaldo
                </h3>
                <div className="space-y-4">
                  <CustomSwitch
                    enabled={backup.autoBackup}
                    onChange={(val) => setBackup({...backup, autoBackup: val})}
                    label="Respaldo automático"
                    description="Realizar copias de seguridad automáticas"
                  />
                  {backup.autoBackup && (
                    <>
                      <div className="bg-white/5 rounded-xl p-4">
                        <label className="text-white/60 text-sm mb-1 block">Frecuencia de respaldo</label>
                        <select value={backup.backupFrequency} onChange={(e) => setBackup({...backup, backupFrequency: e.target.value as BackupSettings['backupFrequency']})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                          <option value="daily">Diario</option>
                          <option value="weekly">Semanal</option>
                          <option value="monthly">Mensual</option>
                        </select>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <label className="text-white/60 text-sm mb-1 block">Ubicación de respaldo</label>
                        <select value={backup.backupLocation} onChange={(e) => setBackup({...backup, backupLocation: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                          <option value="cloud">Nube</option>
                          <option value="local">Local</option>
                          <option value="external">Externo</option>
                        </select>
                      </div>
                      <CustomSwitch
                        enabled={backup.includeAttachments}
                        onChange={(val) => setBackup({...backup, includeAttachments: val})}
                        label="Incluir archivos adjuntos"
                        description="Respaldar también los archivos"
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-5 border border-white/10">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Cloud size={18} className="text-[#F05984]" />
                  Último respaldo
                </h3>
                <div className="space-y-2">
                  <p className="text-white/60 text-sm">Fecha: <span className="text-white">{backup.lastBackup}</span></p>
                  <p className="text-white/60 text-sm">Tamaño: <span className="text-white">{backup.backupSize}</span></p>
                </div>
                <div className="flex gap-3 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-all"
                  >
                    <Download size={16} />
                    <span>Descargar respaldo</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-all"
                  >
                    <Upload size={16} />
                    <span>Restaurar</span>
                  </motion.button>
                </div>
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition-all"
                >
                  <Download size={16} />
                  <span>Exportar todos los datos</span>
                </motion.button>
              </div>
            </div>
          )}

          {/* Danger Zone */}
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
                  <input type="text" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-400 transition-all" placeholder="ELIMINAR" />
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
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all font-medium"
                  >
                    Eliminar cuenta
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