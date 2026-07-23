import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Shield, MailIcon, CheckCircle, XCircle, UserPlus, Edit, Save, Minus, Plus, Search } from 'lucide-react';
import { containerVariants, itemVariants, isStrongPassword, PASSWORD_REQUIREMENT_MESSAGE, notifyConnectionError, notifyActionError } from '../../../../shared/utils';
import { usuariosService, type ApiUsuario } from '../../../clients/services';
import { PageSkeleton } from '../../../../shared/components/ui/PageSkeleton';
import { ModalOverlay } from '../../../../shared/components/ui/ModalOverlay';
import { Select } from '../../../../shared/components/ui/Select';
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue';

const inputCls = "w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#F05984] transition-all";

export const ContadoresPage = () => {
  const [usuarios, setUsuarios] = useState<ApiUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selected, setSelected] = useState<ApiUsuario | null>(null);
  const [createForm, setCreateForm] = useState({ username: '', password: '', email: '' });
  const [editForm, setEditForm] = useState({ username: '', password: '', email: '', activo: true });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm);
  const [selectedActivo, setSelectedActivo] = useState('todos');

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      setUsuarios(await usuariosService.getAll());
    } catch {
      notifyConnectionError();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  if (isLoading) return <PageSkeleton />;

  const contadores = usuarios
    .filter(u => u.rol === 'CONTADOR')
    .map(c => ({
      ...c,
      usados: usuarios.filter(u => String(u.contadorId) === String(c.id)).length,
    }));

  const filtrados = contadores.filter(c => {
    const q = debouncedSearchTerm.toLowerCase();
    const matchSearch = (c.username ?? '').toLowerCase().includes(q) || (c.email ?? '').toLowerCase().includes(q);
    const matchActivo = selectedActivo === 'todos' || (selectedActivo === 'activo' ? c.activo !== false : c.activo === false);
    return matchSearch && matchActivo;
  });

  const handleCreate = async () => {
    const errs: Record<string, string> = {};
    if (createForm.username.length < 3) errs.username = 'Mínimo 3 caracteres';
    if (!isStrongPassword(createForm.password)) errs.password = PASSWORD_REQUIREMENT_MESSAGE;
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      await usuariosService.create({
        username: createForm.username,
        password: createForm.password,
        email: createForm.email || undefined,
        rol: 'CONTADOR',
      });
      await fetchUsuarios();
      setShowCreateModal(false);
      setErrors({});
      setCreateForm({ username: '', password: '', email: '' });
    } catch (e) {
      notifyActionError('crear', e, 'No se pudo crear el contador.');
    }
  };

  const handleEditOpen = (c: ApiUsuario) => {
    setSelected(c);
    setEditForm({ username: c.username, password: '', email: c.email ?? '', activo: c.activo !== false });
    setErrors({});
    setShowEditModal(true);
  };

  const handleAjustarLimite = async (c: ApiUsuario, delta: number) => {
    if (!c.id) return;
    const nuevoLimite = Math.max(0, (c.limiteUsuarios ?? 5) + delta);
    try {
      await usuariosService.actualizarLimite(c.id, nuevoLimite);
      await fetchUsuarios();
    } catch (e) {
      notifyActionError('actualizar', e, 'No se pudo actualizar el límite de usuarios.');
    }
  };

  const handleEditSave = async () => {
    if (!selected?.id) return;
    const errs: Record<string, string> = {};
    if (editForm.username.length < 3) errs.username = 'Mínimo 3 caracteres';
    if (editForm.password && !isStrongPassword(editForm.password)) errs.password = PASSWORD_REQUIREMENT_MESSAGE;
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      await usuariosService.update(selected.id, {
        username: editForm.username,
        password: editForm.password || undefined,
        email: editForm.email || undefined,
        rol: 'CONTADOR',
        activo: editForm.activo,
      });
      setShowEditModal(false);
      await fetchUsuarios();
    } catch (e) {
      notifyActionError('actualizar', e, 'No se pudo actualizar el contador.');
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#1a0f14' }}>

      <motion.div variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-r from-[#321D28] via-[#4a2d40] to-[#321D28] rounded-2xl p-6 border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05984]/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#F05984] to-[#BC455F] rounded-xl shadow-lg">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Contadores</h1>
              <p className="text-white/50 text-sm mt-1">{contadores.length} contador{contadores.length === 1 ? '' : 'es'} registrado{contadores.length === 1 ? '' : 's'}</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-xl hover:shadow-lg hover:shadow-[#F05984]/25 transition-all duration-300 self-start lg:self-auto">
            <UserPlus size={20} />
            <span className="hidden sm:inline font-medium">Nuevo Contador</span>
          </motion.button>
        </div>
      </motion.div>

      {contadores.length > 0 && (
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input type="text" placeholder="Buscar por username o email..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#F05984] transition-colors" />
          </div>
          <div className="w-full lg:w-48">
            <Select value={selectedActivo} onChange={setSelectedActivo}
              options={[
                { value: 'todos', label: 'Todos' },
                { value: 'activo', label: 'Activos' },
                { value: 'inactivo', label: 'Inactivos' },
              ]} />
          </div>
        </motion.div>
      )}

      {filtrados.length === 0 ? (
        <motion.div variants={itemVariants} className="bg-white/5 rounded-xl border border-white/10 py-12 flex flex-col items-center justify-center">
          <div className="p-4 bg-white/10 rounded-full mb-4"><Shield size={48} className="text-white/30" /></div>
          <h3 className="text-white font-semibold text-lg mb-2">No hay contadores</h3>
          <p className="text-white/40 text-sm">
            {contadores.length === 0 ? 'Todavía no se ha registrado ningún contador.' : 'Ningún contador coincide con la búsqueda.'}
          </p>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtrados.map((c, i) => {
              const limite = c.limiteUsuarios ?? 5;
              const pct = limite === 0 ? 100 : Math.min(100, Math.round((c.usados / limite) * 100));
              return (
                <motion.div key={c.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border border-white/10 hover:border-purple-400/50 transition-all hover:shadow-xl">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#6E4068] to-[#4a2d5a] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {(c.username ?? '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{c.username}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-400">CONTADOR</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${c.activo !== false ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {c.activo !== false ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {c.activo !== false ? 'Activo' : 'Inactivo'}
                      </span>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditOpen(c)}
                        className="p-1.5 hover:bg-blue-500/20 rounded-lg text-blue-400" title="Editar Contador">
                        <Edit size={14} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm mb-3">
                    <MailIcon size={14} className="text-white/40" />
                    <span className="text-white/60 truncate">{c.email || '—'}</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white/50 text-xs">Usuarios creados</span>
                      <span className="text-white font-bold text-xs">{c.usados}/{limite}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-[#F05984] to-[#BC455F]"
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
                    </div>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-white/10">
                      <span className="text-white/50 text-xs">Límite</span>
                      <div className="flex items-center gap-2">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleAjustarLimite(c, -1)} disabled={limite <= 0}
                          className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Disminuir límite">
                          <Minus size={12} />
                        </motion.button>
                        <span className="text-white font-bold text-xs w-4 text-center">{limite}</span>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleAjustarLimite(c, 1)}
                          className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                          title="Aumentar límite">
                          <Plus size={12} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal: crear contador */}
      <AnimatePresence>
        <ModalOverlay isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); setErrors({}); }}
          title="Nuevo Contador" subtitle="Registra un nuevo contador en el sistema"
          icon={<UserPlus size={20} className="text-white" />}>
          <form onSubmit={e => { e.preventDefault(); handleCreate(); }} className="space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Username *</label>
              <input type="text" value={createForm.username}
                onChange={e => { setCreateForm({ ...createForm, username: e.target.value }); setErrors({ ...errors, username: '' }); }}
                className={`${inputCls} ${errors.username ? 'border-red-500' : ''}`}
                placeholder="mín 3 caracteres" />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Email</label>
              <input type="email" value={createForm.email}
                onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
                className={inputCls} placeholder="ejemplo@correo.com" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Contraseña *</label>
              <input type="password" value={createForm.password}
                onChange={e => { setCreateForm({ ...createForm, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                className={`${inputCls} ${errors.password ? 'border-red-500' : ''}`}
                placeholder="mín 8 caracteres, letras y números" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button"
                onClick={() => { setShowCreateModal(false); setErrors({}); }}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all font-medium">
                Cancelar
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#F05984] to-[#BC455F] text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg">
                <Save size={18} /><span>Crear Contador</span>
              </motion.button>
            </div>
          </form>
        </ModalOverlay>
      </AnimatePresence>

      {/* Modal: editar contador */}
      <AnimatePresence>
        <ModalOverlay isOpen={showEditModal && !!selected} onClose={() => setShowEditModal(false)}
          title="Editar Contador" subtitle={`Datos de: ${selected?.username}`}
          icon={<Edit size={20} className="text-white" />}>
          <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Username *</label>
              <input type="text" value={editForm.username}
                onChange={e => { setEditForm({ ...editForm, username: e.target.value }); setErrors({ ...errors, username: '' }); }}
                className={`${inputCls} ${errors.username ? 'border-red-500' : ''}`} />
              {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Email</label>
              <input type="email" value={editForm.email}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Nueva contraseña</label>
              <input type="password" value={editForm.password}
                onChange={e => { setEditForm({ ...editForm, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                className={`${inputCls} ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Dejar en blanco para no cambiarla" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={editForm.activo}
                onChange={e => setEditForm({ ...editForm, activo: e.target.checked })}
                className="rounded border-white/20" />
              Activo
            </label>
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
