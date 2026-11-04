import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Info, RotateCcw, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  variant?: 'success' | 'info';
  onUndo?: () => void;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white shadow-lg border border-slate-700/80"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.variant === 'info' ? (
                <Info className="w-4 h-4 text-teal-400 shrink-0" aria-hidden="true" />
              ) : (
                <CheckCircle2
                  className="w-4 h-4 text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
              )}
              <span className="text-xs sm:text-sm font-medium truncate">
                {toast.title}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {toast.onUndo && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onUndo?.();
                    onDismiss(toast.id);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-300 hover:text-teal-200 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span>Desfazer</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Fechar notificação"
                className="p-1 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
