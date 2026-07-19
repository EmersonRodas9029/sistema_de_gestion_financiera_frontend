import { Switch } from '@headlessui/react';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  activeColor?: string;
}

// Envuelve @headlessui/react Switch para tener rol/teclado correctos (a diferencia de un
// <div onClick> plano), con el mismo tamaño/estilo que los toggles inline que reemplaza.
export const Toggle = ({ value, onChange, label, activeColor = 'bg-[#F05984]' }: ToggleProps) => (
  <Switch.Group as="div" className="flex items-center gap-3">
    <Switch
      checked={value}
      onChange={onChange}
      className={`${value ? activeColor : 'bg-white/20'} relative inline-flex h-5 w-10 items-center rounded-full transition-colors`}
    >
      <span className={`${value ? 'translate-x-5' : 'translate-x-0.5'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
    </Switch>
    {label && <Switch.Label className="text-white/60 text-sm cursor-pointer">{label}</Switch.Label>}
  </Switch.Group>
);
