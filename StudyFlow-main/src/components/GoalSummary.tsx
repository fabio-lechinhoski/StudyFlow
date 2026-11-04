import React from 'react';
import { GoalStatus, StatusFilter, StudyGoal } from '../types/studyGoal';
import { CheckCircle2, Clock, Flame, Layers, Sparkles } from 'lucide-react';

interface GoalSummaryProps {
  goals: StudyGoal[];
  activeFilter?: StatusFilter;
  onSelectFilter?: (filter: StatusFilter) => void;
}

export const GoalSummary: React.FC<GoalSummaryProps> = ({
  goals,
  activeFilter = 'todos',
  onSelectFilter,
}) => {
  const totalCount = goals.length;
  const notStartedCount = goals.filter((g) => g.status === GoalStatus.NOT_STARTED).length;
  const inProgressCount = goals.filter((g) => g.status === GoalStatus.IN_PROGRESS).length;
  const completedCount = goals.filter((g) => g.status === GoalStatus.COMPLETED).length;

  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Cálculo para o anel circular SVG
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  const handleCardClick = (filter: StatusFilter) => {
    if (!onSelectFilter) return;
    onSelectFilter(filter);
    const listSection = document.getElementById('objetivos');
    if (listSection) {
      listSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <section id="resumo" aria-label="Resumo dos objetivos de estudo" className="mb-8">
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs">
        {/* Subtle decorative background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-teal-500/10 to-emerald-500/5 blur-2xl"
        />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 text-xs font-semibold text-teal-700 dark:text-teal-300 mb-2.5">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Planejamento de Estudos Pessoal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Organize o que você deseja aprender, passo a passo
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
              Defina metas claras, divida em pequenas etapas e acompanhe seus prazos para manter a constância sem sobrecarga.
            </p>
          </div>

          {/* Progress Widget */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 shrink-0">
            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-slate-200 dark:text-slate-700"
                />
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="text-teal-600 dark:text-teal-400 transition-all duration-500 ease-out"
                />
              </svg>
              <span className="absolute text-xs font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {completionPercentage}%
              </span>
            </div>

            <div className="flex flex-col min-w-[160px]">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Progresso geral concluído
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {completedCount} de {totalCount}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {totalCount === 1 ? 'meta' : 'metas'}
                </span>
              </div>
              <div
                className="w-full h-2 bg-slate-200/80 dark:bg-slate-700 rounded-full overflow-hidden mt-2"
                role="progressbar"
                aria-valuenow={completionPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progresso de objetivos concluídos"
              >
                <div
                  className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contadores interativos com numerais tabulares */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-5">
          <button
            type="button"
            onClick={() => handleCardClick('todos')}
            className={`group text-left p-4 rounded-xl border transition-all cursor-pointer ${
              activeFilter === 'todos'
                ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-600/40 dark:border-teal-500/40 ring-1 ring-teal-600/20'
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Objetivos cadastrados
              </span>
              <span className="w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                data-testid="total-goals-count"
                className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white"
              >
                {totalCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {totalCount === 1 ? 'objetivo no total' : 'objetivos no total'}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleCardClick(GoalStatus.NOT_STARTED)}
            className={`group text-left p-4 rounded-xl border transition-all cursor-pointer ${
              activeFilter === GoalStatus.NOT_STARTED
                ? 'bg-slate-100/90 dark:bg-slate-800 border-slate-400 dark:border-slate-600 ring-1 ring-slate-400/30'
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Não iniciados
              </span>
              <span className="w-7 h-7 rounded-lg bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-700 dark:text-slate-200">
                {notStartedCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                para começar
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleCardClick(GoalStatus.IN_PROGRESS)}
            className={`group text-left p-4 rounded-xl border transition-all cursor-pointer ${
              activeFilter === GoalStatus.IN_PROGRESS
                ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-500/50 ring-1 ring-amber-500/20'
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-amber-300/70 dark:hover:border-amber-700/50'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Em andamento
              </span>
              <span className="w-7 h-7 rounded-lg bg-amber-100/80 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-amber-700 dark:text-amber-400">
                {inProgressCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                estudando agora
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleCardClick(GoalStatus.COMPLETED)}
            className={`group text-left p-4 rounded-xl border transition-all cursor-pointer ${
              activeFilter === GoalStatus.COMPLETED
                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500/50 ring-1 ring-emerald-500/20'
                : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:border-emerald-300/70 dark:hover:border-emerald-700/50'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Concluídos
              </span>
              <span className="w-7 h-7 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                {completedCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                finalizados
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
