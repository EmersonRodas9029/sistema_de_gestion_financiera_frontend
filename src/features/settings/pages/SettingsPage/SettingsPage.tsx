import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Languages,
  DollarSign,
  Percent,
  Calendar,
  Clock,
  Mail,
  Phone,
  Lock,
  Key,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertCircle,
  Info,
  HelpCircle,
  LogOut,
  Trash2,
  Download,
  Upload,
  Printer,
  Share2,
  Link,
  Unlink,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  Fingerprint,
  Scan,
  Camera,
  Mic,
  Volume2,
  VolumeX,
  Vibrate,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  Server,
  Cloud,
  CloudOff,
  Database,
  HardDrive,
  Cpu,
  Thermometer,
  Fan,
  Droplet,
  Wind,
  Zap,
  ZapOff,
  Sun as SunIcon,
  Moon as MoonIcon,
  Sparkles,
  Palette,
  Brush,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListChecks,
  Minus,
  Plus,
  MinusCircle,
  PlusCircle,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Info as InfoIcon,
  HelpCircle as HelpCircleIcon
} from 'lucide-react';

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

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Configuración de perfil
  const [profile, setProfile] = useState<ProfileSettings>({
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

  // Configuración de notificaciones
  const [notifications, setNotifications] = useState<NotificationSettings>({
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

  // Configuración de seguridad
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    biometricLogin: true,
    sessionTimeout: 30,
    loginAlerts: true,
    deviceManagement: true,
    lastPasswordChange: '2024-01-15'
  });

  // Preferencias
  const [preferences, setPreferences] = useState<PreferenceSettings>({
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

  // Configuración de respaldo
  const [backup, setBackup] = useState<BackupSettings>({
    autoBackup: true,
    backupFrequency: 'weekly',
    backupLocation: 'cloud',
    lastBackup: '2024-02-23 03:00',
    backupSize: '2.4 GB',
    includeAttachments: true
  });

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
    },
    {
      id: 'billing',
      name: 'Facturación',
      icon: <CreditCard size={20} />,
      description: 'Métodos de pago y facturación'
    }
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // Mostrar notificación de éxito
    }, 1500);
  };

  const handleChangePassword = () => {
    console.log('Cambiar contraseña');
  };

  const handleExportData = () => {
    console.log('Exportar datos');
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-4">Información Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-sm mb-1 block">Nombre completo</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Teléfono</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Empresa</label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile({...profile, company: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
            />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Cargo</label>
            <input
              type="text"
              value={profile.position}
              onChange={(e) => setProfile({...profile, position: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Preferencias Regionales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-sm mb-1 block">Idioma</label>
            <select
              value={profile.language}
              onChange={(e) => setProfile({...profile, language: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="fr">Francés</option>
              <option value="de">Alemán</option>
            </select>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Zona horaria</label>
            <select
              value={profile.timezone}
              onChange={(e) => setProfile({...profile, timezone: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
            >
              <option value="Europe/Madrid">Madrid</option>
              <option value="Europe/London">Londres</option>
              <option value="America/New_York">Nueva York</option>
              <option value="America/Mexico_City">Ciudad de México</option>
            </select>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Formato de fecha</label>
            <select
              value={profile.dateFormat}
              onChange={(e) => setProfile({...profile, dateFormat: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Moneda</label>
            <select
              value={profile.currency}
              onChange={(e) => setProfile({...profile, currency: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
            >
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="GBP">GBP £</option>
              <option value="MXN">MXN $</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-4">Canales de notificación</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Email</p>
              <p className="text-white/40 text-sm">Recibir notificaciones por correo electrónico</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailNotifications}
              onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Push</p>
              <p className="text-white/40 text-sm">Notificaciones push en el navegador</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.pushNotifications}
              onChange={(e) => setNotifications({...notifications, pushNotifications: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">SMS</p>
              <p className="text-white/40 text-sm">Mensajes de texto</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.smsNotifications}
              onChange={(e) => setNotifications({...notifications, smsNotifications: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Tipos de notificaciones</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Recordatorios de metas</p>
              <p className="text-white/40 text-sm">Recordatorios sobre tus metas de ahorro</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.goalReminders}
              onChange={(e) => setNotifications({...notifications, goalReminders: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Recordatorios de pagos</p>
              <p className="text-white/40 text-sm">Alertas de pagos próximos a vencer</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.paymentReminders}
              onChange={(e) => setNotifications({...notifications, paymentReminders: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Alertas de presupuesto</p>
              <p className="text-white/40 text-sm">Notificaciones cuando te acerques al límite</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.budgetAlerts}
              onChange={(e) => setNotifications({...notifications, budgetAlerts: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Reportes semanales</p>
              <p className="text-white/40 text-sm">Resumen semanal de tus finanzas</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weeklyReports}
              onChange={(e) => setNotifications({...notifications, weeklyReports: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Reportes mensuales</p>
              <p className="text-white/40 text-sm">Resumen mensual detallado</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.monthlyReports}
              onChange={(e) => setNotifications({...notifications, monthlyReports: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-4">Contraseña</h3>
        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-sm mb-1 block">Contraseña actual</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Nueva contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Confirmar nueva contraseña</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-colors"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Cambiar contraseña
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Autenticación</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Autenticación de dos factores</p>
              <p className="text-white/40 text-sm">Añade una capa extra de seguridad</p>
            </div>
            <input
              type="checkbox"
              checked={security.twoFactorAuth}
              onChange={(e) => setSecurity({...security, twoFactorAuth: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Login biométrico</p>
              <p className="text-white/40 text-sm">Usa huella digital o reconocimiento facial</p>
            </div>
            <input
              type="checkbox"
              checked={security.biometricLogin}
              onChange={(e) => setSecurity({...security, biometricLogin: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Alertas de inicio de sesión</p>
              <p className="text-white/40 text-sm">Notificaciones de nuevos accesos</p>
            </div>
            <input
              type="checkbox"
              checked={security.loginAlerts}
              onChange={(e) => setSecurity({...security, loginAlerts: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Sesión</h3>
        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-sm mb-1 block">Tiempo de sesión (minutos)</label>
            <select
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
              <option value="120">2 horas</option>
            </select>
          </div>
          <p className="text-white/40 text-sm">
            Último cambio de contraseña: {new Date(security.lastPasswordChange).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-4">Apariencia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-sm mb-1 block">Tema</label>
            <select
              value={preferences.theme}
              onChange={(e) => setPreferences({...preferences, theme: e.target.value as any})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="system">Sistema</option>
            </select>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Esquema de colores</label>
            <select
              value={preferences.colorScheme}
              onChange={(e) => setPreferences({...preferences, colorScheme: e.target.value})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
            >
              <option value="default">Predeterminado</option>
              <option value="blue">Azul</option>
              <option value="green">Verde</option>
              <option value="purple">Púrpura</option>
            </select>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Tamaño de fuente</label>
            <select
              value={preferences.fontSize}
              onChange={(e) => setPreferences({...preferences, fontSize: e.target.value as any})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
            >
              <option value="small">Pequeño</option>
              <option value="medium">Mediano</option>
              <option value="large">Grande</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Comportamiento</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Modo compacto</p>
              <p className="text-white/40 text-sm">Mostrar más información en menos espacio</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.compactMode}
              onChange={(e) => setPreferences({...preferences, compactMode: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Animaciones</p>
              <p className="text-white/40 text-sm">Efectos visuales en la interfaz</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.animations}
              onChange={(e) => setPreferences({...preferences, animations: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Efectos de sonido</p>
              <p className="text-white/40 text-sm">Reproducir sonidos en acciones</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.soundEffects}
              onChange={(e) => setPreferences({...preferences, soundEffects: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Vistas predeterminadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-white/60 text-sm mb-1 block">Vista por defecto</label>
            <select
              value={preferences.defaultView}
              onChange={(e) => setPreferences({...preferences, defaultView: e.target.value as any})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
            >
              <option value="grid">Cuadrícula</option>
              <option value="list">Lista</option>
            </select>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">Elementos por página</label>
            <select
              value={preferences.itemsPerPage}
              onChange={(e) => setPreferences({...preferences, itemsPerPage: parseInt(e.target.value)})}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-4">Configuración de respaldo</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Respaldo automático</p>
              <p className="text-white/40 text-sm">Realizar copias de seguridad automáticas</p>
            </div>
            <input
              type="checkbox"
              checked={backup.autoBackup}
              onChange={(e) => setBackup({...backup, autoBackup: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
            />
          </label>

          {backup.autoBackup && (
            <>
              <div>
                <label className="text-white/60 text-sm mb-1 block">Frecuencia de respaldo</label>
                <select
                  value={backup.backupFrequency}
                  onChange={(e) => setBackup({...backup, backupFrequency: e.target.value as any})}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
                >
                  <option value="daily">Diario</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1 block">Ubicación de respaldo</label>
                <select
                  value={backup.backupLocation}
                  onChange={(e) => setBackup({...backup, backupLocation: e.target.value})}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
                >
                  <option value="cloud">Nube</option>
                  <option value="local">Local</option>
                  <option value="external">Externo</option>
                </select>
              </div>

              <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">Incluir archivos adjuntos</p>
                  <p className="text-white/40 text-sm">Respaldar también los archivos</p>
                </div>
                <input
                  type="checkbox"
                  checked={backup.includeAttachments}
                  onChange={(e) => setBackup({...backup, includeAttachments: e.target.checked})}
                  className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984]"
                />
              </label>
            </>
          )}
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">Último respaldo</h3>
        <div className="space-y-2">
          <p className="text-white/60 text-sm">Fecha: {backup.lastBackup}</p>
          <p className="text-white/60 text-sm">Tamaño: {backup.backupSize}</p>
        </div>
        <div className="flex gap-2 mt-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
            <Download size={16} />
            <span>Descargar respaldo</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
            <Upload size={16} />
            <span>Restaurar</span>
          </button>
        </div>
      </div>

      <div>
        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
        >
          <Download size={16} />
          <span>Exportar todos los datos</span>
        </button>
      </div>
    </div>
  );

  const renderBillingSection = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">Plan actual</h3>
        <p className="text-2xl font-bold text-white">Profesional</p>
        <p className="text-white/60 text-sm mt-1">$29.99/mes</p>
        <button className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
          Cambiar plan
        </button>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Métodos de pago</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-white/60" />
              <div>
                <p className="text-white font-medium">Visa terminada en 4242</p>
                <p className="text-white/40 text-sm">Expira 12/25</p>
              </div>
            </div>
            <button className="text-red-400 hover:text-red-300">Eliminar</button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
            <Plus size={16} />
            <span>Añadir método de pago</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-4">Historial de facturas</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Factura #INV-2024-001</p>
              <p className="text-white/40 text-sm">15 febrero 2024</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white">$29.99</span>
              <button className="text-[#F05984] hover:text-[#d14d75]">Ver</button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Factura #INV-2024-002</p>
              <p className="text-white/40 text-sm">15 enero 2024</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white">$29.99</span>
              <button className="text-[#F05984] hover:text-[#d14d75]">Ver</button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">Factura #INV-2023-012</p>
              <p className="text-white/40 text-sm">15 diciembre 2023</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white">$29.99</span>
              <button className="text-[#F05984] hover:text-[#d14d75]">Ver</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDangerZone = () => (
    <div className="space-y-4 p-4 border border-red-500/30 rounded-lg bg-red-500/5">
      <h3 className="text-red-400 font-semibold">Zona de peligro</h3>
      <p className="text-white/60 text-sm">Estas acciones son irreversibles. Ten cuidado.</p>
      
      <div className="space-y-3">
        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 size={16} />
          <span>Eliminar cuenta</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Configuración</h1>
          <p className="text-white/60 text-sm mt-1">
            Personaliza tu experiencia en FinanSys
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{isSaving ? 'Guardando...' : 'Guardar cambios'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-[#F05984] text-white shadow-lg shadow-[#F05984]/20'
                  : 'text-white/70 hover:bg-[#F05984]/20 hover:text-white hover:translate-x-1'
              }`}
            >
              <span className="flex-shrink-0">{section.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{section.name}</p>
                <p className="text-xs opacity-60">{section.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          {activeSection === 'profile' && renderProfileSection()}
          {activeSection === 'notifications' && renderNotificationsSection()}
          {activeSection === 'security' && renderSecuritySection()}
          {activeSection === 'preferences' && renderPreferencesSection()}
          {activeSection === 'backup' && renderBackupSection()}
          {activeSection === 'billing' && renderBillingSection()}

          {/* Danger Zone - siempre visible al final */}
          <div className="mt-8 pt-6 border-t border-white/10">
            {renderDangerZone()}
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertCircle className="text-red-400" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Eliminar cuenta</h2>
              </div>
              
              <p className="text-white/60 mb-4">
                ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible y perderás todos tus datos.
              </p>

              <div className="bg-white/5 rounded-lg p-3 mb-4">
                <p className="text-white text-sm">
                  Por favor, escribe <span className="font-bold">ELIMINAR</span> para confirmar:
                </p>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-400 mt-2"
                  placeholder="ELIMINAR"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors">
                  Eliminar cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
