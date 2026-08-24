import { useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  addMonths, subMonths, format, parseISO, isSameDay, isSameMonth, isValid,
} from 'date-fns';
import { es } from 'date-fns/locale';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// ponytail: mismo problema que Select — el <input type="date"> abre el calendario
// nativo del navegador/SO, que se sale del viewport emulado. Popover + grilla propia
// (date-fns ya está instalado) lo mantiene dentro del viewport real.
export const DatePicker = ({ value, onChange, placeholder = 'Seleccionar fecha', disabled, min, max, className = '' }: DatePickerProps) => {
  const selected = value ? parseISO(value) : null;
  const hasSelected = !!selected && isValid(selected);
  const [viewDate, setViewDate] = useState(() => (hasSelected ? selected! : new Date()));

  const gridStart = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const minDate = min ? parseISO(min) : null;
  const maxDate = max ? parseISO(max) : null;

  return (
    <Popover className="relative">
      <PopoverButton
        type="button"
        disabled={disabled}
        className={`w-full flex items-center gap-2 px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#8A5CF6] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left ${className}`}
      >
        <Calendar size={16} className="text-white/50 shrink-0" />
        <span className={hasSelected ? '' : 'text-white/40'}>
          {hasSelected ? format(selected!, 'dd/MM/yyyy') : placeholder}
        </span>
      </PopoverButton>
      <PopoverPanel
        anchor="bottom start"
        className="z-50 mt-1 w-72 max-w-[calc(100vw-2rem)] rounded-lg bg-[#08080B] border border-white/10 shadow-xl p-3 [--anchor-gap:4px]"
      >
        {({ close }) => (
          <>
            <div className="flex items-center justify-between mb-2">
              <button type="button" onClick={() => setViewDate(d => subMonths(d, 1))} className="p-1 rounded hover:bg-white/10 text-white/70">
                <ChevronLeft size={16} />
              </button>
              <span className="text-white text-sm font-medium capitalize">{format(viewDate, 'MMMM yyyy', { locale: es })}</span>
              <button type="button" onClick={() => setViewDate(d => addMonths(d, 1))} className="p-1 rounded hover:bg-white/10 text-white/70">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-white/40 mb-1">
              {WEEKDAYS.map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map(day => {
                const isOutside = !isSameMonth(day, viewDate);
                const isSelected = hasSelected && isSameDay(day, selected!);
                const isDisabled = !!((minDate && day < minDate) || (maxDate && day > maxDate));
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => { onChange(format(day, 'yyyy-MM-dd')); close(); }}
                    className={`text-xs py-1.5 rounded-lg transition-colors ${
                      isSelected ? 'bg-[#8A5CF6] text-white'
                        : isOutside ? 'text-white/20 hover:bg-white/5'
                        : 'text-white/80 hover:bg-white/10'
                    } ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}`}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </PopoverPanel>
    </Popover>
  );
};
