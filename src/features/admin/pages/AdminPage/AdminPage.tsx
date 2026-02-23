import { useState } from 'react';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  PieChart,
  Calendar,
  Download,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  DollarSign,
  CreditCard,
  Wallet,
  BarChart3
} from 'lucide-react';

interface Client {
  id: number;
  name: string;
  email: string;
  plan: 'Básico' | 'Profesional' | 'Empresarial';
  status: 'Activo' | 'Inactivo' | 'Pendiente';
  totalTransactions: number;
  balance: number;
  lastActive: string;
  avatar?: string;
}

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Datos de ejemplo (después vendrán de la API)
  const stats: StatCard[] = [
    {
      title: 'Total Clientes',
      value: '1,234',
      change: 12.5,
      icon: <Users size={24} />,
      color: 'bg-blue-500'
    },
    {
      title: 'Ingresos Totales',
      value: '$45,678',
      change: 8.3,
      icon: <DollarSign size={24} />,
      color: 'bg-green-500'
    },
    {
      title: 'Transacciones',
      value: '3,456',
      change: -2.4,
      icon: <CreditCard size={24} />,
      color: 'bg-purple-500'
    },
    {
      title: 'Balance Promedio',
      value: '$2,345',
      change: 5.7,
      icon: <Wallet size={24} />,
      color: 'bg-orange-500'
    }
  ];

  const clients: Client[] = [
    {
      id: 1,
      name: 'María González',
      email: 'maria.g@email.com',
      plan: 'Profesional',
      status: 'Activo',
      totalTransactions: 145,
      balance: 12500.50,
      lastActive: '2024-02-23'
    },
    {
      id: 2,
      name: 'Juan Pérez',
      email: 'juan.p@email.com',
      plan: 'Básico',
      status: 'Activo',
      totalTransactions: 67,
      balance: 3450.00,
      lastActive: '2024-02-22'
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      email: 'carlos.r@email.com',
      plan: 'Empresarial',
      status: 'Inactivo',
      totalTransactions: 234,
      balance: 56700.75,
      lastActive: '2024-02-15'
    },
    {
      id: 4,
      name: 'Ana Martínez',
      email: 'ana.m@email.com',
      plan: 'Profesional',
      status: 'Activo',
      totalTransactions: 189,
      balance: 23400.25,
      lastActive: '2024-02-23'
    },
    {
      id: 5,
      name: 'Roberto Sánchez',
      email: 'roberto.s@email.com',
      plan: 'Básico',
      status: 'Pendiente',
      totalTransactions: 12,
      balance: 890.00,
      lastActive: '2024-02-20'
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === 'todos' || client.plan === selectedPlan;
    const matchesStatus = selectedStatus === 'todos' || client.status === selectedStatus;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simular carga de datos
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Activo': return 'bg-green-500/20 text-green-400';
      case 'Inactivo': return 'bg-red-500/20 text-red-400';
      case 'Pendiente': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPlanBadge = (plan: string) => {
    switch(plan) {
      case 'Básico': return 'bg-blue-500/20 text-blue-400';
      case 'Profesional': return 'bg-purple-500/20 text-purple-400';
      case 'Empresarial': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="text-white/60">Gestiona clientes, transacciones y reportes</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
          >
            <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-opacity">
            <UserPlus size={20} />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#F05984]/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/60 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.change > 0 ? (
                    <ArrowUp size={16} className="text-green-400" />
                  ) : (
                    <ArrowDown size={16} className="text-red-400" />
                  )}
                  <span className={`text-sm ${stat.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-white/40 text-xs ml-1">vs mes anterior</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-20`}>
                <div className="text-white">{stat.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Ingresos vs Gastos</h3>
            <select className="bg-white/10 text-white rounded-lg px-3 py-1 text-sm border border-white/10">
              <option>Última semana</option>
              <option>Último mes</option>
              <option>Último año</option>
            </select>
          </div>
          <div className="h-48 flex items-center justify-center text-white/40">
            <BarChart3 size={48} />
            <span className="ml-2">Gráfico de ingresos aquí</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Distribución de Clientes</h3>
            <select className="bg-white/10 text-white rounded-lg px-3 py-1 text-sm border border-white/10">
              <option>Por plan</option>
              <option>Por estado</option>
              <option>Por actividad</option>
            </select>
          </div>
          <div className="h-48 flex items-center justify-center text-white/40">
            <PieChart size={48} />
            <span className="ml-2">Gráfico de distribución aquí</span>
          </div>
        </div>
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        {/* Filtros */}
        <div className="p-4 border-b border-white/10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Buscar cliente por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
              >
                <option value="todos">Todos los planes</option>
                <option value="Básico">Básico</option>
                <option value="Profesional">Profesional</option>
                <option value="Empresarial">Empresarial</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984]"
              >
                <option value="todos">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Pendiente">Pendiente</option>
              </select>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
                <Filter size={20} />
              </button>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Cliente</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Plan</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Estado</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Transacciones</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Balance</th>
                <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Última Actividad</th>
                <th className="text-right py-3 px-4 text-white/60 text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#F05984] to-[#BC455F] flex items-center justify-center text-white font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{client.name}</p>
                        <p className="text-white/40 text-xs">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadge(client.plan)}`}>
                      {client.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white">{client.totalTransactions}</td>
                  <td className="py-3 px-4 text-white font-medium">${client.balance.toLocaleString()}</td>
                  <td className="py-3 px-4 text-white/60">{client.lastActive}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/40 text-sm">
            Mostrando {filteredClients.length} de {clients.length} clientes
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
              Anterior
            </button>
            <button className="px-3 py-1 bg-[#F05984] text-white rounded">1</button>
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
              2
            </button>
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
              3
            </button>
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
