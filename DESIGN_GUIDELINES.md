# Guías de Diseño - Sistema de Gestión Financiera

## Indicaciones para Mejorar Páginas Existentes (como CategoriesPage)

### 1. Header Mejorado
- **Fondo**: Usar gradiente `bg-gradient-to-r from-[#321D28] via-[#4a2d40] to-[#321D28]`
- **Decoraciones**: Incluir círculos con efecto blur `blur-3xl` en las esquinas
- **Icono**: Envolvente con gradiente y sombra: `bg-gradient-to-br from-[#F05984] to-[#BC455F] shadow-lg`
- **Animación**: Usar Framer Motion con `motion.div` y variants para entrada suave

### 2. Tarjetas de Resumen
- **Gradientes**: Fondo con gradientes elaborados `bg-gradient-to-br from-[#321D28] to-[#6E4068]`
- **Hover**: `whileHover={{ y: -4, scale: 1.02 }}` con transiciones spring
- **Iconos**: En cajas redondeadas con colores específicos por estadística
- **Tipografía**: Mejorar jerarquía - etiquetas grandes, subtítulos pequeños
- **Contenido sugerido**: Total categorías, Activas, Con presupuesto, Más utilizada

### 3. Sección de Gráficos
- **Gráfico de dona**: Usar Recharts para mostrar distribución de categorías
- **Top categorías**: Sección "Top 3/5 más utilizadas" con barras de progreso animadas
- **Colores**: Usar colores del tema (#F05984, #BC455F, #6E4068)
- **Estadísticas**: Mostrar número de transacciones por categoría
- **Iconos**: Iconos específicos por cada categoría en las barras

### 4. Panel de Filtros
- **Colapsable**: Usar `AnimatePresence` para panel expandible
- **Layout**: Grilla organizada para opciones de filtro
- **Botón limpiar**: Aparece condicionalmente cuando hay filtros activos
- **Opciones**: Filtrar por tipo, presupuesto, actividad

### 5. Animaciones (Framer Motion)
- **Container**: `motion.div` con `containerVariants` y `itemVariants`
- **Entrada**: Animaciones escalonadas con `staggerChildren`
- **Skeleton**: Loader con efecto pulsante mientras carga
- **Tarjetas**: `AnimatePresence` para animaciones de entrada/salida

### 6. Vistas (Grid y Lista)
- **Cards**: Efectos hover suaves, bordes con gradiente `hover:border-[#F05984]/50`
- **Estado**: Indicadores prominentes de activo/inactivo
- **Progreso**: Barras con colores dinámicos según porcentaje
- **Sombras**: `hover:shadow-xl` en hover

### 7. Modal Rediseñado
- **Animación**: `motion.div` con `AnimatePresence` para entrada/salida
- **Header**: Gradiente + icono (patrón consistente)
- **Backdrop**: `backdrop-blur-md` para fondo del modal
- **Botones**: Efectos `whileHover`, `whileTap`
- **Layout**: Grillas organizadas para el formulario

### 8. Barras de Progreso
- **Colores condicionales**: Según porcentaje (verde, amarillo, rojo)
- **Animación**: `animate={{ width: 'X%' }}` para carga suave
- **Estado**: Indicadores (bien, cuidado, excedido)
- **Valores**: Porcentajes y restantes claros

### 9. Estado Vacío
- **Diseñado**: Cuando no hay datos
- **Icono**: Grande y descriptivo
- **Acción**: Botón "Crear nueva X" en el estado vacío

### 10. Feedback Visual
- **Tooltips**: Personalizados para iconos de acción
- **Confirmación**: Visual al eliminar elementos
- **Carga**: Feedback de estado de carga claro
- **Notificaciones**: Visuales para acciones importantes

### 11. ScrollBar Personalizado
```css
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #F05984 #1a0f14;
}
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #1a0f14;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #F05984, #BC455F);
  border-radius: 10px;
}
```

### 12. Colores y Tema Consistente
- **Marca**: #F05984, #BC455F, #6E4068
- **Fondo base**: #1a0f14
- **Glass morphism**: bg-white/5 backdrop-blur-sm
- **Bordes sutiles**: border-white/10

## Páginas de Referencia

Para patrones de diseño, consultar estas páginas implementadas:
- **IncomesPage**: Patrón completo de estadísticas y gráficos
- **ExpensesPage**: Filtros avanzados y tendencias
- **RecurringExpensesPage**: Header con gradientes y animaciones
- **BudgetsPage**: Barras de progreso y top categorías
- **GoalsPage**: Animaciones y diseño moderno
- **SavingsPage**: Gráficos y visualizaciones

## Patrones de Componentes

### Summary Card Pattern
```jsx
<motion.div 
  whileHover={{ y: -4, scale: 1.02 }}
  transition={{ type: "spring", stiffness: 300 }}
  className="bg-gradient-to-br from-[#321D28] to-[#6E4068] rounded-xl p-5 border border-white/10 shadow-lg"
>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-white/60 text-sm">Etiqueta</p>
      <p className="text-2xl font-bold text-white mt-1">Valor</p>
      <p className="text-white/30 text-xs mt-1">Subtítulo</p>
    </div>
    <div className="p-3 rounded-xl bg-white/10">
      <Icon size={24} className="text-[#F05984]" />
    </div>
  </div>
</motion.div>
```

### Chart Section Pattern
```jsx
<div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg">
  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
    <Icon size={18} className="text-[#F05984]" />
    Título del Gráfico
  </h3>
  {/* Gráfico aquí */}
</div>
```

### Header Pattern
```jsx
<motion.div 
  variants={itemVariants}
  className="relative overflow-hidden bg-gradient-to-r from-[#321D28] via-[#4a2d40] to-[#321D28] rounded-2xl p-6 border border-white/10 shadow-xl"
>
  <div className="absolute top-0 right-0 w-64 h-64 bg-[#F05984]/10 rounded-full blur-3xl" />
  <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gradient-to-br from-[#F05984] to-[#BC455F] rounded-xl shadow-lg">
        <Icon size={28} className="text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Título</h1>
        <p className="text-white/50 text-sm mt-1">Subtítulo</p>
      </div>
    </div>
  </div>
</motion.div>
```

## Animaciones

### Variants para container
```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
```

### Skeleton Loader
```jsx
if (isLoading) {
  return (
    <div className="animate-pulse space-y-6">
      {/* Skeleton elements */}
    </div>
  );
}
```

## Conclusión

Siempre que trabajes en mejorar o crear una página nueva en este proyecto, consulta estas guías para mantener consistencia en el diseño y seguir los patrones establecidos.