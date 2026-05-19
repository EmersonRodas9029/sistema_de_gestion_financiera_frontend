import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users,
  UserPlus,
  Search,
  Filter,
  RefreshCw,
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
  Activity,
  FileText,
  Settings,
  User,
  UserCheck,
  UserX,
  Users as UsersIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  Building2 as Building2Icon,
  X,
  Save,
  Plus,
  Upload,
  Lock,
  Unlock,
  Ban,
  Send,
  Printer,
  Share2,
  Link,
  Copy,
  Flag,
  Tag,
  FolderTree,
  Archive,
  Bell,
  Shield,
  Globe,
  XCircle as XCircleIcon,
  ChevronRight as ChevronRightIcon,
  PieChart as PieChartIcon,
  Target
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';

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
  createdAt: string;
  updatedAt: string;
}

// Colores para el gráfico de pastel
const CHART_COLORS = ['#F05984', '#BC455F', '#6E4068', '#321D28', '#2DD4BF', '#F59E0B', '#10B981', '#6366F1'];

// Función para generar ID único
const generateUniqueId = () => {
  return `CLI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Datos iniciales por defecto
const getDefaultClients = (): Client[] => [
  {
    id: generateUniqueId(),
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
    createdAt: '2023-01-15',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    createdAt: '2023-03-20',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    createdAt: '2022-11-05',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    createdAt: '2023-06-12',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    createdAt: '2024-02-01',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    createdAt: '2023-09-18',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    createdAt: '2022-05-10',
    updatedAt: '2024-01-15'
  },
  {
    id: generateUniqueId(),
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
    createdAt: '2023-08-22',
    updatedAt: '2024-02-23'
  },
  {
    id: generateUniqueId(),
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
    createdAt: '2022-02-28',
    updatedAt: '2024-01-30'
  },
  {
    id: generateUniqueId(),
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
    createdAt: '2023-11-05',
    updatedAt: '2024-02-23'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPlan, setSelectedPlan] = useState<string>('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'spent' | 'transactions' | 'status'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    address: '',
    city: '',
    country: '',
    type: 'individual',
    plan: 'basic',
    paymentMethod: 'transferencia',
    paymentTerms: '30 días',
    taxId: '',
    website: '',
    notes: '',
    status: 'active'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    address: '',
    city: '',
    country: 'España',
    type: 'individual',
    plan: 'basic',
    paymentMethod: 'transferencia',
    paymentTerms: '30 días',
    taxId: '',
    website: '',
    notes: '',
    status: 'active'
  });

  const itemsPerPage = 6;

  // Cargar datos desde localStorage o usar datos por defecto
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('clients');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return getDefaultClients();
    } catch (error) {
      console.error('Error loading clients:', error);
      return getDefaultClients();
    }
  });

  // Simular carga inicial
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Guardar en localStorage cuando cambien los clientes
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  // Calcular estadísticas en tiempo real
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const inactiveClients = clients.filter(c => c.status === 'inactive').length;
  const pendingClients = clients.filter(c => c.status === 'pending').length;
  const suspendedClients = clients.filter(c => c.status === 'suspended').length;
  const blockedClients = clients.filter(c => c.status === 'blocked').length;
  const trialClients = clients.filter(c => c.plan === 'trial').length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageSpent = totalClients > 0 ? totalRevenue / totalClients : 0;
  const newThisMonth = clients.filter(c => new Date(c.since).getMonth() === new Date().getMonth()).length;
  
  // Datos para el gráfico de pastel - Distribución por estado
  const statusData = [
    { name: 'Activos', value: activeClients, color: '#10B981' },
    { name: 'Pendientes', value: pendingClients, color: '#F59E0B' },
    { name: 'Inactivos', value: inactiveClients, color: '#6B7280' },
    { name: 'Suspendidos', value: suspendedClients, color: '#F97316' },
    { name: 'Bloqueados', value: blockedClients, color: '#EF4444' }
  ].filter(s => s.value > 0);

  // Top 5 clientes por gasto
  const topClients = [...clients]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

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

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
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

  const handleCreateClient = () => {
    const newClient: Client = {
      id: generateUniqueId(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      position: formData.position,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      type: formData.type as Client['type'],
      status: formData.status as Client['status'],
      plan: formData.plan as Client['plan'],
      since: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toLocaleString(),
      lastContact: new Date().toISOString().split('T')[0],
      totalTransactions: 0,
      totalSpent: 0,
      totalInvoices: 0,
      pendingInvoices: 0,
      overdueInvoices: 0,
      averageTicket: 0,
      paymentMethod: formData.paymentMethod,
      paymentTerms: formData.paymentTerms,
      taxId: formData.taxId || undefined,
      website: formData.website || undefined,
      notes: formData.notes || undefined,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setClients(prev => [newClient, ...prev]);
    setShowCreateModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      address: '',
      city: '',
      country: 'España',
      type: 'individual',
      plan: 'basic',
      paymentMethod: 'transferencia',
      paymentTerms: '30 días',
      taxId: '',
      website: '',
      notes: '',
      status: 'active'
    });
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setEditFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      position: client.position,
      address: client.address,
      city: client.city,
      country: client.country,
      type: client.type,
      plan: client.plan,
      paymentMethod: client.paymentMethod,
      paymentTerms: client.paymentTerms,
      taxId: client.taxId || '',
      website: client.website || '',
      notes: client.notes || '',
      status: client.status
    });
    setShowEditModal(true);
  };

  const handleUpdateClient = () => {
    if (selectedClient) {
      const updatedClients = clients.map(c => 
        c.id === selectedClient.id ? {
          ...c,
          name: editFormData.name,
          email: editFormData.email,
          phone: editFormData.phone,
          company: editFormData.company,
          position: editFormData.position,
          address: editFormData.address,
          city: editFormData.city,
          country: editFormData.country,
          type: editFormData.type as Client['type'],
          plan: editFormData.plan as Client['plan'],
          paymentMethod: editFormData.paymentMethod,
          paymentTerms: editFormData.paymentTerms,
          taxId: editFormData.taxId || undefined,
          website: editFormData.website || undefined,
          notes: editFormData.notes || undefined,
          status: editFormData.status as Client['status'],
          updatedAt: new Date().toISOString()
        } : c
      );
      setClients(updatedClients);
      setShowEditModal(false);
      setSelectedClient(null);
    }
  };

  const handleEditStatus = (client: Client) => {
    setSelectedClient(client);
    setNewStatus(client.status);
    setShowEditStatusModal(true);
  };

  const handleUpdateStatus = () => {
    if (selectedClient && newStatus && newStatus !== selectedClient.status) {
      setClients(prev => 
        prev.map(c => 
          c.id === selectedClient.id ? { ...c, status: newStatus as Client['status'], updatedAt: new Date().toISOString() } : c
        )
      );
    }
    setShowEditStatusModal(false);
    setSelectedClient(null);
    setNewStatus('');
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  const resetData = () => {
    if (window.confirm('¿Esto restaurará los datos a los valores por defecto. ¿Continuar?')) {
      localStorage.removeItem('clients');
      setClients(getDefaultClients());
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('todos');
    setSelectedStatus('todos');
    setSelectedPlan('todos');
    setCurrentPage(1);
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
      case 'active': return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle size={12} /> Activo</span>;
      case 'inactive': return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><XCircle size={12} /> Inactivo</span>;
      case 'pending': return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Clock size={12} /> Pendiente</span>;
      case 'suspended': return <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Ban size={12} /> Suspendido</span>;
      case 'blocked': return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Lock size={12} /> Bloqueado</span>;
      default: return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'individual': return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">Individual</span>;
      case 'company': return <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">Empresa</span>;
      case 'enterprise': return <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs">Corporativo</span>;
      default: return null;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch(plan) {
      case 'basic': return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs">Básico</span>;
      case 'professional': return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">Profesional</span>;
      case 'enterprise': return <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">Empresarial</span>;
      case 'custom': return <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs">Personalizado</span>;
      case 'trial': return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Prueba</span>;
      default: return null;
    }
  };

  const hasActiveFilters = searchTerm !== '' || selectedType !== 'todos' || selectedStatus !== 'todos' || selectedPlan !== 'todos';

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-white/10 rounded-xl" />
            <div className="h-80 bg-white/10 rounded-xl" />
          </div>
          <div className="h-96 bg-white/10 rounded-xl" />
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
              <Users size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Clientes</h1>
              <p className="text-white/50 text-sm mt-1">Gestiona toda la información de tus clientes</p>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 text-white/80 hover:text-white backdrop-blur-sm"
            >
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all duration-300 ${
                viewMode === 'grid' ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white backdrop-blur-sm'
              }`}
            >
              <BarChart3 size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all duration-300 ${
                viewMode === 'list' ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white backdrop-blur-sm'
              }`}
            >
              <Users size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300"
            >
              <UserPlus size={20} />
              <span className="hidden sm:inline font-medium">Nuevo Cliente</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetData}
              className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-xl transition-all duration-300 text-yellow-400 hover:text-yellow-300 backdrop-blur-sm"
              title="Restaurar datos por defecto"
            >
              <RefreshCw size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards Mejoradas */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Total Clientes</p>
              <p className="text-2xl font-bold text-white mt-1 tracking-tight">{totalClients}</p>
              <p className="text-white/30 text-xs mt-1">+{newThisMonth} este mes</p>
            </div>
            <div className="p-3 rounded-xl bg-white/10">
              <Users size={24} className="text-[#F05984]" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-xl p-5 border border-white/10 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50 text-sm font-medium">Activos</p>
              <p className="text-2xl font-bold text-green-400 mt-1 tracking-tight">{activeClients}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-400 text-xs">{pendingClients} pendientes</span>
                <span className="text-gray-400 text-xs">{inactiveClients} inactivos</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <UserCheck size={24} className="text-green-400" />
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
              <p className="text-white/50 text-sm font-medium">Ingresos Totales</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1 tracking-tight">{formatCurrency(totalRevenue)}</p>
              <p className="text-white/30 text-xs mt-1">Ticket promedio: {formatCurrency(averageSpent)}</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/20">
              <DollarSign size={24} className="text-yellow-400" />
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
              <p className="text-white/50 text-sm font-medium">En Prueba</p>
              <p className="text-2xl font-bold text-blue-400 mt-1 tracking-tight">{trialClients}</p>
              <p className="text-white/30 text-xs mt-1">clientes en plan trial</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Target size={24} className="text-blue-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Gráficos de Distribución y Top Clientes */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Dona - Distribución por Estado */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={20} className="text-[#F05984]" />
            <h3 className="text-white font-semibold">Distribución por Estado</h3>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <ReTooltip
                  contentStyle={{ backgroundColor: '#1a0f14', border: '1px solid #F05984', borderRadius: '8px' }}
                  formatter={(value: number) => [value, 'clientes']}
                  labelStyle={{ color: 'white' }}
                />
                <Legend 
                  formatter={(value) => <span className="text-white/70 text-xs">{value}</span>}
                  wrapperStyle={{ paddingTop: '20px' }}
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Clientes por Gasto */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#F05984]" />
            Top 5 Clientes por Gasto
          </h3>
          <div className="space-y-4">
            {topClients.map((client, index) => {
              const maxSpent = topClients[0]?.totalSpent || 1;
              const percentage = (client.totalSpent / maxSpent) * 100;
              return (
                <motion.div 
                  key={client.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F05984] to-[#BC455F] flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <span className="text-white text-sm font-medium">{client.name}</span>
                        <p className="text-white/40 text-xs">{client.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/50 text-xs">{client.totalTransactions} transacciones</span>
                      <span className="text-white text-sm font-semibold">{formatCurrency(client.totalSpent)}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-full"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Filters and Search con panel colapsable */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <Filter size={20} />
              </motion.button>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-400 hover:text-red-300 text-sm"
                >
                  <XCircleIcon size={16} />
                  <span>Limpiar filtros</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Panel de filtros colapsable */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Tipo de Cliente</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos</option>
                      <option value="individual" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Individual</option>
                      <option value="company" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Empresa</option>
                      <option value="enterprise" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Corporativo</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Estado</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos</option>
                      <option value="active" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Activo</option>
                      <option value="pending" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Pendiente</option>
                      <option value="inactive" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Inactivo</option>
                      <option value="suspended" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Suspendido</option>
                      <option value="blocked" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Bloqueado</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Plan</label>
                    <select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
                    >
                      <option value="todos" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Todos</option>
                      <option value="trial" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Prueba</option>
                      <option value="basic" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Básico</option>
                      <option value="professional" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Profesional</option>
                      <option value="enterprise" style={{ backgroundColor: '#1a0f14', color: 'white' }}>Empresarial</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Bar */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm">Ordenar por:</span>
            <button
              onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'name' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <span>Nombre</span>
              {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
            <button
              onClick={() => { setSortBy('date'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'date' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <Calendar size={14} />
              <span>Fecha</span>
              {sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
            <button
              onClick={() => { setSortBy('spent'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'spent' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <DollarSign size={14} />
              <span>Gasto total</span>
              {sortBy === 'spent' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
            <button
              onClick={() => { setSortBy('status'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
              className={`flex items-center gap-1 text-sm transition-colors ${sortBy === 'status' ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}
            >
              <Activity size={14} />
              <span>Estado</span>
              {sortBy === 'status' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </button>
          </div>
          <span className="text-white/40 text-sm">{filteredClients.length} resultados</span>
        </div>

        {/* Estado Vacío */}
        {filteredClients.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 px-4"
          >
            <div className="p-4 bg-white/10 rounded-full mb-4">
              <Users size={48} className="text-white/30" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No hay clientes</h3>
            <p className="text-white/40 text-sm text-center max-w-md">
              No se encontraron clientes con los filtros actuales.
              Prueba a ajustar los filtros o crea un nuevo cliente.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <UserPlus size={18} />
              <span>Crear nuevo cliente</span>
            </motion.button>
          </motion.div>
        )}

        {/* Bulk Actions Bar */}
        {filteredClients.length > 0 && (
          <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selectedClients.length === paginatedClients.length && paginatedClients.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                <span className="text-white/60 text-sm">Seleccionar todo</span>
              </label>
              {selectedClients.length > 0 && (
                <span className="text-white/40 text-sm">{selectedClients.length} seleccionados</span>
              )}
            </div>
          </div>
        )}

        {/* Grid View Mejorado */}
        {filteredClients.length > 0 && viewMode === 'grid' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {paginatedClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="relative overflow-hidden bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border border-white/10 transition-all duration-300 cursor-pointer hover:shadow-xl hover:border-[#F05984]/50"
                >
                  <div className="absolute top-2 left-2">
                    <input type="checkbox" checked={selectedClients.includes(client.id)} onChange={(e) => { e.stopPropagation(); handleSelectClient(client.id); }} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                  </div>
                  <div className="flex items-start justify-between mb-3 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F05984] to-[#BC455F] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{client.name}</h3>
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
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditClient(client)}
                        className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400"
                        title="Editar cliente"
                      >
                        <Edit size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditStatus(client)}
                        className="p-1.5 hover:bg-purple-500/20 rounded-lg transition-all duration-300 text-purple-400"
                        title="Cambiar estado"
                      >
                        <Activity size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400"
                        title="Eliminar cliente"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* List View Mejorado */}
        {filteredClients.length > 0 && viewMode === 'list' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 space-y-2"
          >
            <AnimatePresence>
              {paginatedClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-r from-white/5 to-white/0 rounded-lg p-3 border border-white/10 transition-all duration-300 cursor-pointer hover:shadow-lg hover:border-[#F05984]/30"
                >
                  <div className="flex items-center gap-4">
                    <input type="checkbox" checked={selectedClients.includes(client.id)} onChange={(e) => { e.stopPropagation(); handleSelectClient(client.id); }} className="w-4 h-4 rounded border-gray-300 text-[#F05984] focus:ring-[#F05984] bg-white/5" />
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#F05984] to-[#BC455F] flex items-center justify-center text-white font-bold shadow-lg">
                      {client.name.charAt(0)}
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
                        <p className="text-white/40 text-xs">Desde</p>
                        <p className="text-white text-sm">{formatDate(client.since)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditClient(client)}
                        className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-all duration-300 text-blue-400"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditStatus(client)}
                        className="p-1.5 hover:bg-purple-500/20 rounded-lg transition-all duration-300 text-purple-400"
                      >
                        <Activity size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-red-400"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {filteredClients.length > 0 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-white/40 text-sm">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredClients.length)} de {filteredClients.length} clientes
            </p>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </motion.button>
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
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                      currentPage === pageNum
                        ? 'bg-[#F05984] text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal para crear nuevo cliente - Mejorado con animación */}
      <AnimatePresence>
        {showCreateModal && (
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
              className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-lg shadow-lg">
                    <UserPlus size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Nuevo Cliente</h2>
                    <p className="text-white/40 text-sm">Registra un nuevo cliente en el sistema</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </motion.button>
              </div>
              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); handleCreateClient(); }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Nombre completo *</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Ej: Juan Pérez" required />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Email *</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="ejemplo@correo.com" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Teléfono</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="+34 612 345 678" />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Empresa</label>
                      <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Nombre de la empresa" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Cargo</label>
                      <input type="text" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="CEO, Director, etc." />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Tipo de cliente</label>
                      <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <option value="individual">Individual</option>
                        <option value="company">Empresa</option>
                        <option value="enterprise">Corporativo</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Dirección</label>
                      <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Calle, número" />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Ciudad</label>
                      <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Ciudad" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">País</label>
                      <input type="text" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="País" />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Plan</label>
                      <select value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <option value="trial">Prueba</option>
                        <option value="basic">Básico</option>
                        <option value="professional">Profesional</option>
                        <option value="enterprise">Empresarial</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Notas adicionales</label>
                    <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={3} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" placeholder="Notas adicionales sobre el cliente..." />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
                    >
                      <Save size={18} />
                      <span>Guardar Cliente</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para editar cliente - Mejorado con animación */}
      <AnimatePresence>
        {showEditModal && selectedClient && (
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
              className="bg-[#1a0f14] rounded-xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-[#1a0f14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Edit size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Editar Cliente</h2>
                    <p className="text-white/40 text-sm">Modifica los datos del cliente</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </motion.button>
              </div>
              <div className="p-6">
                <form onSubmit={(e) => { e.preventDefault(); handleUpdateClient(); }} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Nombre completo *</label>
                      <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Email *</label>
                      <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Teléfono</label>
                      <input type="tel" value={editFormData.phone} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Empresa</label>
                      <input type="text" value={editFormData.company} onChange={(e) => setEditFormData({...editFormData, company: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Cargo</label>
                      <input type="text" value={editFormData.position} onChange={(e) => setEditFormData({...editFormData, position: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Tipo de cliente</label>
                      <select value={editFormData.type} onChange={(e) => setEditFormData({...editFormData, type: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <option value="individual">Individual</option>
                        <option value="company">Empresa</option>
                        <option value="enterprise">Corporativo</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Dirección</label>
                      <input type="text" value={editFormData.address} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Ciudad</label>
                      <input type="text" value={editFormData.city} onChange={(e) => setEditFormData({...editFormData, city: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">País</label>
                      <input type="text" value={editFormData.country} onChange={(e) => setEditFormData({...editFormData, country: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                    </div>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">Plan</label>
                      <select value={editFormData.plan} onChange={(e) => setEditFormData({...editFormData, plan: e.target.value})} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                        <option value="trial">Prueba</option>
                        <option value="basic">Básico</option>
                        <option value="professional">Profesional</option>
                        <option value="enterprise">Empresarial</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Notas adicionales</label>
                    <textarea value={editFormData.notes} onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})} rows={3} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
                    >
                      <Save size={18} />
                      <span>Guardar Cambios</span>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para editar estado - Mejorado con animación */}
      <AnimatePresence>
        {showEditStatusModal && selectedClient && (
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
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Activity size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Cambiar Estado</h2>
                    <p className="text-white/40 text-sm">Actualiza el estado del cliente</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditStatusModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white/60" />
                </motion.button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Cliente</label>
                    <p className="text-white font-medium">{selectedClient.name}</p>
                    <p className="text-white/40 text-sm">{selectedClient.email}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1.5 block">Nuevo Estado</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white' }}>
                      <option value="active">Activo</option>
                      <option value="pending">Pendiente</option>
                      <option value="inactive">Inactivo</option>
                      <option value="suspended">Suspendido</option>
                      <option value="blocked">Bloqueado</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowEditStatusModal(false)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleUpdateStatus}
                      className="px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
                    >
                      Actualizar Estado
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos CSS para el scrollbar personalizado */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #F05984 #1a0f14;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a0f14;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #F05984, #BC455F);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #BC455F, #6E4068);
        }
      `}</style>
    </motion.div>
  );
};