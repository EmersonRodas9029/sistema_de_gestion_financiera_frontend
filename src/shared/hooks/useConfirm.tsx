import { useCallback, useRef, useState } from 'react';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

interface ConfirmOptions {
  title?: string;
  danger?: boolean;
}

// Reemplazo de window.confirm() por un modal propio: confirm(msg) devuelve una Promise<boolean>,
// igual que el confirm nativo, pero renderizado con el resto de la UI (ConfirmDialogElement).
export function useConfirm() {
  const [state, setState] = useState<({ message: string } & ConfirmOptions) | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((message: string, options?: ConfirmOptions) => {
    setState({ message, ...options });
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const resolve = (value: boolean) => {
    setState(null);
    resolver.current?.(value);
  };

  const ConfirmDialogElement = state ? (
    <ConfirmDialog
      isOpen
      message={state.message}
      title={state.title}
      danger={state.danger}
      onConfirm={() => resolve(true)}
      onCancel={() => resolve(false)}
    />
  ) : null;

  return { confirm, ConfirmDialogElement };
}
