import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  GOAL_STATUS_LABELS,
  GoalStatus,
  StatusFilter,
  StudyGoal,
  StudyGoalFormData,
} from './types/studyGoal';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { GoalSummary } from './components/GoalSummary';
import { GoalForm } from './components/GoalForm';
import { GoalList } from './components/GoalList';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { StudyTipsSection } from './components/StudyTipsSection';
import { ToastContainer, ToastMessage } from './components/ToastContainer';
import { Download, Upload } from 'lucide-react';

export default function App() {
  const [goals, setGoals] = useState<StudyGoal[]>(() => storageService.getGoals());
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<StudyGoal | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    storageService.getTheme()
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Aplica a classe .dark no elemento raiz <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storageService.saveTheme(theme);
  }, [theme]);

  // Sincronização caso outra aba modifique o localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setGoals(storageService.getGoals());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToast = useCallback(
    (title: string, options?: { variant?: 'success' | 'info'; onUndo?: () => void }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [
        ...prev.slice(-2),
        { id, title, variant: options?.variant ?? 'success', onUndo: options?.onUndo },
      ]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleFocusForm = () => {
    setEditingGoal(null);
    const formElement = document.getElementById('formulario');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 150);
  };

  const handleSaveGoal = (formData: StudyGoalFormData) => {
    if (editingGoal) {
      const updated = storageService.updateGoal(editingGoal.id, formData);
      setGoals(updated);
      setEditingGoal(null);
      addToast('Objetivo atualizado com sucesso!');
    } else {
      const updated = storageService.createGoal(formData);
      setGoals(updated);
      addToast('Novo objetivo adicionado ao plano!');
    }
  };

  const handleStartEdit = (goal: StudyGoal) => {
    setEditingGoal(goal);
    const formElement = document.getElementById('formulario');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 150);
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
  };

  const handleQuickStatusChange = (goal: StudyGoal, newStatus: GoalStatus) => {
    if (goal.status === newStatus) return;

    const previousStatus = goal.status;
    const updated = storageService.updateGoal(goal.id, {
      title: goal.title,
      description: goal.description,
      deadline: goal.deadline,
      status: newStatus,
      category: goal.category,
      priority: goal.priority,
      subtasks: goal.subtasks,
    });
    setGoals(updated);

    if (editingGoal && editingGoal.id === goal.id) {
      setEditingGoal({ ...editingGoal, status: newStatus });
    }

    addToast(`Status alterado para "${GOAL_STATUS_LABELS[newStatus]}"`, {
      variant: newStatus === GoalStatus.COMPLETED ? 'success' : 'info',
      onUndo: () => {
        const reverted = storageService.updateGoal(goal.id, {
          title: goal.title,
          description: goal.description,
          deadline: goal.deadline,
          status: previousStatus,
          category: goal.category,
          priority: goal.priority,
          subtasks: goal.subtasks,
        });
        setGoals(reverted);
      },
    });
  };

  const handleToggleSubtask = (goalId: string, subtaskId: string) => {
    const updated = storageService.toggleSubtask(goalId, subtaskId);
    setGoals(updated);
    if (editingGoal && editingGoal.id === goalId) {
      const refreshed = updated.find((g) => g.id === goalId) ?? null;
      setEditingGoal(refreshed);
    }
  };

  const handleRequestDelete = (goal: StudyGoal) => {
    setGoalToDelete(goal);
  };

  const handleConfirmDelete = () => {
    if (!goalToDelete) return;

    const previousGoalsSnapshot = [...goals];
    const deletedGoal = goalToDelete;
    const updated = storageService.deleteGoal(deletedGoal.id);
    setGoals(updated);

    if (editingGoal && editingGoal.id === deletedGoal.id) {
      setEditingGoal(null);
    }

    setGoalToDelete(null);

    addToast(`"${deletedGoal.title}" foi excluído`, {
      variant: 'info',
      onUndo: () => {
        storageService.saveGoals(previousGoalsSnapshot);
        setGoals(previousGoalsSnapshot);
      },
    });
  };

  const handleCancelDelete = () => {
    setGoalToDelete(null);
  };

  const handleLoadSamples = () => {
    const sampleGoals = storageService.loadSampleGoals();
    setGoals(sampleGoals);
    addToast('Exemplos de estudo carregados!');
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(goals, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `studyflow-backup-${dateStamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('Backup JSON exportado com sucesso!');
  };

  const handleImportJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      const imported = storageService.importGoalsFromJson(content);
      if (imported) {
        setGoals(imported);
        setEditingGoal(null);
        addToast(`${imported.length} objetivo(s) importado(s) com sucesso!`);
      } else {
        addToast('Arquivo inválido. Selecione um backup JSON do StudyFlow.', {
          variant: 'info',
        });
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div
      id="topo"
      className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors"
    >
      <Header
        onFocusForm={handleFocusForm}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <GoalSummary
          goals={goals}
          activeFilter={statusFilter}
          onSelectFilter={setStatusFilter}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Formulário de Cadastro / Edição */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <GoalForm
              editingGoal={editingGoal}
              onSubmit={handleSaveGoal}
              onCancelEdit={handleCancelEdit}
              titleInputRef={titleInputRef}
            />
          </div>

          {/* Coluna Direita: Lista de Objetivos Cadastrados */}
          <div className="lg:col-span-7">
            <GoalList
              goals={goals}
              editingGoalId={editingGoal ? editingGoal.id : null}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onEditGoal={handleStartEdit}
              onRequestDeleteGoal={handleRequestDelete}
              onStatusChange={handleQuickStatusChange}
              onToggleSubtask={handleToggleSubtask}
              onFocusForm={handleFocusForm}
              onLoadSamples={handleLoadSamples}
            />
          </div>
        </div>

        <StudyTipsSection />
      </main>

      <footer className="mt-12 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              StudyFlow
            </span>
            <span className="hidden sm:inline" aria-hidden="true">
              —
            </span>
            <span>
              Seus objetivos ficam salvos automaticamente neste navegador.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportJsonChange}
              className="hidden"
              aria-label="Selecionar arquivo JSON para importar objetivos"
            />
            {goals.length > 0 && (
              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Exportar Backup (.json)</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Importar Backup</span>
            </button>
          </div>
        </div>
      </footer>

      <DeleteConfirmModal
        goalToDelete={goalToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
