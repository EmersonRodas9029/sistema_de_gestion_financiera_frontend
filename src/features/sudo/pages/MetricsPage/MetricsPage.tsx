import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, User, Shield, ShieldCheck, XCircle, TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { containerVariants, itemVariants, formatCurrency, notifyConnectionError } from '../../../../shared/utils';
import { usuariosService, type ApiUsuario } from '../../../clients/services';
import { gastosService } from '../../../expenses/services';
import { ingresosService } from '../../../incomes/services';
import { presupuestosService } from '../../../budgets/services';
import { metasService } from '../../../goals/services';
import { PageSkeleton } from '../../../../shared/components/ui/PageSkeleton';

export const MetricsPage = () => {
  const [usuarios, setUsuarios] = useState<ApiUsuario[]>([]);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [presupuestosActivos, setPresupuestosActivos] = useState(0);
  const [metasActivas, setMetasActivas] = useState(0);
  const [metasCompletadas, setMetasCompletadas] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [usuariosData, gastos, ingresos, presupuestos, metas] = await Promise.all([
          usuariosService.getAll(),
          gastosService.getAll(),
          ingresosService.getAll(),
          presupuestosService.getAll(),
          metasService.getAll(),
        ]);
        setUsuarios(usuariosData);
        setTotalGastos(gastos.filter(g => g.activo !== false).reduce((sum, g) => sum + (g.monto ?? 0), 0));
        setTotalIngresos(ingresos.filter(i => i.activo !== false).reduce((sum, i) => sum + (i.monto ?? 0), 0));
        setPresupuestosActivos(presupuestos.filter(p => p.activo !== false).length);
        setMetasActivas(metas.filter(m => m.activa !== false && !m.completada).length);
        setMetasCompletadas(metas.filter(m => m.completada).length);
      } catch {
        notifyConnectionError();
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (isLoading) return <PageSkeleton />;

  const totalUsuarios   = usuarios.length;
  const totalClientes   = usuarios.filter(u => u.rol === 'CLIENTE').length;
  const totalContadores = usuarios.filter(u => u.rol === 'CONTADOR').length;
  const totalSudos      = usuarios.filter(u => u.rol === 'SUDO').length;
  const totalInactivos  = usuarios.filter(u => u.activo === false).length;
  const balance = totalIngresos - totalGastos;

  const contadores = usuarios
    .filter(u => u.rol === 'CONTADOR')
    .map(c => ({
      ...c,
      usados: usuarios.filter(u => String(u.contadorId) === String(c.id)).length,
    }));

  const usuarioStats = [
    { label: 'Total Usuarios', value: totalUsuarios,   icon: <Users size={24} className="text-[#8A5CF6]" />, bg: 'from-[#8A5CF6] to-[#46C7E0]' },
    { label: 'Clientes',       value: totalClientes,   icon: <User size={24} className="text-[#8A5CF6]" />,   bg: 'from-[#8A5CF6] to-[#4a2040]' },
    { label: 'Contadores',     value: totalContadores, icon: <Shield size={24} className="text-purple-400" />, bg: 'from-[#1e1b2e] to-[#2d2a3d]' },
    { label: 'Sudo',           value: totalSudos,      icon: <ShieldCheck size={24} className="text-amber-400" />, bg: 'from-[#2e2410] to-[#3d3320]' },
    { label: 'Inactivos',      value: totalInactivos,  icon: <XCircle size={24} className="text-gray-400" />, bg: 'from-[#1e293b] to-[#334155]' },
  ];

  const financeStats = [
    { label: 'Ingresos totales', value: formatCurrency(totalIngresos), icon: <TrendingUp size={24} className="text-green-400" />, bg: 'from-[#0f2e1c] to-[#1a3d2a]' },
    { label: 'Gastos totales',   value: formatCurrency(totalGastos),   icon: <TrendingDown size={24} className="text-red-400" />, bg: 'from-[#2e0f0f] to-[#3d1a1a]' },
    { label: 'Balance',          value: formatCurrency(balance),       icon: <Wallet size={24} className={balance >= 0 ? 'text-green-400' : 'text-red-400'} />, bg: 'from-[#8A5CF6] to-[#4a2040]' },
    { label: 'Presupuestos activos', value: presupuestosActivos, icon: <Wallet size={24} className="text-[#8A5CF6]" />, bg: 'from-[#1e1b2e] to-[#2d2a3d]' },
    { label: 'Metas activas / completadas', value: `${metasActivas} / ${metasCompletadas}`, icon: <Target size={24} className="text-amber-400" />, bg: 'from-[#2e2410] to-[#3d3320]' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      className="space-y-6 min-h-screen p-6" style={{ backgroundColor: '#08080B' }}>

      <motion.div variants={itemVariants}
        className="relative overflow-hidden bg-[#101015] border border-white/[0.07] rounded-[20px] p-6">
        <div className="absolute -top-16 -right-10 w-56 h-56 bg-[#F26D5B]/10 rounded-full blur-[60px]" />
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-[#8A5CF6] to-[#F26D5B] rounded-xl shadow-lg">
            <BarChart3 size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Métricas</h1>
            <p className="text-white/50 text-sm mt-1">Vista general del sistema</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">Usuarios</p>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {usuarioStats.map(s => (
            <motion.div key={s.label} whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}
              className="bg-[#101015] rounded-[20px] p-5 border border-white/[0.07] shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm font-medium">{s.label}</p>
                  <p className="text-2xl font-bold mt-1 tracking-tight text-white">{s.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/10">{s.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">Finanzas (todos los clientes)</p>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {financeStats.map(s => (
            <motion.div key={s.label} whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}
              className="bg-[#101015] rounded-[20px] p-5 border border-white/[0.07] shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm font-medium">{s.label}</p>
                  <p className="text-xl font-bold mt-1 tracking-tight text-white">{s.value}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/10">{s.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}
        className="bg-[#101015] rounded-xl border border-white/10 shadow-lg p-5">
        <p className="text-white font-semibold text-sm mb-4">Uso por contador (usuarios creados)</p>
        {contadores.length === 0 ? (
          <p className="text-white/40 text-sm">No hay contadores registrados.</p>
        ) : (
          <div className="space-y-4">
            {contadores.map(c => {
              const limite = c.limiteUsuarios ?? 5;
              const pct = limite === 0 ? 100 : Math.min(100, Math.round((c.usados / limite) * 100));
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white/70 text-sm">{c.username}</span>
                    <span className="text-white font-bold text-sm">{c.usados}/{limite}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-[#8A5CF6] to-[#F26D5B]"
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
