// Lee la preferencia de "Vista por defecto" / "Elementos por página" guardada
// desde Configuración > Preferencias (settings_preferences en localStorage).
export const getViewPreferences = (): { defaultView: 'grid' | 'list'; itemsPerPage: number } => {
  try {
    const saved = JSON.parse(localStorage.getItem('settings_preferences') || '{}');
    return {
      defaultView: saved.defaultView === 'list' ? 'list' : 'grid',
      itemsPerPage: [10, 20, 50, 100].includes(saved.itemsPerPage) ? saved.itemsPerPage : 20,
    };
  } catch {
    return { defaultView: 'grid', itemsPerPage: 20 };
  }
};
