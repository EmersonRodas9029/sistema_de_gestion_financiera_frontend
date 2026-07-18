import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { notificacionesService, type TipoNotificacion, type NotificacionResponse } from '../../features/notifications/services';
import { presupuestosService } from '../../features/budgets/services';
import { gastosService } from '../../features/expenses/services';
import { metasService } from '../../features/goals/services';
import { gastosRecurrentesService, type ApiGastoRecurrente } from '../../features/recurring-expenses/services';
import { configuracionesService } from '../../features/settings/services';
import { getCurrentClientSession } from './useCurrentClient';

const DIAS_AVISO_RECURRENTE = 3; // avisar si el próximo cobro cae dentro de estos días
const DIAS_AVISO_META = 7; // avisar si la meta vence dentro de estos días
const DIAS_GRACIA_RECURRENTE = 2; // margen antes de considerar un gasto recurrente "vencido"
const UMBRAL_AVISO_PRESUPUESTO = 0.9; // avisar antes de excederse al llegar a este % del presupuesto
const INTERVALO_POLLING_MS = 10 * 60 * 1000; // además del chequeo al cargar, revisar cada 10 minutos

const diffDias = (a: Date, b: Date) => Math.round((a.getTime() - b.getTime()) / 86400000);

const TODOS_LOS_TIPOS: TipoNotificacion[] = ['PRESUPUESTO_EXCEDIDO', 'GASTO_RECURRENTE', 'META_PROGRESO', 'RECORDATORIO', 'SISTEMA'];
const CLAVE_TIPOS_NOTIFICACION = 'notif_tipos_habilitados';

const tiposDesdeCache = (): TipoNotificacion[] | null => {
  try {
    const saved = JSON.parse(localStorage.getItem('settings_notifications') || '{}') as { enabledTypes?: TipoNotificacion[] };
    return saved.enabledTypes ?? null;
  } catch {
    return null;
  }
};

// Tipos habilitados por el usuario en Configuración > Notificaciones (src/features/settings).
// No hay endpoint dedicado de preferencias: se reusa /api/configuraciones (clave genérica, tipo JSON),
// con localStorage como caché/fallback si la config aún no existe o falla la red.
const tiposHabilitados = async (clienteId: number): Promise<Set<TipoNotificacion>> => {
  try {
    const configs = await configuracionesService.getAll();
    const mia = configs.find(c => c.clienteId === clienteId && c.clave === CLAVE_TIPOS_NOTIFICACION);
    if (mia) {
      const tipos = JSON.parse(mia.valor) as unknown;
      if (Array.isArray(tipos)) return new Set(tipos as TipoNotificacion[]);
    }
  } catch {
    // sin conexión o configuración inválida: caer al caché local
  }
  return new Set(tiposDesdeCache() ?? TODOS_LOS_TIPOS);
};

const proximaOcurrencia = (g: ApiGastoRecurrente): Date | null => {
  // Si nunca se procesó, la próxima ocurrencia es la fecha de inicio tal cual;
  // si ya se procesó al menos una vez, se suma un período desde la última ejecución.
  if (!g.ultimoProcesamiento) {
    const inicio = new Date(g.fechaInicio ?? '');
    return isNaN(inicio.getTime()) ? null : inicio;
  }
  const ultima = new Date(g.ultimoProcesamiento);
  if (isNaN(ultima.getTime())) return null;
  const next = new Date(ultima);
  if (g.frecuencia === 'DIARIO') next.setDate(next.getDate() + 1);
  else if (g.frecuencia === 'SEMANAL') next.setDate(next.getDate() + 7);
  else if (g.frecuencia === 'ANUAL') next.setFullYear(next.getFullYear() + 1);
  else next.setMonth(next.getMonth() + 1); // MENSUAL
  return next;
};

// Marca de deduplicación al final del mensaje, p.ej. "... #presupuesto-5-7-2026"
const extraerMarca = (mensaje: string): string | null => mensaje.match(/#([^\s]+)$/)?.[1] ?? null;

// Categorías de marca que se archivan solas cuando la condición deja de cumplirse
// (a diferencia de los hitos de meta, que quedan como logro permanente).
const esRenovable = (tipo: TipoNotificacion, marca: string) =>
  (tipo === 'PRESUPUESTO_EXCEDIDO' && marca.startsWith('presupuesto-')) ||
  (tipo === 'GASTO_RECURRENTE' && marca.startsWith('recurrente-') && !marca.startsWith('recurrente-vencido-')) ||
  (tipo === 'RECORDATORIO' && marca.startsWith('recurrente-vencido-')) ||
  (tipo === 'META_PROGRESO' && marca.startsWith('meta-') && marca.endsWith('-vence'));

// El backend no tiene endpoint de "generar notificaciones", así que el frontend
// revisa las condiciones y crea la notificación si no existe ya una activa para
// el mismo hecho (usamos una marca tipo "#presupuesto-5-7-2026" dentro del mensaje
// como clave de deduplicación, ya que la API no soporta metadata adicional).
export async function generarNotificacionesAutomaticas(clienteId: number): Promise<{ creadas: number }> {
  const hoy = new Date();
  const anio = hoy.getFullYear(), mes = hoy.getMonth() + 1;

  const [notiExistentes, presupuestosLivianos, gastosLivianos, metas, recurrentesLivianos, habilitados] = await Promise.all([
    notificacionesService.getAll().catch(() => []),
    presupuestosService.getAll().catch(() => []),
    gastosService.getAll().catch(() => []),
    metasService.getByCliente(clienteId).catch(() => []),
    gastosRecurrentesService.getByCliente(clienteId).catch(() => []),
    tiposHabilitados(clienteId),
  ]);

  const misNotisActivas = notiExistentes.filter(n => n.clienteId === clienteId && n.activa);
  const vigentes = new Set<string>(); // marcas que siguen aplicando en esta corrida
  let creadas = 0;

  const crear = (tipo: TipoNotificacion, titulo: string, mensaje: string, marca: string): Promise<unknown> => {
    // Tipo desactivado en Configuración: no se genera, y las renovables existentes se archivan solas más abajo.
    if (!habilitados.has(tipo)) return Promise.resolve();
    vigentes.add(marca);
    const yaExiste = misNotisActivas.some(n => n.tipo === tipo && n.mensaje.includes(`#${marca}`));
    if (yaExiste) return Promise.resolve();
    creadas++;
    return notificacionesService.create({ clienteId, tipo, titulo, mensaje: `${mensaje} #${marca}` }).catch(() => {});
  };

  const tareas: Promise<unknown>[] = [];

  // 1. Presupuesto: aviso temprano (90%) o excedido (100%), mes/año actuales
  // ponytail: gastos/presupuestos vienen "livianos" (sin clienteId/categoriaId), hay que hidratar por id
  // (mismo patrón que BudgetsPage); se filtra por mes actual ANTES de hidratar para no pegarle
  // a /gastos/{id} por cada gasto histórico del sistema, solo por los del mes en curso.
  const prefijoMes = `${anio}-${String(mes).padStart(2, '0')}`;
  const gastosDelMes = gastosLivianos.filter(g => g.fecha?.startsWith(prefijoMes));
  const gastos = await Promise.all(gastosDelMes.map(g => gastosService.getById(g.id!).catch(() => g)));
  const misPresupuestos = await Promise.all(
    presupuestosLivianos
      .filter(p => p.activo !== false && p.anio === anio && p.mes === mes && p.id != null)
      .map(p => presupuestosService.getById(p.id!).catch(() => null))
  );
  for (const p of misPresupuestos) {
    if (!p || p.clienteId !== clienteId) continue;
    const gastado = gastos.reduce((sum, g) => {
      if (g.clienteId !== clienteId) return sum;
      if (p.categoriaId != null && g.categoriaId !== p.categoriaId) return sum;
      if (!g.fecha) return sum;
      const [gAnio, gMes] = g.fecha.split('-').map(Number);
      if (gAnio !== p.anio || gMes !== p.mes) return sum;
      return sum + (g.monto ?? 0);
    }, 0);
    const limite = p.montoPresupuestado ?? 0;
    if (gastado >= limite) {
      tareas.push(crear(
        'PRESUPUESTO_EXCEDIDO',
        'Presupuesto excedido',
        `Has excedido tu presupuesto de $${limite} para ${mes}/${anio} (gastado: $${gastado.toFixed(2)}).`,
        `presupuesto-${p.id}-${mes}-${anio}`,
      ));
    } else if (limite > 0 && gastado / limite >= UMBRAL_AVISO_PRESUPUESTO) {
      tareas.push(crear(
        'PRESUPUESTO_EXCEDIDO',
        'Presupuesto por agotarse',
        `Vas en $${gastado.toFixed(2)} de tu presupuesto de $${limite} para ${mes}/${anio} (${Math.round((gastado / limite) * 100)}%).`,
        `presupuesto-aviso-${p.id}-${mes}-${anio}`,
      ));
    }
  }

  // 2. Metas: hito de progreso (50%/100%, quedan como logro permanente) y vencimiento próximo (se renueva)
  for (const m of metas) {
    if (m.completada || m.id == null) continue;
    const progreso = m.montoObjetivo ? (m.montoActual ?? 0) / m.montoObjetivo : 0;
    if (progreso >= 1) {
      tareas.push(crear('META_PROGRESO', '¡Meta alcanzada!', `Has alcanzado tu meta "${m.nombre}".`, `meta-${m.id}-100`));
    } else if (progreso >= 0.5) {
      tareas.push(crear('META_PROGRESO', 'Progreso de meta', `Ya llevas el 50% de tu meta "${m.nombre}".`, `meta-${m.id}-50`));
    }
    if (m.fechaLimite) {
      const dias = diffDias(new Date(m.fechaLimite), hoy);
      if (dias >= 0 && dias <= DIAS_AVISO_META) {
        tareas.push(crear('META_PROGRESO', 'Meta próxima a vencer', `Tu meta "${m.nombre}" vence en ${dias} día(s).`, `meta-${m.id}-vence`));
      }
    }
  }

  // 3. Gastos recurrentes: próximos a cobrar (aviso, se renueva) y vencidos sin registrar (recordatorio, se renueva)
  const recurrentesCompletos = await Promise.all(
    recurrentesLivianos.filter(r => r.activo !== false && r.id != null).map(r => gastosRecurrentesService.getById(r.id!).catch(() => null))
  );
  for (const r of recurrentesCompletos) {
    if (!r) continue;
    const proxima = proximaOcurrencia(r);
    if (!proxima || (r.fechaFin && proxima > new Date(r.fechaFin))) continue;
    const dias = diffDias(proxima, hoy);
    const fechaTexto = proxima.toISOString().slice(0, 10);
    if (dias >= 0 && dias <= DIAS_AVISO_RECURRENTE) {
      tareas.push(crear(
        'GASTO_RECURRENTE',
        'Gasto recurrente próximo',
        `"${r.descripcion ?? 'Gasto recurrente'}" de $${r.monto} se cobrará en ${dias} día(s).`,
        `recurrente-${r.id}-${fechaTexto}`,
      ));
    } else if (dias < -DIAS_GRACIA_RECURRENTE) {
      tareas.push(crear(
        'RECORDATORIO',
        'Gasto recurrente vencido',
        `"${r.descripcion ?? 'Gasto recurrente'}" de $${r.monto} debió cobrarse el ${fechaTexto} y no se ha registrado.`,
        `recurrente-vencido-${r.id}-${fechaTexto}`,
      ));
    }
  }

  await Promise.all(tareas);

  // 4. Auto-archivar notificaciones "renovables" cuya condición ya no aplica (mes que pasó,
  // gasto recurrente que finalmente se registró, meta que ya no vence pronto, etc.).
  // Los hitos de meta (50%/100%) NO se archivan: quedan como logro permanente.
  const archivar = (n: NotificacionResponse) =>
    notificacionesService.update(n.id, {
      tipo: n.tipo, titulo: n.titulo, mensaje: n.mensaje, leida: n.leida,
      fechaProgramada: n.fechaProgramada, fechaEnviada: n.fechaEnviada, activa: false,
    }).catch(() => {});

  const obsoletas = misNotisActivas.filter(n => {
    const marca = extraerMarca(n.mensaje);
    return marca != null && esRenovable(n.tipo, marca) && !vigentes.has(marca);
  });
  await Promise.all(obsoletas.map(archivar));

  return { creadas };
}

// Evita que dos montajes casi simultáneos (p. ej. el doble efecto de React StrictMode en desarrollo)
// lean la misma lista de notificaciones existentes antes de que la primera corrida termine de crear las suyas.
let ejecucionEnCurso: Promise<void> | null = null;

const ejecutarChequeo = () => {
  const { ownClienteId } = getCurrentClientSession();
  const clienteId = Number(ownClienteId);
  if (!clienteId || ejecucionEnCurso) return;
  ejecucionEnCurso = generarNotificacionesAutomaticas(clienteId)
    .then(({ creadas }) => {
      if (creadas > 0) toast.success(creadas > 1 ? `Tienes ${creadas} notificaciones nuevas` : 'Tienes 1 notificación nueva');
    })
    .catch(() => {})
    .finally(() => { ejecucionEnCurso = null; });
};

// Corre al montar la app y luego cada INTERVALO_POLLING_MS mientras siga abierta, para el cliente
// activo guardado en localStorage.
export const useAutoNotifications = () => {
  useEffect(() => {
    ejecutarChequeo();
    const interval = setInterval(ejecutarChequeo, INTERVALO_POLLING_MS);
    return () => clearInterval(interval);
  }, []);
};
