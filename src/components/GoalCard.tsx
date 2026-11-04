import React from 'react';
import { motion } from 'motion/react';
import {
  GOAL_CATEGORY_LABELS,
  GOAL_PRIORITY_LABELS,
  GOAL_STATUS_LABELS,
  GoalStatus,
  StudyGoal,
} from '../types/studyGoal';
import { getDeadlineInfo } from '../utils/dateUtils';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Flag,
  Folder,
  Trash2,
} from 'lucide-react';

interface GoalCardProps {
  goal: StudyGoal;
  isEditing: boolean;
  onEdit: (goal: StudyGoal) => void;
  onRequestDelete: (goal: StudyGoal) => void;
  onStatusChange: (goal: StudyGoal, newStatus: GoalStatus) => void;
  onToggleSubtask?: (goalId: string, subtaskId: string) => void;
  compact?: boolean;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  isEditing,
  onEdit,
  onRequestDelete,
  onStatusChange,
  onToggleSubtask,
  compact = false,
}) => {
  const deadlineInfo = getDeadlineInfo(goal.deadline, goal.status);

  const subtasks = goal.subtasks ?? [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const subtaskProgress =
    subtasks.length > 0
      ? Math.round((completedSubtasks / subtasks.length) * 100)
      : 0;

  const leftBorderAccent =
    goal.status === GoalStatus.COMPLETED
      ? 'border-l-emerald-500'
      : deadlineInfo.urgency === 'overdue'
      ? 'border-l-red-500'
      : goal.status === GoalStatus.IN_PROGRESS
      ? 'border-l-amber-500'
      : 'border-l-slate-300 dark:border-l-slate-700';

  const statusBadgeStyle =
    goal.status === GoalStatus.COMPLETED
      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60'
      : goal.status === GoalStatus.IN_PROGRESS
      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60'
      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700';

  const statusDotStyle =
    goal.status === GoalStatus.COMPLETED
      ? 'bg-emerald-500'
      : goal.status === GoalStatus.IN_PROGRESS
      ? 'bg-amber-500'
      : 'bg-slate-400';

  const urgencyBadgeStyle =
    deadlineInfo.urgency === 'overdue'
      ? 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border-red-200/80 dark:border-red-900/60 font-medium'
      : deadlineInfo.urgency === 'soon'
      ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-900/60 font-medium'
      : deadlineInfo.urgency === 'completed'
      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/50'
      : 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60';

  const priorityColor =
    goal.priority === 'alta'
      ? 'text-rose-600 dark:text-rose-400'
      : goal.priority === 'media'
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-slate-400 dark:text-slate-500';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`bg-white dark:bg-slate-900 border border-l-4 ${leftBorderAccent} rounded-xl ${
        compact ? 'p-4' : 'p-5'
      } shadow-2xs hover:shadow-md transition-all ${
        isEditing
          ? 'border-teal-600 dark:border-teal-500 ring-2 ring-teal-600/15'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Row: Badges & Action Buttons */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Semantic Badges Row */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border font-semibold ${statusBadgeStyle}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusDotStyle}`}
                aria-hidden="true"
              />
              {GOAL_STATUS_LABELS[goal.status]}
            </span>

            {goal.category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70 font-medium">
                <Folder className="w-3 h-3 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                <span>{GOAL_CATEGORY_LABELS[goal.category] ?? 'Geral'}</span>
              </span>
            )}

            {goal.priority && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                title={`Prioridade ${GOAL_PRIORITY_LABELS[goal.priority]}`}
              >
                <Flag className={`w-3 h-3 ${priorityColor}`} aria-hidden="true" />
                <span>{GOAL_PRIORITY_LABELS[goal.priority]}</span>
              </span>
            )}
          </div>

          <h3
            className={`${
              compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
            } font-bold tracking-tight ${
              goal.status === GoalStatus.COMPLETED
                ? 'text-slate-400 dark:text-slate-500 line-through'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {goal.title}
          </h3>
        </div>

        {/* Action Affordances: Edit & Delete */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(goal)}
            aria-label={`Editar objetivo ${goal.title}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
            {!compact && <span>Editar</span>}
          </button>

          <button
            type="button"
            onClick={() => onRequestDelete(goal)}
            aria-label={`Excluir objetivo ${goal.title}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            {!compact && <span>Excluir</span>}
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
        {goal.description}
      </p>

      {/* Interactive Subtasks / Checklist */}
      {subtasks.length > 0 && (
        <div className="mt-3.5 p-3 rounded-xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Etapas do estudo
            </span>
            <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              {completedSubtasks}/{subtasks.length} ({subtaskProgress}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2.5">
            <div
              className="h-full bg-teal-600 dark:bg-teal-400 transition-all duration-300"
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>
          <ul className="space-y-1.5">
            {subtasks.map((st) => (
              <li key={st.id}>
                <button
                  type="button"
                  onClick={() => onToggleSubtask?.(goal.id, st.id)}
                  className="w-full flex items-start gap-2.5 text-left py-1 px-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer group"
                >
                  <span
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                      st.completed
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 group-hover:border-teal-600'
                    }`}
                    aria-hidden="true"
                  >
                    {st.completed && <Check className="w-3 h-3" strokeWidth={3} />}
                  </span>
                  <span
                    className={`text-xs sm:text-sm leading-snug ${
                      st.completed
                        ? 'text-slate-400 dark:text-slate-500 line-through'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {st.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Deadline + Bottom Interactive Status Selector */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Deadline Pill */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 font-mono tabular-nums text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Prazo: {deadlineInfo.formattedDate}</span>
          </span>

          {deadlineInfo.relativeLabel && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] ${urgencyBadgeStyle}`}
            >
              {deadlineInfo.urgency === 'overdue' ? (
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
              ) : deadlineInfo.urgency === 'completed' ? (
                <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
              ) : (
                <Clock className="w-3 h-3" aria-hidden="true" />
              )}
              <span>{deadlineInfo.relativeLabel}</span>
            </span>
          )}
        </div>

        {/* Status Quick Switcher */}
        <div
          role="group"
          aria-label={`Alterar status de ${goal.title}`}
          className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start sm:self-auto"
        >
          {Object.values(GoalStatus).map((statusOption) => {
            const isActive = goal.status === statusOption;
            return (
              <button
                key={statusOption}
                type="button"
                onClick={() => onStatusChange(goal, statusOption)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {GOAL_STATUS_LABELS[statusOption]}
              </button>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
};
