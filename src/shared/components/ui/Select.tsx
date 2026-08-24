import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// ponytail: reemplaza el <select> nativo en los modales — su lista de opciones es un
// popup del navegador/SO que ignora el viewport emulado (DevTools/dispositivo) y se
// desbordaba de la pantalla. Mismo patrón que SearchFilterBar: Listbox + anchor lo
// mantiene dentro del viewport real.
export const Select = ({ value, onChange, options, placeholder = 'Seleccionar...', disabled, className = '' }: SelectProps) => {
  const selected = options.find(o => o.value === value);
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className="relative">
        <ListboxButton
          type="button"
          className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#8A5CF6] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left ${className}`}
        >
          <span className={`truncate ${selected ? '' : 'text-white/40'}`}>{selected?.label ?? placeholder}</span>
          <ChevronDown size={16} className="text-white/50 shrink-0" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="z-50 mt-1 w-[var(--button-width)] max-h-64 overflow-y-auto rounded-lg bg-[#08080B] border border-white/10 shadow-xl focus:outline-none [--anchor-gap:4px]"
        >
          {options.map(opt => (
            <ListboxOption
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className="px-3 py-2 text-sm text-white/80 data-[focus]:bg-white/10 data-[focus]:text-white cursor-pointer data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed truncate"
            >
              {opt.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};
