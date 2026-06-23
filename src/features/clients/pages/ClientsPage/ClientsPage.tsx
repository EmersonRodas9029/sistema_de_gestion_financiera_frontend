import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Search, Filter, Edit, Trash2,
  ChevronDown, ChevronUp, BarChart3, Save, CheckCircle, XCircle,
  Shield, User, MailIcon,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as ReTooltip } from 'recharts';
import { containerVariants, itemVariants } from '../../../../shared/utils';
import { usuariosService, clientesService, type ApiUsuario } from '../../services';
import { PageSkeleton } from '../../../../shared/components/ui/PageSkeleton';
import { Pagination } from '../../../../shared/components/ui/Pagination';
import { ModalOverlay } from '../../../../shared/components/ui/ModalOverlay';
import { tooltipStyle } from '../../../../shared/components/ui/chartConfig';

interface Usuario {
  id: string;
  username: string;
  email: string;
  rol: 'CLIENTE' | 'CONTADOR';
  activo: boolean;
  cliente?: {
    id: string;
    nombreCompleto: string;
    telefono?: string;
    email?: string;
    fechaNacimiento?: string;
    direccion?: string;
    documentoIdentidad?: string;
    tipoDocumento?: string;
  };
}

const toUsuario = (a: ApiUsuario): Usuario => ({
  id: String(a.id ?? ''),
  username: a.username ?? '',
  email: a.email ?? '',
  rol: a.rol ?? 'CLIENTE',
  activo: a.activo !== false,
  cliente: a.cliente ? {
    id: String(a.cliente.id ?? ''),
    nombreCompleto: a.cliente.nombreCompleto ?? '',
    telefono: a.cliente.telefono,
    email: a.cliente.email,
    fechaNacimiento: a.cliente.fechaNacimiento,
    direccion: a.cliente.direccion,
    documentoIdentidad: a.cliente.documentoIdentidad,
    tipoDocumento: a.cliente.tipoDocumento,
  } : undefined,
});

const inputCls = "w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all";
const selectStyle = { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' };
const optStyle   = { backgroundColor: '#1a0f14', color: 'white' };

export const ClientsPage = () => {
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedRol, setSelectedRol]     = useState<string>('todos');
  const [selectedActivo, setSelectedActivo] = useState<string>('todos');
  const [viewMode, setViewMode]           = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading]         = useState(true);
  const [showFilters, setShowFilters]     = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [currentPage, setCurrentPage]     = useState(1);
  const [sortBy, setSortBy]               = useState<'username' | 'rol'>('username');
  const [sortOrder, setSortOrder]         = useState<'asc' | 'desc'>('asc');
  const [usuarios, setUsuarios]           = useState<Usuario[]>([]);
  const [error, setError]                 = useState<string | null>(null);

  const [createForm, setCreateForm] = useState({
    username: '', password: '', email: '', rol: 'CLIENTE',
    nombreCompleto: '', telefono: '', fechaNacimiento: '',
    direccion: '', documentoIdentidad: '', tipoDocumento: '',
  });
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [editForm, setEditForm]     = useState({
    nombreCompleto: '', telefono: '', email: '',
    fechaNacimiento: '', direccion: '', documentoIdentidad: '', tipoDocumento: '',
  });

  const itemsPerPage = 6;

  const fetchUsuarios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await usuariosService.getAll();
      setUsuarios(data.map(toUsuario));
    } catch {
      setError('No se pudo conectar con el servidor. Verifica que el backend esté activo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const totalUsuarios   = usuarios.length;
  const totalClientes   = usuarios.filter(u => u.rol === 'CLIENTE').length;
  const totalContadores = usuarios.filter(u => u.rol === 'CONTADOR').length;
  const totalInactivos  = usuarios.filter(u => !u.activo).length;

  const rolData = [
    { name: 'Clientes',   value: totalClientes,   color: '#F05984' },
    { name: 'Contadores', value: totalContadores, color: '#6E4068' },
  ].filter(d => d.value > 0);

  const filtered = usuarios.filter(u => {
    const matchSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRol    = selectedRol === 'todos' || u.rol === selectedRol;
    const matchActivo = selectedActivo === 'todos' || (selectedActivo === 'activo' ? u.activo : !u.activo);
    return matchSearch && matchRol && matchActivo;
  });

  const sorted = [...filtered].sort((a, b) => {
    const va = a[sortBy], vb = b[sortBy];
    return sortOrder === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated  = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCreate = async () => {
    const errs: Record<string, string> = {};
    if (createForm.username.length < 3) errs.username = 'Mínimo 3 caracteres';
    if (createForm.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (Object.keys(errs).length) { setCreateErrors(errs); return; }

    try {
      await usuariosService.create({
        username:           createForm.username,
        password:           createForm.password,
        email:              createForm.email || undefined,
        rol:                createForm.rol,
        nombreCompleto:     createForm.nombreCompleto || undefined,
        telefono:           createForm.telefono || undefined,
        fechaNacimiento:    createForm.fechaNacimiento || undefined,
        direccion:          createForm.direccion || undefined,
        documentoIdentidad: createForm.documentoIdentidad || undefined,
        tipoDocumento:      createForm.tipoDocumento || undefined,
      });
      await fetchUsuarios();
      setShowCreateModal(false);
      setCreateErrors({});
      setCreateForm({ username: '', password: '', email: '', rol: 'CLIENTE', nombreCompleto: '', telefono: '', fechaNacimiento: '', direccion: '', documentoIdentidad: '', tipoDocumento: '' });
    } catch {
      setError('Error al crear el usuario.');
    }
  };

  const handleEditOpen = (u: Usuario) => {
    setSelectedUsuario(u);
    setEditForm({
      nombreCompleto:    u.cliente?.nombreCompleto ?? u.username,
      telefono:          u.cliente?.telefono ?? '',
      email:             u.cliente?.email ?? u.email,
      fechaNacimiento:   u.cliente?.fechaNacimiento ?? '',
      direccion:         u.cliente?.direccion ?? '',
      documentoIdentidad: u.cliente?.documentoIdentidad ?? '',
      tipoDocumento:     u.cliente?.tipoDocumento ?? '',
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!selectedUsuario?.cliente?.id) return;
    try {
      await clientesService.update(selectedUsuario.cliente.id, {
        nombreCompleto:    editForm.nombreCompleto,
        telefono:          editForm.telefono || undefined,
        email:             editForm.email || undefined,
        fechaNacimiento:   editForm.fechaNacimiento || undefined,
        direccion:         editForm.direccion || undefined,
        documentoIdentidad: editForm.documentoIdentidad || undefined,
        tipoDocumento:     editForm.tipoDocumento || undefined,
      });
      setShowEditModal(false);
      await fetchUsuarios();
    } catch {
      setError('Error al actualizar el cliente.');
    }
  };

  const handleDelete = async (u: Usuario) => {
    if (!window.confirm('¿Desactivar este usuario?')) return;
    try {
      if (u.rol === 'CLIENTE' && u.cliente?.id) {
        await clientesService.remove(u.cliente.id);
      } else {
        await usuariosService.remove(u.id);
      }
      await fetchUsuarios();
    } catch {
      setError('Error al desactivar el usuario.');
    }
  };

  const toggleSort = (key: 'username' | 'rol') => {
    if (sortBy === key) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(key); setSortOrder('asc'); }
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-red-400">{error}</p>
      <button onClick={fetchUsuarios} className="px-4 py-2 bg-[#F05984] text-white rounded-lg">Reintentar</button>
    </div>
  );

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>

      {/* Header */}
      <motion.div variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-r from-[#321D28] via-[#4a2d40] to-[#321D28] rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05984]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#BC455F]/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#F05984] to-[#BC455F] rounded-xl shadow-lg">
              <Users size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Usuarios</h1>
              <p className="text-white/50 text-sm mt-1">Gestiona los usuarios del sistema</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Usuarios', value: totalUsuarios,   color: 'text-white',        bg: 'from-[#321D28] to-[#6E4068]',   iconBg: 'bg-white/10',        icon: <Users size={24} className="text-[#F05984]" /> },
          { label: 'Clientes',       value: totalClientes,   color: 'text-[#F05984]',    bg: 'from-[#321D28] to-[#4a2040]',   iconBg: 'bg-[#F05984]/20',    icon: <User  size={24} className="text-[#F05984]" /> },
          { label: 'Contadores',     value: totalContadores, color: 'text-purple-400',   bg: 'from-[#1e1b2e] to-[#2d2a3d]',   iconBg: 'bg-purple-500/20',   icon: <Shield size={24} className="text-purple-400" /> },
          { label: 'Inactivos',      value: totalInactivos,  color: 'text-gray-400',     bg: 'from-[#1e293b] to-[#334155]',   iconBg: 'bg-gray-500/20',     icon: <XCircle size={24} className="text-gray-400" /> },
        ].map(s => (
          <motion.div key={s.label} whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}
            className={`bg-gradient-to-br ${s.bg} rounded-xl p-5 border border-white/10 shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50 text-sm font-medium">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 tracking-tight ${s.color}`}>{s.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${s.iconBg}`}>{s.icon}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pie chart */}
      {rolData.length > 0 && (
        <motion.div variants={itemVariants}
          className="bg-gradient-to-br from-[#321D28] to-[#1a0f14] rounded-xl p-5 border border-white/10 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center gap-6">

            {/* Donut + total centrado */}
            <div className="relative flex-shrink-0">
              <PieChart width={150} height={150}>
                <Pie data={rolData} cx="50%" cy="50%" innerRadius={46} outerRadius={68}
                  paddingAngle={3} dataKey="value" animationDuration={900}>
                  {rolData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                </Pie>
                <ReTooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, 'usuarios']} />
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-white leading-none">{totalUsuarios}</span>
                <span className="text-[10px] text-white/40 mt-0.5">usuarios</span>
              </div>
            </div>

            {/* Leyenda con barras */}
            <div className="flex-1 w-full">
              <p className="text-white font-semibold text-sm mb-4">Distribución por Rol</p>
              <div className="space-y-4">
                {rolData.map(d => {
                  const pct = Math.round((d.value / totalUsuarios) * 100);
                  return (
                    <div key={d.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-white/70 text-sm">{d.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-sm">{d.value}</span>
                          <span className="text-white/40 text-xs w-8 text-right">{pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full"
                          style={{ backgroundColor: d.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.9, ease: 'easeOut' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* Search + list */}
      <motion.div variants={itemVariants} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg">
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/10">
          <div className="flex gap-1.5">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`}>
              <BarChart3 size={18} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`}>
              <Users size={18} />
            </motion.button>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:shadow-lg hover:shadow-[#F05984]/25 transition-all text-sm font-medium">
            <UserPlus size={16} />
            <span className="hidden sm:inline">Nuevo Usuario</span>
          </motion.button>
        </div>
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input type="text" placeholder="Buscar por username o email..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors" />
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[#F05984] text-white' : 'bg-white/5 hover:bg-white/10 text-white/70'}`}>
              <Filter size={20} />
            </motion.button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10 overflow-hidden">
                <div className="flex gap-4">
                  <div className="w-48">
                    <label className="text-white/60 text-xs mb-1 block">Rol</label>
                    <select value={selectedRol} onChange={e => setSelectedRol(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={selectStyle}>
                      <option value="todos"    style={optStyle}>Todos</option>
                      <option value="CLIENTE"  style={optStyle}>Cliente</option>
                      <option value="CONTADOR" style={optStyle}>Contador</option>
                    </select>
                  </div>
                  <div className="w-48">
                    <label className="text-white/60 text-xs mb-1 block">Estado</label>
                    <select value={selectedActivo} onChange={e => setSelectedActivo(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] text-sm"
                      style={selectStyle}>
                      <option value="todos"    style={optStyle}>Todos</option>
                      <option value="activo"   style={optStyle}>Activos</option>
                      <option value="inactivo" style={optStyle}>Inactivos</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort bar */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm">Ordenar:</span>
            {(['username', 'rol'] as const).map(key => (
              <button key={key} onClick={() => toggleSort(key)}
                className={`flex items-center gap-1 text-sm transition-colors ${sortBy === key ? 'text-[#F05984]' : 'text-white/60 hover:text-white'}`}>
                {key === 'username' ? 'Username' : 'Rol'}
                {sortBy === key && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </button>
            ))}
          </div>
          <span className="text-white/40 text-sm">{filtered.length} resultados</span>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="p-4 bg-white/10 rounded-full mb-4"><Users size={48} className="text-white/30" /></div>
            <h3 className="text-white font-semibold text-lg mb-2">No hay usuarios</h3>
            <p className="text-white/40 text-sm">No se encontraron usuarios con los filtros actuales.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg">
              <UserPlus size={18} /><span>Crear usuario</span>
            </motion.button>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && viewMode === 'grid' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {paginated.map((u, i) => (
                <motion.div key={u.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border border-white/10 hover:border-[#F05984]/50 transition-all hover:shadow-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#F05984] to-[#BC455F] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{u.username}</h3>
                        {u.cliente?.nombreCompleto && u.cliente.nombreCompleto !== u.username && (
                          <p className="text-white/40 text-xs">{u.cliente.nombreCompleto}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MailIcon size={14} className="text-white/40" />
                      <span className="text-white/60 truncate">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {u.rol === 'CLIENTE'
                        ? <User size={14} className="text-[#F05984]" />
                        : <Shield size={14} className="text-purple-400" />}
                      <span className={`text-xs font-medium ${u.rol === 'CLIENTE' ? 'text-[#F05984]' : 'text-purple-400'}`}>{u.rol}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${u.activo ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {u.activo ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <div className="flex gap-1">
                      {u.rol === 'CLIENTE' && u.cliente && (
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditOpen(u)}
                          className="p-1.5 hover:bg-blue-500/20 rounded-lg text-blue-400" title="Editar perfil cliente">
                          <Edit size={14} />
                        </motion.button>
                      )}
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(u)}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400" title="Eliminar">
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* List */}
        {filtered.length > 0 && viewMode === 'list' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-2">
            <AnimatePresence>
              {paginated.map((u, i) => (
                <motion.div key={u.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.03 }} whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-r from-white/5 to-white/0 rounded-lg p-3 border border-white/10 hover:border-[#F05984]/30 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#F05984] to-[#BC455F] flex items-center justify-center text-white font-bold shadow-lg">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium">{u.username}</span>
                        {u.cliente?.nombreCompleto && u.cliente.nombreCompleto !== u.username && (
                          <span className="text-white/40 text-xs">({u.cliente.nombreCompleto})</span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${u.rol === 'CLIENTE' ? 'bg-[#F05984]/20 text-[#F05984]' : 'bg-purple-500/20 text-purple-400'}`}>
                          {u.rol}
                        </span>
                      </div>
                      <p className="text-white/50 text-xs mt-0.5">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${u.activo ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                      <div className="flex items-center gap-1">
                        {u.rol === 'CLIENTE' && u.cliente && (
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditOpen(u)} className="p-1.5 hover:bg-blue-500/20 rounded-lg text-blue-400">
                            <Edit size={16} />
                          </motion.button>
                        )}
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(u)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400">
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filtered.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length}
            itemsPerPage={itemsPerPage} label="usuarios" onPageChange={setCurrentPage} />
        )}
      </motion.div>

      {/* Modal: crear usuario */}
      <AnimatePresence>
        <ModalOverlay isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}
          title="Nuevo Usuario" subtitle="Registra un nuevo usuario en el sistema"
          icon={<UserPlus size={20} className="text-white" />}>
          <form onSubmit={e => { e.preventDefault(); handleCreate(); }} className="space-y-4">
            {/* Campos base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Username *</label>
                <input type="text" value={createForm.username}
                  onChange={e => { setCreateForm({...createForm, username: e.target.value}); setCreateErrors({...createErrors, username: ''}); }}
                  className={`${inputCls} ${createErrors.username ? 'border-red-500' : ''}`}
                  placeholder="mín 3 caracteres" />
                {createErrors.username && <p className="text-red-400 text-xs mt-1">{createErrors.username}</p>}
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Email</label>
                <input type="email" value={createForm.email}
                  onChange={e => setCreateForm({...createForm, email: e.target.value})}
                  className={inputCls} placeholder="ejemplo@correo.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Contraseña *</label>
                <input type="password" value={createForm.password}
                  onChange={e => { setCreateForm({...createForm, password: e.target.value}); setCreateErrors({...createErrors, password: ''}); }}
                  className={`${inputCls} ${createErrors.password ? 'border-red-500' : ''}`}
                  placeholder="mín 6 caracteres" />
                {createErrors.password && <p className="text-red-400 text-xs mt-1">{createErrors.password}</p>}
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Rol *</label>
                <select value={createForm.rol}
                  onChange={e => setCreateForm({...createForm, rol: e.target.value})}
                  className={inputCls} style={selectStyle}>
                  <option value="CLIENTE"  style={optStyle}>Cliente</option>
                  <option value="CONTADOR" style={optStyle}>Contador</option>
                </select>
              </div>
            </div>

            {/* Campos de perfil cliente — solo cuando rol = CLIENTE */}
            <AnimatePresence>
              {createForm.rol === 'CLIENTE' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-4">
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-white/50 text-xs mb-3">Datos del perfil cliente (opcionales)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/60 text-sm mb-1.5 block">Nombre completo</label>
                        <input type="text" value={createForm.nombreCompleto}
                          onChange={e => setCreateForm({...createForm, nombreCompleto: e.target.value})}
                          className={inputCls} placeholder="Ej: Juan Pérez" />
                      </div>
                      <div>
                        <label className="text-white/60 text-sm mb-1.5 block">Teléfono</label>
                        <input type="tel" value={createForm.telefono}
                          onChange={e => setCreateForm({...createForm, telefono: e.target.value})}
                          className={inputCls} placeholder="+34 612 345 678" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-white/60 text-sm mb-1.5 block">Fecha de nacimiento</label>
                        <input type="date" value={createForm.fechaNacimiento}
                          onChange={e => setCreateForm({...createForm, fechaNacimiento: e.target.value})}
                          className={inputCls} />
                      </div>
                      <div>
                        <label className="text-white/60 text-sm mb-1.5 block">Tipo de documento</label>
                        <select value={createForm.tipoDocumento}
                          onChange={e => setCreateForm({...createForm, tipoDocumento: e.target.value})}
                          className={inputCls} style={selectStyle}>
                          <option value=""          style={optStyle}>— Sin especificar —</option>
                          <option value="DNI"       style={optStyle}>DNI</option>
                          <option value="PASAPORTE" style={optStyle}>Pasaporte</option>
                          <option value="CEDULA"    style={optStyle}>Cédula</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-white/60 text-sm mb-1.5 block">Documento de identidad</label>
                        <input type="text" value={createForm.documentoIdentidad}
                          onChange={e => setCreateForm({...createForm, documentoIdentidad: e.target.value})}
                          className={inputCls} placeholder="12345678A" />
                      </div>
                      <div>
                        <label className="text-white/60 text-sm mb-1.5 block">Dirección</label>
                        <input type="text" value={createForm.direccion}
                          onChange={e => setCreateForm({...createForm, direccion: e.target.value})}
                          className={inputCls} placeholder="Calle, número" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button"
                onClick={() => { setShowCreateModal(false); setCreateErrors({}); }}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium">
                Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg">
                <Save size={18} /><span>Crear Usuario</span>
              </motion.button>
            </div>
          </form>
        </ModalOverlay>
      </AnimatePresence>

      {/* Modal: editar perfil cliente */}
      <AnimatePresence>
        <ModalOverlay isOpen={showEditModal && !!selectedUsuario} onClose={() => setShowEditModal(false)}
          title="Editar Perfil Cliente" subtitle={`Datos del cliente: ${selectedUsuario?.username}`}
          icon={<Edit size={20} className="text-white" />}>
          <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Nombre completo</label>
                <input type="text" value={editForm.nombreCompleto}
                  onChange={e => setEditForm({...editForm, nombreCompleto: e.target.value})} className={inputCls} />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Teléfono</label>
                <input type="tel" value={editForm.telefono}
                  onChange={e => setEditForm({...editForm, telefono: e.target.value})}
                  className={inputCls} placeholder="+34 612 345 678" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Email</label>
                <input type="email" value={editForm.email}
                  onChange={e => setEditForm({...editForm, email: e.target.value})} className={inputCls} />
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Fecha de nacimiento</label>
                <input type="date" value={editForm.fechaNacimiento}
                  onChange={e => setEditForm({...editForm, fechaNacimiento: e.target.value})} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Tipo de documento</label>
                <select value={editForm.tipoDocumento}
                  onChange={e => setEditForm({...editForm, tipoDocumento: e.target.value})}
                  className={inputCls} style={selectStyle}>
                  <option value=""         style={optStyle}>— Sin especificar —</option>
                  <option value="DNI"      style={optStyle}>DNI</option>
                  <option value="PASAPORTE" style={optStyle}>Pasaporte</option>
                  <option value="CEDULA"   style={optStyle}>Cédula</option>
                </select>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-1.5 block">Documento de identidad</label>
                <input type="text" value={editForm.documentoIdentidad}
                  onChange={e => setEditForm({...editForm, documentoIdentidad: e.target.value})}
                  className={inputCls} placeholder="12345678A" />
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Dirección</label>
              <input type="text" value={editForm.direccion}
                onChange={e => setEditForm({...editForm, direccion: e.target.value})}
                className={inputCls} placeholder="Calle, número" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button"
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium">
                Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg">
                <Save size={18} /><span>Guardar Cambios</span>
              </motion.button>
            </div>
          </form>
        </ModalOverlay>
      </AnimatePresence>
    </motion.div>
  );
};
