import React, { useMemo, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  CategoryFilter,
  GOAL_CATEGORY_LABELS,
  GOAL_STATUS_LABELS,
  GoalCategory,
  GoalPriority,
  GoalStatus,
  SortOption,
  StatusFilter,
  StudyGoal,
  ViewMode,
} from '../types/studyGoal';
import { GoalCard } from './GoalCard';
import { EmptyState } from './EmptyState';
import { Columns3, LayoutList, Search, X } from 'lucide-react';

interface GoalListProps {
  goals: StudyGoal[];
  editingGoalId: string | null;
  statusFilter?: StatusFilter;
  onStatusFilterChange?: (filter: StatusFilter) => void;
  onEditGoal: (goal: StudyGoal) => void;
  onRequestDeleteGoal: (goal: StudyGoal) => void;
  onStatusChange: (goal: StudyGoal, newStatus: GoalStatus) => void;
  onToggleSubtask?: (goalId: string, subtaskId: string) => void;
  onFocusForm: () => void;
  onLoadSamples: () => void;
}

const PRIORITY_WEIGHT: Record<GoalPriority, number> = {
  alta: 3,
  media: 2,
  baixa: 1,
};

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  editingGoalId,
  statusFilter: controlledStatusFilter,
  onStatusFilterChange,
  onEditGoal,
  onRequestDeleteGoal,
  onStatusChange,
  onToggleSubtask,
  onFocusForm,
  onLoadSamples,
}) => {
  const [internalStatusFilter, setInternalStatusFilter] =
    useState<StatusFilter>('todos');
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('deadline_asc');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const statusFilter = controlledStatusFilter ?? internalStatusFilter;
  const setStatusFilter = (next: StatusFilter) => {
    setInternalStatusFilter(next);
    onStatusFilterChange?.(next);
  };

  // Categorias únicas presentes nos objetivos atuais
  const availableCategories = useMemo(() => {
    const set = new Set<GoalCategory>();
    goals.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return Array.from(set);
  }, [goals]);

  const filteredAndSortedGoals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = goals.filter((goal) => {
      const matchesStatus =
        viewMode === 'kanban' ||
        statusFilter === 'todos' ||
        goal.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'todas' || goal.category === categoryFilter;
      const matchesSearch =
        !query ||
        goal.title.toLowerCase().includes(query) ||
        goal.description.toLowerCase().includes(query) ||
        (goal.subtasks ?? []).some((st) =>
          st.title.toLowerCase().includes(query)
        );

      return matchesStatus && matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'deadline_asc') {
        return a.deadline.localeCompare(b.deadline);
      }
      if (sortBy === 'priority_desc') {
        const diff =
          (PRIORITY_WEIGHT[b.priority] ?? 2) -
          (PRIORITY_WEIGHT[a.priority] ?? 2);
        return diff !== 0 ? diff : a.deadline.localeCompare(b.deadline);
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title, 'pt-BR');
      }
      // created_desc
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [goals, statusFilter, categoryFilter, searchQuery, sortBy, viewMode]);

  const handleResetFilters = () => {
    setStatusFilter('todos');
    setCategoryFilter('todas');
    setSearchQuery('');
  };

  const countByFilter = (filter: StatusFilter): number => {
    if (filter === 'todos') return goals.length;
    return goals.filter((g) => g.status === filter).length;
  };

  return (
    <section id="objetivos" aria-labelledby="goals-list-heading">
      {/* Header da Lista, Modo de Visualização e Ordenação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2
            id="goals-list-heading"
            className="text-lg font-bold text-slate-900 dark:text-white"
          >
            Meus Objetivos de Estudo
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Exibindo{' '}
            <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-200">
              {filteredAndSortedGoals.length}
            </span>{' '}
            de{' '}
            <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-200">
              {goals.length}
            </span>{' '}
            {goals.length === 1
              ? 'objetivo cadastrado'
              : 'objetivos cadastrados'}
          </p>
        </div>

        {/* Controles de Visualização e Ordenação */}
        {goals.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Alternador Lista / Kanban */}
            <div
              role="group"
              aria-label="Modo de visualização"
              className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/70"
            >
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Lista</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                aria-pressed={viewMode === 'kanban'}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Kanban</span>
              </button>
            </div>

            {goals.length > 1 && (
              <div className="flex items-center gap-1.5">
                <label
                  htmlFor="sort-goals"
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap sr-only sm:not-sr-only"
                >
                  Ordenar:
                </label>
                <select
                  id="sort-goals"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-teal-600"
                >
                  <option value="deadline_asc">Prazo mais próximo</option>
                  <option value="priority_desc">Maior prioridade</option>
                  <option value="created_desc">Adicionados recentemente</option>
                  <option value="title_asc">Ordem alfabética (A–Z)</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Barra de Filtros e Busca (visível quando há objetivos cadastrados) */}
      {goals.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 mb-5 space-y-3 shadow-2xs">
          {/* Abas de filtro por status (no modo Lista) */}
          {viewMode === 'list' && (
            <div
              role="tablist"
              aria-label="Filtrar objetivos por status"
              className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl"
            >
              {(
                [
                  'todos',
                  GoalStatus.NOT_STARTED,
                  GoalStatus.IN_PROGRESS,
                  GoalStatus.COMPLETED,
                ] as StatusFilter[]
              ).map((filterOption) => {
                const isSelected = statusFilter === filterOption;
                const label =
                  filterOption === 'todos'
                    ? 'Todos'
                    : GOAL_STATUS_LABELS[filterOption];
                const count = countByFilter(filterOption);

                return (
                  <button
                    key={filterOption}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setStatusFilter(filterOption)}
                    className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{label}</span>{' '}
                    <span className="font-mono tabular-nums text-slate-400 dark:text-slate-500 ml-1">
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Campo de busca + Filtro de Categoria */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, descrição ou etapa..."
                aria-label="Buscar objetivos por título, descrição ou etapa"
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-teal-600 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpar busca"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {availableCategories.length > 1 && (
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as CategoryFilter)
                }
                aria-label="Filtrar por área de estudo"
                className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-600"
              >
                <option value="todas">Todas as áreas</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {GOAL_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {/* Lista de Cartões, Quadro Kanban ou Estado Vazio */}
      {filteredAndSortedGoals.length === 0 ? (
        <EmptyState
          hasAnyGoals={goals.length > 0}
          onFocusForm={onFocusForm}
          onResetFilters={handleResetFilters}
          onLoadSamples={onLoadSamples}
        />
      ) : viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {(
            [
              GoalStatus.NOT_STARTED,
              GoalStatus.IN_PROGRESS,
              GoalStatus.COMPLETED,
            ] as GoalStatus[]
          ).map((colStatus) => {
            const colGoals = filteredAndSortedGoals.filter(
              (g) => g.status === colStatus
            );
            const dotColor =
              colStatus === GoalStatus.COMPLETED
                ? 'bg-emerald-500'
                : colStatus === GoalStatus.IN_PROGRESS
                ? 'bg-amber-500'
                : 'bg-slate-400';

            return (
              <div
                key={colStatus}
                className="bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 space-y-3"
              >
                <div className="flex items-center justify-between px-1.5 py-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${dotColor}`}
                      aria-hidden="true"
                    />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {GOAL_STATUS_LABELS[colStatus]}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-mono tabular-nums font-semibold rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700">
                    {colGoals.length}
                  </span>
                </div>

                {colGoals.length === 0 ? (
                  <div className="py-8 px-3 text-center rounded-xl border border-dashed border-slate-300/80 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
                    Nenhum objetivo nesta etapa
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {colGoals.map((goal) => (
                        <GoalCard
                          key={goal.id}
                          goal={goal}
                          isEditing={editingGoalId === goal.id}
                          onEdit={onEditGoal}
                          onRequestDelete={onRequestDeleteGoal}
                          onStatusChange={onStatusChange}
                          onToggleSubtask={onToggleSubtask}
                          compact
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredAndSortedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                isEditing={editingGoalId === goal.id}
                onEdit={onEditGoal}
                onRequestDelete={onRequestDeleteGoal}
                onStatusChange={onStatusChange}
                onToggleSubtask={onToggleSubtask}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};
