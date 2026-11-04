import React from 'react';
import { BookOpen, Plus, RotateCcw, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  hasAnyGoals: boolean;
  onFocusForm: () => void;
  onResetFilters: () => void;
  onLoadSamples: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasAnyGoals,
  onFocusForm,
  onResetFilters,
  onLoadSamples,
}) => {
  if (hasAnyGoals) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 text-center shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Nenhum objetivo encontrado para este filtro
        </h3>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Você possui objetivos cadastrados, mas nenhum corresponde à busca ou aos filtros selecionados no momento.
        </p>
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Limpar filtros e ver todos</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-8 sm:p-10 text-center shadow-2xs">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/70 dark:to-emerald-950/50 border border-teal-200/70 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto mb-4 shadow-2xs">
        <BookOpen className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        Sua lista de estudos ainda está vazia
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
        Comece cadastrando o seu primeiro objetivo de estudo ao lado. Definir pequenos passos ajuda a manter a constância sem sobrecarga.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onFocusForm}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Criar meu primeiro objetivo</span>
        </button>

        <button
          type="button"
          onClick={onLoadSamples}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          <span>Carregar exemplos de estudo</span>
        </button>
      </div>
    </div>
  );
};
