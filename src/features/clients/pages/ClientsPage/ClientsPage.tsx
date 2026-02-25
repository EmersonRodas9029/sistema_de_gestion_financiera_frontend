import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  Building2,
  Briefcase,
  Star,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  Activity,
  MessageCircle,
  FileText,
  Settings,
  User,
  UserCheck,
  UserX,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  DollarSign as DollarSignIcon,
  TrendingUp as TrendingUpIcon,
  CreditCard as CreditCardIcon,
  Wallet as WalletIcon,
  Building2 as Building2Icon,
  Briefcase as BriefcaseIcon,
  Star as StarIcon,
  Award as AwardIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  AlertCircle as AlertCircleIcon,
  X,
  Save,
  Plus,
  Upload,
  Camera,
  Lock,
  Unlock,
  Ban,
  RefreshCcw,
  Send,
  Printer,
  Share2,
  Link,
  Copy,
  Flag,
  Tag,
  FolderTree,
  Archive,
  ArchiveRestore,
  Bell,
  BellOff,
  Shield,
  ShieldOff,
  Key,
  Fingerprint,
  Globe,
  Languages,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
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
  MinusCircle,
  PlusCircle,
  XCircle as XCircleIcon2,
  CheckCircle as CheckCircleIcon2,
  AlertTriangle,
  Info,
  HelpCircle
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  city: string;
  country: string;
  type: 'individual' | 'company' | 'enterprise';
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'blocked';
  plan: 'basic' | 'professional' | 'enterprise' | 'custom' | 'trial';
  since: string;
  lastLogin: string;
  lastContact: string;
  totalTransactions: number;
  totalSpent: number;
  totalInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  averageTicket: number;
  creditLimit?: number;
  currentCredit?: number;
  paymentMethod: string;
  paymentTerms: string;
  taxId?: string;
  website?: string;
  notes?: string;
  tags: string[];
  avatar?: string;
  contacts?: Contact[];
  projects?: Project[];
  documents?: Document[];
  activityLog?: Activity[];
  settings?: ClientSettings;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  primary: boolean;
}

interface Project {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  budget: number;
  spent: number;
  progress: number;
  startDate: string;
  endDate: string;
}

interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'contract' | 'proposal' | 'report' | 'other';
  size: string;
  date: string;
  url: string;
}

interface Activity {
  id: string;
  type: 'login' | 'transaction' | 'payment' | 'document' | 'note' | 'status';
  description: string;
  date: string;
  user?: string;
}

interface ClientSettings {
  notifications: boolean;
  autoInvoices: boolean;
  paymentReminders: boolean;
  monthlyReports: boolean;
  twoFactorAuth: boolean;
  apiAccess: boolean;
  customDomain?: string;
}

interface ClientSummary {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  pendingClients: number;
  suspendedClients: number;
  blockedClients: number;
  trialClients: number;
  totalRevenue: number;
  averageSpent: number;
  topClients: number;
  newThisMonth: number;
  newThisWeek: number;
  churnRate: number;
  growth: number;
  projectedRevenue: number;
}

export const ClientsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPlan, setSelectedPlan] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'detailed'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'spent' | 'transactions' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [dateRange, setDateRange] = useState<{start: string; end: string}>({
    start: '',
    end: ''
  });

  const itemsPerPage = 12;

  // Resumen de clientes
  const summary: ClientSummary = {
    totalClients: 156,
    activeClients: 128,
    inactiveClients: 12,
    pendingClients: 8,
    suspendedClients: 5,
    blockedClients: 3,
    trialClients: 15,
    totalRevenue: 285450.75,
    averageSpent: 2230.50,
    topClients: 15,
    newThisMonth: 12,
    newThisWeek: 3,
    churnRate: 2.5,
    growth: 8.5,
    projectedRevenue: 325000
  };

  // Datos de ejemplo - Clientes
  const clients: Client[] = [
    {
      id: 'CLI-001',
      name: 'María González',
      email: 'maria.gonzalez@techsolutions.com',
      phone: '+34 612 345 678',
      company: 'Tech Solutions S.L.',
      position: 'CEO & Fundadora',
      address: 'Calle Mayor 123',
      city: 'Madrid',
      country: 'España',
      type: 'company',
      status: 'active',
      plan: 'enterprise',
      since: '2023-01-15',
      lastLogin: '2024-02-24 09:30',
      lastContact: '2024-02-23',
      totalTransactions: 145,
      totalSpent: 45250.75,
      totalInvoices: 28,
      pendingInvoices: 2,
      overdueInvoices: 0,
      averageTicket: 312.50,
      creditLimit: 50000,
      currentCredit: 12500,
      paymentMethod: 'transferencia',
      paymentTerms: '30 días',
      taxId: 'B-12345678',
      website: 'www.techsolutions.com',
      notes: 'Cliente VIP, proyectos recurrentes',
      tags: ['vip', 'tecnología', 'recurrente'],
      avatar: 'https://i.pravatar.cc/150?u=1',
      settings: {
        notifications: true,
        autoInvoices: true,
        paymentReminders: true,
        monthlyReports: true,
        twoFactorAuth: true,
        apiAccess: true
      },
      contacts: [
        {
          id: 'CON-001',
          name: 'Carlos Rodríguez',
          email: 'carlos.r@techsolutions.com',
          phone: '+34 623 456 789',
          position: 'CTO',
          primary: false
        }
      ],
      projects: [
        {
          id: 'PROJ-001',
          name: 'Desarrollo Web App',
          status: 'in-progress',
          budget: 15000,
          spent: 9750,
          progress: 65,
          startDate: '2024-01-10',
          endDate: '2024-04-30'
        }
      ],
      documents: [
        {
          id: 'DOC-001',
          name: 'Contrato anual 2024',
          type: 'contract',
          size: '2.4 MB',
          date: '2024-01-10',
          url: '#'
        }
      ],
      activityLog: [
        {
          id: 'ACT-001',
          type: 'login',
          description: 'Inicio de sesión',
          date: '2024-02-24 09:30'
        },
        {
          id: 'ACT-002',
          type: 'payment',
          description: 'Pago recibido $2,500',
          date: '2024-02-23 15:20'
        }
      ]
    },
    {
      id: 'CLI-002',
      name: 'Juan Pérez',
      email: 'juan.perez@gmail.com',
      phone: '+34 634 567 890',
      company: 'Freelance',
      position: 'Diseñador Gráfico',
      address: 'Av. Diagonal 456',
      city: 'Barcelona',
      country: 'España',
      type: 'individual',
      status: 'active',
      plan: 'professional',
      since: '2023-03-20',
      lastLogin: '2024-02-23 14:15',
      lastContact: '2024-02-22',
      totalTransactions: 67,
      totalSpent: 12450.00,
      totalInvoices: 15,
      pendingInvoices: 1,
      overdueInvoices: 0,
      averageTicket: 185.50,
      paymentMethod: 'tarjeta',
      paymentTerms: '15 días',
      tags: ['freelance', 'diseño'],
      avatar: 'https://i.pravatar.cc/150?u=2',
      settings: {
        notifications: true,
        autoInvoices: false,
        paymentReminders: true,
        monthlyReports: false,
        twoFactorAuth: false,
        apiAccess: false
      }
    },
    {
      id: 'CLI-003',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@constructora.com',
      phone: '+34 645 678 901',
      company: 'Constructora Rodríguez S.A.',
      position: 'Gerente de Proyectos',
      address: 'Plaza Mayor 78',
      city: 'Valencia',
      country: 'España',
      type: 'enterprise',
      status: 'active',
      plan: 'enterprise',
      since: '2022-11-05',
      lastLogin: '2024-02-22 11:30',
      lastContact: '2024-02-21',
      totalTransactions: 234,
      totalSpent: 89750.25,
      totalInvoices: 42,
      pendingInvoices: 3,
      overdueInvoices: 1,
      averageTicket: 385.00,
      creditLimit: 100000,
      currentCredit: 34500,
      paymentMethod: 'transferencia',
      paymentTerms: '45 días',
      taxId: 'A-87654321',
      website: 'www.constructorarodriguez.com',
      tags: ['construcción', 'empresa', 'vip'],
      avatar: 'https://i.pravatar.cc/150?u=3',
      settings: {
        notifications: true,
        autoInvoices: true,
        paymentReminders: true,
        monthlyReports: true,
        twoFactorAuth: true,
        apiAccess: true
      }
    },
    {
      id: 'CLI-004',
      name: 'Ana Martínez',
      email: 'ana.martinez@estudio.com',
      phone: '+34 656 789 012',
      company: 'Estudio Creativo Ana',
      position: 'Directora Creativa',
      address: 'Calle San Francisco 234',
      city: 'Sevilla',
      country: 'España',
      type: 'individual',
      status: 'active',
      plan: 'professional',
      since: '2023-06-12',
      lastLogin: '2024-02-21 16:45',
      lastContact: '2024-02-20',
      totalTransactions: 89,
      totalSpent: 18750.50,
      totalInvoices: 18,
      pendingInvoices: 0,
      overdueInvoices: 0,
      averageTicket: 210.50,
      paymentMethod: 'tarjeta',
      paymentTerms: '30 días',
      tags: ['creativo', 'diseño'],
      avatar: 'https://i.pravatar.cc/150?u=4'
    },
    {
      id: 'CLI-005',
      name: 'Roberto Sánchez',
      email: 'roberto.sanchez@hotmail.com',
      phone: '+34 667 890 123',
      company: 'Independiente',
      position: 'Consultor',
      address: 'Av. de la Constitución 567',
      city: 'Málaga',
      country: 'España',
      type: 'individual',
      status: 'pending',
      plan: 'trial',
      since: '2024-02-01',
      lastLogin: '2024-02-19 10:20',
      lastContact: '2024-02-19',
      totalTransactions: 12,
      totalSpent: 2350.00,
      totalInvoices: 3,
      pendingInvoices: 2,
      overdueInvoices: 0,
      averageTicket: 195.50,
      paymentMethod: 'efectivo',
      paymentTerms: 'contado',
      tags: ['consultoría', 'nuevo'],
      avatar: 'https://i.pravatar.cc/150?u=5',
      settings: {
        notifications: true,
        autoInvoices: false,
        paymentReminders: true,
        monthlyReports: false,
        twoFactorAuth: false,
        apiAccess: false
      }
    },
    {
      id: 'CLI-006',
      name: 'Laura Torres',
      email: 'laura.torres@innovatech.com',
      phone: '+34 678 901 234',
      company: 'Innovatech Solutions',
      position: 'Product Manager',
      address: 'Calle de la Innovación 123',
      city: 'Bilbao',
      country: 'España',
      type: 'company',
      status: 'active',
      plan: 'professional',
      since: '2023-09-18',
      lastLogin: '2024-02-20 09:15',
      lastContact: '2024-02-18',
      totalTransactions: 56,
      totalSpent: 23450.75,
      totalInvoices: 12,
      pendingInvoices: 1,
      overdueInvoices: 0,
      averageTicket: 420.00,
      paymentMethod: 'transferencia',
      paymentTerms: '30 días',
      taxId: 'B-98765432',
      website: 'www.innovatech.com',
      tags: ['tecnología', 'innovación'],
      avatar: 'https://i.pravatar.cc/150?u=6'
    },
    {
      id: 'CLI-007',
      name: 'David Fernández',
      email: 'david.fernandez@abogados.com',
      phone: '+34 689 012 345',
      company: 'Bufete Fernández Asociados',
      position: 'Socio Director',
      address: 'Paseo de Gracia 890',
      city: 'Barcelona',
      country: 'España',
      type: 'company',
      status: 'inactive',
      plan: 'basic',
      since: '2022-05-10',
      lastLogin: '2024-01-15 08:30',
      lastContact: '2024-01-15',
      totalTransactions: 34,
      totalSpent: 8750.00,
      totalInvoices: 8,
      pendingInvoices: 0,
      overdueInvoices: 0,
      averageTicket: 257.00,
      paymentMethod: 'transferencia',
      paymentTerms: '60 días',
      taxId: 'B-12345987',
      tags: ['legal', 'inactivo'],
      avatar: 'https://i.pravatar.cc/150?u=7',
      settings: {
        notifications: false,
        autoInvoices: false,
        paymentReminders: false,
        monthlyReports: false,
        twoFactorAuth: false,
        apiAccess: false
      }
    },
    {
      id: 'CLI-008',
      name: 'Patricia Gómez',
      email: 'patricia.gomez@fitness.com',
      phone: '+34 690 123 456',
      company: 'Fitness Center',
      position: 'Propietaria',
      address: 'Calle del Deporte 45',
      city: 'Alicante',
      country: 'España',
      type: 'individual',
      status: 'active',
      plan: 'professional',
      since: '2023-08-22',
      lastLogin: '2024-02-19 12:30',
      lastContact: '2024-02-17',
      totalTransactions: 78,
      totalSpent: 15680.00,
      totalInvoices: 16,
      pendingInvoices: 2,
      overdueInvoices: 0,
      averageTicket: 201.00,
      paymentMethod: 'tarjeta',
      paymentTerms: '15 días',
      tags: ['fitness', 'salud'],
      avatar: 'https://i.pravatar.cc/150?u=8'
    },
    {
      id: 'CLI-009',
      name: 'Javier Ruiz',
      email: 'javier.ruiz@transportes.com',
      phone: '+34 601 234 567',
      company: 'Transportes Ruiz S.L.',
      position: 'Gerente',
      address: 'Polígono Industrial 34',
      city: 'Murcia',
      country: 'España',
      type: 'company',
      status: 'suspended',
      plan: 'basic',
      since: '2022-02-28',
      lastLogin: '2024-01-30 14:20',
      lastContact: '2024-01-30',
      totalTransactions: 45,
      totalSpent: 12340.50,
      totalInvoices: 10,
      pendingInvoices: 4,
      overdueInvoices: 2,
      averageTicket: 274.00,
      creditLimit: 10000,
      currentCredit: 8500,
      paymentMethod: 'transferencia',
      paymentTerms: '30 días',
      taxId: 'B-45678123',
      tags: ['transporte', 'moroso'],
      avatar: 'https://i.pravatar.cc/150?u=9',
      settings: {
        notifications: false,
        autoInvoices: false,
        paymentReminders: false,
        monthlyReports: false,
        twoFactorAuth: false,
        apiAccess: false
      }
    },
    {
      id: 'CLI-010',
      name: 'Sofía Díaz',
      email: 'sofia.diaz@marketing.com',
      phone: '+34 612 345 678',
      company: 'Marketing Digital Pro',
      position: 'Directora de Marketing',
      address: 'Av. de la Publicidad 78',
      city: 'Zaragoza',
      country: 'España',
      type: 'company',
      status: 'active',
      plan: 'professional',
      since: '2023-11-05',
      lastLogin: '2024-02-22 11:10',
      lastContact: '2024-02-16',
      totalTransactions: 23,
      totalSpent: 8760.25,
      totalInvoices: 5,
      pendingInvoices: 1,
      overdueInvoices: 0,
      averageTicket: 380.00,
      paymentMethod: 'transferencia',
      paymentTerms: '30 días',
      taxId: 'B-78912345',
      website: 'www.marketingpro.com',
      tags: ['marketing', 'digital'],
      avatar: 'https://i.pravatar.cc/150?u=10'
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'todos' || client.type === selectedType;
    const matchesStatus = selectedStatus === 'todos' || client.status === selectedStatus;
    const matchesPlan = selectedPlan === 'todos' || client.plan === selectedPlan;
    
    return matchesSearch && matchesType && matchesStatus && matchesPlan;
  });

  // Ordenar clientes
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.since).getTime() - new Date(b.since).getTime()
        : new Date(b.since).getTime() - new Date(a.since).getTime();
    } else if (sortBy === 'spent') {
      return sortOrder === 'asc' ? a.totalSpent - b.totalSpent : b.totalSpent - a.totalSpent;
    } else if (sortBy === 'transactions') {
      return sortOrder === 'asc' ? a.totalTransactions - b.totalTransactions : b.totalTransactions - a.totalTransactions;
    } else {
      const statusOrder = { active: 1, pending: 2, inactive: 3, suspended: 4, blocked: 5 };
      return sortOrder === 'asc'
        ? statusOrder[a.status] - statusOrder[b.status]
        : statusOrder[b.status] - statusOrder[a.status];
    }
  });

  // Paginación
  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
  const paginatedClients = sortedClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleSelectAll = () => {
    if (selectedClients.length === paginatedClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(paginatedClients.map(c => c.id));
    }
  };

  const handleSelectClient = (id: string) => {
    setSelectedClients(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log('Acción masiva:', action, selectedClients);
    setShowBulkActions(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return (
          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <CheckCircle size={12} />
            Activo
          </span>
        );
      case 'inactive':
        return (
          <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <XCircle size={12} />
            Inactivo
          </span>
        );
      case 'pending':
        return (
          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Clock size={12} />
            Pendiente
          </span>
        );
      case 'suspended':
        return (
          <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Ban size={12} />
            Suspendido
          </span>
        );
      case 'blocked':
        return (
          <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Lock size={12} />
            Bloqueado
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'individual':
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">Individual</span>;
      case 'company':
        return <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">Empresa</span>;
      case 'enterprise':
        return <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs">Corporativo</span>;
      default:
        return null;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch(plan) {
      case 'basic':
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs">Básico</span>;
      case 'professional':
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">Profesional</span>;
      case 'enterprise':
        return <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">Empresarial</span>;
      case 'custom':
        return <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs">Personalizado</span>;
      case 'trial':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Prueba</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Clientes</h1>
            <span className="bg-[#F05984]/20 text-[#F05984] text-xs px-2 py-1 rounded-full">
              {clients.length} clientes
            </span>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Gestiona toda la información de tus clientes
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <BarChart3 size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <UsersIcon size={20} />
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'detailed' ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <FileText size={20} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <UserPlus size={20} />
            <span className="hidden sm:inline">Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* Summary Cards - Admin View */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Total Clientes</p>
          <p className="text-2xl font-bold text-white">{summary.totalClients}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-green-400 text-xs">+{summary.growth}%</span>
            <span className="text-white/40 text-xs ml-1">vs mes anterior</span>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Activos</p>
          <p className="text-xl font-bold text-green-400">{summary.activeClients}</p>
          <p className="text-white/40 text-xs mt-1">{summary.newThisMonth} nuevos este mes</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Ingresos Totales</p>
          <p className="text-xl font-bold text-white">{formatCurrency(summary.totalRevenue)}</p>
          <p className="text-white/40 text-xs mt-1">Proyectado: {formatCurrency(summary.projectedRevenue)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <p className="text-white/60 text-sm">Churn Rate</p>
          <p className="text-xl font-bold text-red-400">{summary.churnRate}%</p>
          <p className="text-white/40 text-xs mt-1">{summary.inactiveClients + summary.suspendedClients + summary.blockedClients} inactivos</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-white/40 text-xs">Pendientes</p>
          <p className="text-yellow-400 font-bold">{summary.pendingClients}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-white/40 text-xs">Suspendidos</p>
          <p className="text-orange-400 font-bold">{summary.suspendedClients}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-white/40 text-xs">Bloqueados</p>
          <p className="text-red-400 font-bold">{summary.blockedClients}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-white/40 text-xs">Prueba</p>
          <p className="text-green-400 font-bold">{summary.trialClients}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-white/40 text-xs">Top Clientes</p>
          <p className="text-purple-400 font-bold">{summary.topClients}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-white/40 text-xs">Esta semana</p>
          <p className="text-blue-400 font-bold">{summary.newThisWeek}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, email, empresa o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
              >
                <option value="todos">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="pending">Pendiente</option>
                <option value="suspended">Suspendido</option>
                <option value="blocked">Bloqueado</option>
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
              >
                <option value="todos">Todos los tipos</option>
                <option value="individual">Individual</option>
                <option value="company">Empresa</option>
                <option value="enterprise">Corporativo</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Filter size={20} />
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                title="Importar"
              >
                <Upload size={20} />
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
                title="Exportar"
              >
                <Download size={20} />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Plan</label>
                  <select
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                  >
                    <option value="todos">Todos los planes</option>
                    <option value="trial">Prueba</option>
                    <option value="basic">Básico</option>
                    <option value="professional">Profesional</option>
                    <option value="enterprise">Empresarial</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Fecha desde</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Fecha hasta</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1 block">Gasto mínimo</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedClients.length === paginatedClients.length && paginatedClients.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
              />
              <span className="text-white/60 text-sm">Seleccionar todo</span>
            </label>
            {selectedClients.length > 0 && (
              <>
                <span className="text-white/40 text-sm">
                  {selectedClients.length} seleccionados
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="flex items-center gap-1 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white text-sm transition-colors"
                  >
                    <span>Acciones</span>
                    <ChevronDown size={14} />
                  </button>
                  {showBulkActions && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a0f14] border border-white/10 rounded-lg shadow-lg z-10">
                      <div className="p-1">
                        <button
                          onClick={() => handleBulkAction('activate')}
                          className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                        >
                          Activar seleccionados
                        </button>
                        <button
                          onClick={() => handleBulkAction('suspend')}
                          className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                        >
                          Suspender seleccionados
                        </button>
                        <button
                          onClick={() => handleBulkAction('block')}
                          className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                        >
                          Bloquear seleccionados
                        </button>
                        <div className="border-t border-white/10 my-1"></div>
                        <button
                          onClick={() => handleBulkAction('email')}
                          className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                        >
                          Enviar email
                        </button>
                        <button
                          onClick={() => handleBulkAction('export')}
                          className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                        >
                          Exportar seleccionados
                        </button>
                        <div className="border-t border-white/10 my-1"></div>
                        <button
                          onClick={() => handleBulkAction('delete')}
                          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          Eliminar seleccionados
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-sm">
              {filteredClients.length} resultados
            </span>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm">Ordenar por:</span>
            <button
              onClick={() => {
                setSortBy('name');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'name' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <span>Nombre</span>
              {sortBy === 'name' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setSortBy('date');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'date' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <Calendar size={14} />
              <span>Fecha</span>
              {sortBy === 'date' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setSortBy('spent');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'spent' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <DollarSign size={14} />
              <span>Gasto total</span>
              {sortBy === 'spent' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
            <button
              onClick={() => {
                setSortBy('status');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className={`flex items-center gap-1 text-sm transition-colors ${
                sortBy === 'status' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'
              }`}
            >
              <Activity size={14} />
              <span>Estado</span>
              {sortBy === 'status' && (
                sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedClients.map((client) => (
              <div
                key={client.id}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#F05984]/50 transition-all cursor-pointer relative"
                onClick={() => setSelectedClient(client)}
              >
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectClient(client.id);
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
                  />
                </div>
                <div className="flex items-start justify-between mb-3 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F05984] to-[#BC455F] flex items-center justify-center text-white font-bold text-lg">
                      {client.avatar ? (
                        <img src={client.avatar} alt={client.name} className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        client.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{client.name}</h3>
                      <p className="text-white/40 text-xs">{client.company}</p>
                    </div>
                  </div>
                  {getStatusBadge(client.status)}
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MailIcon size={14} className="text-white/40" />
                    <span className="text-white/60 truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <PhoneIcon size={14} className="text-white/40" />
                    <span className="text-white/60">{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPinIcon size={14} className="text-white/40" />
                    <span className="text-white/60 truncate">{client.city}, {client.country}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {getTypeBadge(client.type)}
                  {getPlanBadge(client.plan)}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                  <div>
                    <p className="text-white/40 text-xs">Transacciones</p>
                    <p className="text-white font-medium">{client.totalTransactions}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs">Total gastado</p>
                    <p className="text-white font-medium">{formatCurrency(client.totalSpent)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1 text-white/40 text-xs">
                    <CalendarIcon size={12} />
                    <span>Cliente desde {formatDate(client.since)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Eye size={14} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Edit size={14} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <MoreVertical size={14} className="text-white/60" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="p-4 space-y-2">
            {paginatedClients.map((client) => (
              <div
                key={client.id}
                className="bg-white/5 rounded-lg p-3 border border-white/10 hover:border-[#F05984]/50 transition-all cursor-pointer"
                onClick={() => setSelectedClient(client)}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectClient(client.id);
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
                  />
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#F05984] to-[#BC455F] flex items-center justify-center text-white font-bold">
                    {client.avatar ? (
                      <img src={client.avatar} alt={client.name} className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      client.name.charAt(0)
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium">{client.name}</h3>
                      {getStatusBadge(client.status)}
                      {getTypeBadge(client.type)}
                      {getPlanBadge(client.plan)}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-xs">
                        <MailIcon size={12} className="text-white/40" />
                        <span className="text-white/60">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <PhoneIcon size={12} className="text-white/40" />
                        <span className="text-white/60">{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Building2Icon size={12} className="text-white/40" />
                        <span className="text-white/60">{client.company}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-white/40 text-xs">Transacciones</p>
                      <p className="text-white text-sm">{client.totalTransactions}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-xs">Total</p>
                      <p className="text-white text-sm font-medium">{formatCurrency(client.totalSpent)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-xs">Último login</p>
                      <p className="text-white text-sm">{client.lastLogin.split(' ')[0]}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Eye size={16} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Edit size={16} className="text-white/60" />
                    </button>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <MoreVertical size={16} className="text-white/60" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed View */}
        {viewMode === 'detailed' && (
          <div className="p-4 space-y-4">
            {paginatedClients.map((client) => (
              <div
                key={client.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-[#F05984]/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectClient(client.id);
                    }}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5"
                  />
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#F05984] to-[#BC455F] flex items-center justify-center text-white font-bold text-lg">
                    {client.avatar ? (
                      <img src={client.avatar} alt={client.name} className="w-full h-full rounded-lg object-cover" />
                    ) : (
                      client.name.charAt(0)
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-semibold">{client.name}</h3>
                      {getStatusBadge(client.status)}
                      {getTypeBadge(client.type)}
                      {getPlanBadge(client.plan)}
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-white/40 text-xs">Email</p>
                        <p className="text-white text-sm">{client.email}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Teléfono</p>
                        <p className="text-white text-sm">{client.phone}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Empresa</p>
                        <p className="text-white text-sm">{client.company}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Cargo</p>
                        <p className="text-white text-sm">{client.position}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4 pt-3 border-t border-white/10">
                      <div>
                        <p className="text-white/40 text-xs">Cliente desde</p>
                        <p className="text-white text-sm">{formatDate(client.since)}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Último login</p>
                        <p className="text-white text-sm">{client.lastLogin}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Transacciones</p>
                        <p className="text-white text-sm">{client.totalTransactions}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Total gastado</p>
                        <p className="text-white text-sm font-medium">{formatCurrency(client.totalSpent)}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Facturas pendientes</p>
                        <p className="text-yellow-400 text-sm">{client.pendingInvoices}</p>
                      </div>
                    </div>

                    {client.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {client.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Eye size={18} className="text-white/60" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Edit size={18} className="text-white/60" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Mail size={18} className="text-white/60" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredClients.length)} de {filteredClients.length} clientes
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#F05984] text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de detalles del cliente */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0f14] rounded-xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#F05984] to-[#BC455F] flex items-center justify-center text-white font-bold text-2xl">
                    {selectedClient.avatar ? (
                      <img src={selectedClient.avatar} alt={selectedClient.name} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      selectedClient.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedClient.name}</h2>
                    <p className="text-white/40 text-sm">{selectedClient.id} • {selectedClient.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedClient.status)}
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-white/60" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10 mb-4">
                <button className="px-4 py-2 text-[#F05984] border-b-2 border-[#F05984] font-medium">Información</button>
                <button className="px-4 py-2 text-white/60 hover:text-white">Actividad</button>
                <button className="px-4 py-2 text-white/60 hover:text-white">Proyectos</button>
                <button className="px-4 py-2 text-white/60 hover:text-white">Documentos</button>
                <button className="px-4 py-2 text-white/60 hover:text-white">Configuración</button>
              </div>

              {/* Información principal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">Información de Contacto</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MailIcon size={16} className="text-white/40" />
                        <span className="text-white">{selectedClient.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon size={16} className="text-white/40" />
                        <span className="text-white">{selectedClient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon size={16} className="text-white/40" />
                        <span className="text-white">{selectedClient.address}, {selectedClient.city}, {selectedClient.country}</span>
                      </div>
                      {selectedClient.website && (
                        <div className="flex items-center gap-2">
                          <Globe size={16} className="text-white/40" />
                          <span className="text-white">{selectedClient.website}</span>
                        </div>
                      )}
                      {selectedClient.taxId && (
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-white/40" />
                          <span className="text-white">NIF/CIF: {selectedClient.taxId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">Información Comercial</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/40 text-xs">Plan</p>
                        <div className="mt-1">{getPlanBadge(selectedClient.plan)}</div>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Tipo</p>
                        <div className="mt-1">{getTypeBadge(selectedClient.type)}</div>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Método de pago</p>
                        <p className="text-white text-sm capitalize">{selectedClient.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Términos de pago</p>
                        <p className="text-white text-sm">{selectedClient.paymentTerms}</p>
                      </div>
                    </div>
                  </div>

                  {selectedClient.notes && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Notas</h3>
                      <p className="text-white/60">{selectedClient.notes}</p>
                    </div>
                  )}
                </div>

                {/* Sidebar con estadísticas */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">Estadísticas</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-white/40 text-xs">Total gastado</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(selectedClient.totalSpent)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-white/40 text-xs">Transacciones</p>
                          <p className="text-white text-lg font-bold">{selectedClient.totalTransactions}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs">Facturas</p>
                          <p className="text-white text-lg font-bold">{selectedClient.totalInvoices}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-white/40 text-xs">Pendientes</p>
                          <p className="text-yellow-400 text-sm font-bold">{selectedClient.pendingInvoices}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs">Vencidas</p>
                          <p className="text-red-400 text-sm font-bold">{selectedClient.overdueInvoices || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">Información Adicional</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-white/40 text-xs">Cliente desde</p>
                        <p className="text-white text-sm">{formatDate(selectedClient.since)}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Último login</p>
                        <p className="text-white text-sm">{selectedClient.lastLogin}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Último contacto</p>
                        <p className="text-white text-sm">{formatDate(selectedClient.lastContact)}</p>
                      </div>
                    </div>
                  </div>

                  {selectedClient.tags && selectedClient.tags.length > 0 && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Etiquetas</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedClient.tags.map((tag, index) => (
                          <span key={index} className="bg-white/10 text-white/60 px-2 py-1 rounded-lg text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/10">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors">
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">
                  Editar Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
