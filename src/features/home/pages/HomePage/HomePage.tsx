import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from '../../components/SortableItem';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target,
  Bell,
  Sparkles,
  FolderTree,
  BarChart3,
  ArrowRight,
  Users,
  UserCircle,
  FileText,
  Settings,
  Repeat,
  PiggyBank,
  GripVertical
} from 'lucide-react';

interface QuickOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
  stats?: string;
  gradient: string;
  borderColor: string;
}

export const HomePage = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [userName] = useState(localStorage.getItem('userName') || 'Emerson');
  const [userRole] = useState<'admin' | 'client'>(localStorage.getItem('userRole') as 'admin' | 'client' || 'client');
  const [currentTime, setCurrentTime] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Estado para el orden de los módulos (se guarda en localStorage)
  const [modulesOrder, setModulesOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('modulesOrder');
    if (saved) {
      return JSON.parse(saved);
    }
    // Orden por defecto
    return [
      'incomes', 'expenses', 'recurring-expenses', 'budgets',
      'goals', 'savings', 'categories', 'analytics',
      ...(userRole === 'admin' ? ['reports', 'clients'] : []),
      'settings'
    ];
  });

  // Configurar sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Todas las opciones disponibles en el sistema
  const allOptions: Record<string, QuickOption> = {
    incomes: {
      id: 'incomes',
      title: 'Ingresos',
      description: 'Registra y controla tus ingresos',
      icon: <TrendingUp size={28} />,
      color: 'from-green-500/20 to-green-600/20',
      route: '/incomes',
      stats: 'Total: $3,250',
      gradient: 'from-green-500/10 via-green-600/5 to-transparent',
      borderColor: 'border-green-500/30'
    },
    expenses: {
      id: 'expenses',
      title: 'Gastos',
      description: 'Controla tus gastos diarios',
      icon: <TrendingDown size={28} />,
      color: 'from-red-500/20 to-red-600/20',
      route: '/expenses',
      stats: 'Total: $1,245',
      gradient: 'from-red-500/10 via-red-600/5 to-transparent',
      borderColor: 'border-red-500/30'
    },
    'recurring-expenses': {
      id: 'recurring-expenses',
      title: 'Gastos Recurrentes',
      description: 'Suscripciones y pagos periódicos',
      icon: <Repeat size={28} />,
      color: 'from-orange-500/20 to-orange-600/20',
      route: '/recurring-expenses',
      stats: '12 activos',
      gradient: 'from-orange-500/10 via-orange-600/5 to-transparent',
      borderColor: 'border-orange-500/30'
    },
    budgets: {
      id: 'budgets',
      title: 'Presupuestos',
      description: 'Controla tus límites de gasto',
      icon: <Wallet size={28} />,
      color: 'from-blue-500/20 to-blue-600/20',
      route: '/budgets',
      stats: '80% utilizado',
      gradient: 'from-blue-500/10 via-blue-600/5 to-transparent',
      borderColor: 'border-blue-500/30'
    },
    goals: {
      id: 'goals',
      title: 'Metas Financieras',
      description: 'Define tus objetivos financieros',
      icon: <Target size={28} />,
      color: 'from-purple-500/20 to-purple-600/20',
      route: '/goals',
      stats: '3 activas',
      gradient: 'from-purple-500/10 via-purple-600/5 to-transparent',
      borderColor: 'border-purple-500/30'
    },
    savings: {
      id: 'savings',
      title: 'Metas de Ahorro',
      description: 'Ahorra para el futuro',
      icon: <PiggyBank size={28} />,
      color: 'from-pink-500/20 to-pink-600/20',
      route: '/savings',
      stats: '$7,850 ahorrados',
      gradient: 'from-pink-500/10 via-pink-600/5 to-transparent',
      borderColor: 'border-pink-500/30'
    },
    categories: {
      id: 'categories',
      title: 'Categorías',
      description: 'Organiza tus transacciones',
      icon: <FolderTree size={28} />,
      color: 'from-cyan-500/20 to-cyan-600/20',
      route: '/categories',
      stats: '12 categorías',
      gradient: 'from-cyan-500/10 via-cyan-600/5 to-transparent',
      borderColor: 'border-cyan-500/30'
    },
    analytics: {
      id: 'analytics',
      title: 'Gráficos',
      description: 'Visualiza tus finanzas',
      icon: <BarChart3 size={28} />,
      color: 'from-teal-500/20 to-teal-600/20',
      route: '/analytics',
      stats: '12 meses',
      gradient: 'from-teal-500/10 via-teal-600/5 to-transparent',
      borderColor: 'border-teal-500/30'
    },
    reports: {
      id: 'reports',
      title: 'Reportes',
      description: 'Genera reportes personalizados',
      icon: <FileText size={28} />,
      color: 'from-gray-500/20 to-gray-600/20',
      route: '/admin/reports',
      stats: '8 disponibles',
      gradient: 'from-gray-500/10 via-gray-600/5 to-transparent',
      borderColor: 'border-gray-500/30'
    },
    clients: {
      id: 'clients',
      title: 'Clientes',
      description: 'Gestiona tus clientes',
      icon: <Users size={28} />,
      color: 'from-amber-500/20 to-amber-600/20',
      route: '/admin/clients',
      stats: '28 activos',
      gradient: 'from-amber-500/10 via-amber-600/5 to-transparent',
      borderColor: 'border-amber-500/30'
    },
    settings: {
      id: 'settings',
      title: 'Configuración',
      description: 'Personaliza tu experiencia',
      icon: <Settings size={28} />,
      color: 'from-slate-500/20 to-slate-600/20',
      route: '/settings',
      stats: 'Preferencias',
      gradient: 'from-slate-500/10 via-slate-600/5 to-transparent',
      borderColor: 'border-slate-500/30'
    }
  };

  // Filtrar opciones según el rol del usuario
  const availableOptions = Object.values(allOptions).filter(option => {
    if (option.id === 'reports' && userRole !== 'admin') return false;
    if (option.id === 'clients' && userRole !== 'admin') return false;
    return true;
  });

  // Obtener las opciones en el orden guardado
  const orderedModules = modulesOrder
    .filter(id => availableOptions.some(opt => opt.id === id))
    .map(id => allOptions[id])
    .filter(Boolean);

  // Agregar módulos nuevos que no están en el orden guardado
  const newModules = availableOptions.filter(
    opt => !modulesOrder.includes(opt.id)
  );
  
  const finalModules = [...orderedModules, ...newModules];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = finalModules.findIndex((item) => item.id === active.id);
      const newIndex = finalModules.findIndex((item) => item.id === over?.id);
      
      const newOrder = arrayMove(finalModules, oldIndex, newIndex).map(item => item.id);
      setModulesOrder(newOrder);
      localStorage.setItem('modulesOrder', JSON.stringify(newOrder));
    }
  };

  const quickStats = {
    balance: 12580.75,
    monthlyIncome: 3250.00,
    monthlyExpenses: 1245.50,
    monthlySavings: 2004.25
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('¡Buenos días');
    else if (hour < 18) setGreeting('¡Buenas tardes');
    else setGreeting('¡Buenas noches');

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    const timer = setTimeout(() => setShowWelcome(false), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Componente de tarjeta individual
  const ModuleCard = ({ module }: { module: QuickOption }) => (
    <button
      onClick={() => navigate(module.route)}
      className="group relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-[#F05984]/50 text-left w-full"
      style={{
        borderColor: 'rgba(255,255,255,0.1)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing">
        <GripVertical size={20} className="text-white/40" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${module.color} group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">
              {module.icon}
            </div>
          </div>
          {module.stats && (
            <span className="text-sm font-medium text-white/40 group-hover:text-white/60 transition-colors">
              {module.stats}
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-1">
          {module.title}
        </h3>
        
        <p className="text-sm text-white/40 group-hover:text-white/60 mb-4 transition-colors">
          {module.description}
        </p>
        
        <div className="flex items-center gap-1 text-[#F05984] group-hover:gap-2 transition-all duration-300">
          <span className="text-sm font-medium">Acceder</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </button>
  );

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-[#F05984]/15 via-[#BC455F]/15 to-[#6E4068]/15 backdrop-blur-sm rounded-2xl p-6 border border-white/10 animate-fade-in shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-[#F05984] to-[#BC455F] rounded-xl shadow-lg">
              <Sparkles className="text-white" size={32} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                {greeting}, {userName}! 👋
              </h1>
              <p className="text-white/60 text-sm mt-1">
                {currentTime.charAt(0).toUpperCase() + currentTime.slice(1)}
              </p>
              <p className="text-white/40 text-sm mt-2">
                Tu balance total es {formatCurrency(quickStats.balance)} | Ahorro mensual: {formatCurrency(quickStats.monthlySavings)}
              </p>
            </div>
            <button className="p-3 hover:bg-white/10 rounded-xl transition-colors">
              <Bell size={24} className="text-white/60" />
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-2xl p-4 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
          <p className="text-white/60 text-sm">Balance Total</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(quickStats.balance)}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all shadow-lg">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Ingresos</p>
              <p className="text-white font-bold">{formatCurrency(quickStats.monthlyIncome)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all shadow-lg">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-500/20 rounded-xl">
              <TrendingDown size={16} className="text-red-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Gastos</p>
              <p className="text-white font-bold">{formatCurrency(quickStats.monthlyExpenses)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all shadow-lg">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Target size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Ahorro</p>
              <p className="text-white font-bold">{formatCurrency(quickStats.monthlySavings)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Módulos del Sistema con Drag and Drop */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Módulos del Sistema</h2>
          <p className="text-white/40 text-sm flex items-center gap-2">
            <GripVertical size={14} />
            Arrastra para ordenar
          </p>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={finalModules.map(m => m.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {finalModules.map((module) => (
                <SortableItem key={module.id} id={module.id}>
                  <ModuleCard module={module} />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Información adicional según el rol */}
      {userRole === 'admin' && (
        <div className="bg-gradient-to-r from-[#321D28]/40 to-[#6E4068]/40 rounded-2xl p-4 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Users size={18} className="text-[#F05984]" />
            Panel de Administración
          </h3>
          <p className="text-white/60 text-sm">
            Tienes acceso completo a la gestión de clientes y reportes avanzados.
            Puedes ver y administrar todos los clientes desde el módulo de Clientes.
          </p>
        </div>
      )}

      {userRole === 'client' && (
        <div className="bg-gradient-to-r from-[#321D28]/40 to-[#6E4068]/40 rounded-2xl p-4 border border-white/10 shadow-lg">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <UserCircle size={18} className="text-[#F05984]" />
            Tu Panel Personal
          </h3>
          <p className="text-white/60 text-sm">
            Gestiona tus finanzas personales, establece metas de ahorro y controla tus gastos.
            Todos tus datos están seguros y disponibles en tiempo real.
          </p>
        </div>
      )}
    </div>
  );
};
