import { useEffect, useState } from 'react';

// Devuelve `value` retrasado `delayMs`, reseteando el timer en cada cambio — evita
// refiltrar/re-renderizar en cada tecla mientras el usuario todavía está escribiendo.
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
