import React, { useEffect, useState } from 'react';
import {
  GOAL_CATEGORY_LABELS,
  GOAL_PRIORITY_LABELS,
  GOAL_STATUS_DESCRIPTIONS,
  GOAL_STATUS_LABELS,
  GoalCategory,
  GoalPriority,
  GoalStatus,
  StudyGoal,
  StudyGoalFormData,
  SubTask,
} from '../types/studyGoal';
import {
  Check,
  ListTodo,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  X,
} from 'lucide-react';

interface GoalFormProps {
  editingGoal: StudyGoal | null;
  onSubmit: (data: StudyGoalFormData) => void;
  onCancelEdit: () => void;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
}

function getOffsetDateString(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function generateSuggestedSteps(title: string, category: GoalCategory): {
  suggestedDescription: string;
  steps: string[];
} {
  const cleanTitle = title.trim() || 'este tema';
  const templates: Record<GoalCategory, { desc: string; steps: string[] }> = {
    programacao: {
      desc: `Dominar os conceitos essenciais de ${cleanTitle} através de leitura técnica, exemplos comentados e resolução de exercícios práticos.`,
      steps: [
        `Estudar a documentação e conceitos base de ${cleanTitle}`,
        'Construir um pequeno exemplo prático funcionando',
        'Resolver 3 exercícios de fixação e revisar erros',
      ],
    },
    exatas: {
      desc: `Compreender a teoria e as fórmulas de ${cleanTitle} e ganhar segurança resolvendo questões passo a passo.`,
      steps: [
        `Fazer resumo das propriedades e conceitos de ${cleanTitle}`,
        'Acompanhar 3 exemplos resolvidos passo a passo',
        'Resolver 5 exercícios práticos sem consulta',
      ],
    },
    humanas: {
      desc: `Realizar leitura ativa sobre ${cleanTitle}, fichando os argumentos principais e conectando com o contexto histórico/teórico.`,
      steps: [
        `Fazer leitura ativa e destacar pontos-chave de ${cleanTitle}`,
        'Elaborar mapa mental ou síntese com as próprias palavras',
        'Responder questões discursivas ou revisar fichamento',
      ],
    },
    idiomas: {
      desc: `Praticar vocabulário, compreensão e estrutura relacionados a ${cleanTitle} em contextos reais de conversação e leitura.`,
      steps: [
        `Anotar 10 expressões ou termos novos sobre ${cleanTitle}`,
        'Ouvir um diálogo ou ler um texto curto aplicando o tema',
        'Escrever 5 frases próprias e praticar a pronúncia em voz alta',
      ],
    },
    design: {
      desc: `Explorar referências visuais e fundamentos de ${cleanTitle}, aplicando as boas práticas em um estudo prático de interface.`,
      steps: [
        `Analisar 3 boas referências de ${cleanTitle}`,
        'Criar rascunho/componente aplicando espaçamento e tipografia',
        'Revisar contraste, consistência visual e acessibilidade',
      ],
    },
    carreira: {
      desc: `Estruturar e executar um plano prático para ${cleanTitle} com foco em evolução profissional e organização pessoal.`,
      steps: [
        `Definir metas claras e critérios de conclusão para ${cleanTitle}`,
        'Executar a primeira etapa prática em bloco de foco (Pomodoro)',
        'Revisar resultados e ajustar próximos passos da semana',
      ],
    },
    outros: {
      desc: `Estudar os fundamentos de ${cleanTitle} de forma estruturada, combinando teoria enxuta com prática ativa.`,
      steps: [
        `Estudar os conceitos fundamentais de ${cleanTitle}`,
        'Anotar resumo com os 3 aprendizados mais importantes',
        'Realizar uma atividade prática de revisão',
      ],
    },
  };

  const chosen = templates[category] ?? templates.outros;
  return {
    suggestedDescription: chosen.desc,
    steps: chosen.steps,
  };
}

export const GoalForm: React.FC<GoalFormProps> = ({
  editingGoal,
  onSubmit,
  onCancelEdit,
  titleInputRef,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(() => getOffsetDateString(7));
  const [status, setStatus] = useState<GoalStatus>(GoalStatus.NOT_STARTED);
  const [category, setCategory] = useState<GoalCategory>('programacao');
  const [priority, setPriority] = useState<GoalPriority>('media');
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description);
      setDeadline(editingGoal.deadline);
      setStatus(editingGoal.status);
      setCategory(editingGoal.category ?? 'outros');
      setPriority(editingGoal.priority ?? 'media');
      setSubtasks(editingGoal.subtasks ?? []);
      setNewSubtaskTitle('');
      setErrorMessage(null);
    } else {
      setTitle('');
      setDescription('');
      setDeadline(getOffsetDateString(7));
      setStatus(GoalStatus.NOT_STARTED);
      setCategory('programacao');
      setPriority('media');
      setSubtasks([]);
      setNewSubtaskTitle('');
      setErrorMessage(null);
    }
  }, [editingGoal]);

  const handleAddSubtask = () => {
    const trimmed = newSubtaskTitle.trim();
    if (!trimmed) return;
    const item: SubTask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: trimmed,
      completed: false,
    };
    setSubtasks((prev) => [...prev, item]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSuggestSteps = () => {
    const { suggestedDescription, steps } = generateSuggestedSteps(title, category);
    if (!description.trim()) {
      setDescription(suggestedDescription);
    }
    const existingTitles = new Set(subtasks.map((s) => s.title.toLowerCase()));
    const newItems: SubTask[] = steps
      .filter((s) => !existingTitles.has(s.toLowerCase()))
      .map((stepTitle, idx) => ({
        id: `st-${Date.now()}-${idx}`,
        title: stepTitle,
        completed: false,
      }));

    if (newItems.length > 0) {
      setSubtasks((prev) => [...prev, ...newItems]);
    }
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setErrorMessage('Por favor, informe um título para o seu objetivo de estudo.');
      titleInputRef.current?.focus();
      return;
    }

    if (!trimmedDescription) {
      setErrorMessage('Adicione uma breve descrição sobre o que você pretende estudar.');
      return;
    }

    if (!deadline) {
      setErrorMessage('Escolha uma data de prazo para ajudar no seu planejamento.');
      return;
    }

    // Se o usuário digitou uma sub-tarefa mas não apertou "+", inclui automaticamente
    const finalSubtasks = [...subtasks];
    if (newSubtaskTitle.trim()) {
      finalSubtasks.push({
        id: `st-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      });
    }

    setErrorMessage(null);
    const isEditing = Boolean(editingGoal);

    onSubmit({
      title: trimmedTitle,
      description: trimmedDescription,
      deadline,
      status,
      category,
      priority,
      subtasks: finalSubtasks,
    });

    if (!isEditing) {
      setTitle('');
      setDescription('');
      setDeadline(getOffsetDateString(7));
      setStatus(GoalStatus.NOT_STARTED);
      setSubtasks([]);
      setNewSubtaskTitle('');
    }

    setSuccessFeedback(
      isEditing
        ? 'Objetivo atualizado com sucesso!'
        : 'Objetivo cadastrado com sucesso!'
    );
    setTimeout(() => {
      setSuccessFeedback(null);
    }, 3000);
  };

  const applyQuickDeadline = (days: number) => {
    setDeadline(getOffsetDateString(days));
  };

  return (
    <section
      id="formulario"
      aria-labelledby="form-heading"
      className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 shadow-xs transition-colors ${
        editingGoal
          ? 'border-amber-500/60 dark:border-amber-500/50 ring-2 ring-amber-500/10'
          : 'border-slate-200/90 dark:border-slate-800'
      }`}
    >
      <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <h2 id="form-heading" className="text-lg font-bold text-slate-900 dark:text-white">
            {editingGoal ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
          </h2>
          {editingGoal && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
              Modo de edição
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {editingGoal
            ? 'Altere os campos desejados abaixo e salve para atualizar seu planejamento.'
            : 'Preencha os campos abaixo com o tema que você quer aprender e até quando pretende concluir.'}
        </p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-xs font-medium text-red-800 dark:text-red-300"
        >
          {errorMessage}
        </div>
      )}

      {successFeedback && (
        <div
          role="status"
          className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2"
        >
          <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{successFeedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Campo: Título */}
        <div>
          <label
            htmlFor="goal-title"
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
          >
            Título do objetivo <span className="text-red-600 dark:text-red-400">*</span>
          </label>
          <input
            ref={titleInputRef}
            id="goal-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Ex: Aprender comandos básicos de Git e GitHub"
            maxLength={100}
            className="w-full px-3.5 py-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-600/15 transition-colors"
            required
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Dica: escolha um título curto e específico.
          </p>
        </div>

        {/* Linha dupla: Categoria e Prioridade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="goal-category"
              className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
            >
              Área / Categoria
            </label>
            <select
              id="goal-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as GoalCategory)}
              className="w-full px-3 py-2 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-600/15 transition-colors"
            >
              {(Object.keys(GOAL_CATEGORY_LABELS) as GoalCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {GOAL_CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="goal-priority"
              className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
            >
              Prioridade
            </label>
            <select
              id="goal-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as GoalPriority)}
              className="w-full px-3 py-2 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-600/15 transition-colors"
            >
              {(Object.keys(GOAL_PRIORITY_LABELS) as GoalPriority[]).map((prio) => (
                <option key={prio} value={prio}>
                  {GOAL_PRIORITY_LABELS[prio]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Campo: Descrição + Botão Sugerir roteiro */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <label
              htmlFor="goal-description"
              className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Descrição do que estudar <span className="text-red-600 dark:text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={handleSuggestSteps}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200/70 dark:border-teal-800/60 rounded-md transition-colors cursor-pointer"
              title="Preencher sugestão de descrição e checklist de etapas"
            >
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              <span>Sugerir roteiro</span>
            </button>
          </div>
          <textarea
            id="goal-description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Ex: Assistir 3 aulas introdutórias, criar um repositório de teste e fazer meu primeiro commit."
            rows={3}
            maxLength={400}
            className="w-full px-3.5 py-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-600/15 transition-colors resize-y"
            required
          />
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Anote os passos ou materiais que você vai usar.</span>
            <span className="font-mono tabular-nums">{description.length}/400</span>
          </div>
        </div>

        {/* Campo: Checklist / Sub-tarefas (Opcional) */}
        <div className="p-3.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <label
              htmlFor="new-subtask"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <ListTodo className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span>Checklist de etapas (opcional)</span>
            </label>
            {subtasks.length > 0 && (
              <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                {subtasks.length} {subtasks.length === 1 ? 'etapa' : 'etapas'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="new-subtask"
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              placeholder="Adicionar pequena etapa (ex: Resolver 5 exercícios)"
              maxLength={120}
              className="flex-1 px-3 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-600"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              aria-label="Adicionar etapa ao checklist"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Adicionar</span>
            </button>
          </div>

          {subtasks.length > 0 && (
            <ul className="mt-2.5 space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {subtasks.map((st) => (
                <li
                  key={st.id}
                  className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700/70 text-xs text-slate-700 dark:text-slate-200"
                >
                  <span className="truncate">{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    aria-label={`Remover etapa ${st.title}`}
                    className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-0.5 rounded transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Campo: Prazo */}
        <div>
          <label
            htmlFor="goal-deadline"
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
          >
            Prazo estimado <span className="text-red-600 dark:text-red-400">*</span>
          </label>
          <input
            id="goal-deadline"
            type="date"
            value={deadline}
            onChange={(e) => {
              setDeadline(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums text-slate-900 dark:text-white bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-600/15 transition-colors"
            required
          />
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Sugestões:</span>
            {[
              { label: '+3 dias', days: 3 },
              { label: '+1 semana', days: 7 },
              { label: '+2 semanas', days: 14 },
              { label: '+1 mês', days: 30 },
            ].map((preset) => {
              const presetDate = getOffsetDateString(preset.days);
              const isSelected = deadline === presetDate;
              return (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => applyQuickDeadline(preset.days)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 text-white'
                      : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Campo: Status */}
        <div>
          <label
            htmlFor="goal-status"
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1"
          >
            Status atual <span className="text-red-600 dark:text-red-400">*</span>
          </label>
          <select
            id="goal-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as GoalStatus)}
            className="w-full px-3.5 py-2.5 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-600/15 transition-colors"
          >
            {Object.values(GoalStatus).map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {GOAL_STATUS_LABELS[statusOption]}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {GOAL_STATUS_DESCRIPTIONS[status]}
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <button
            type="submit"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 rounded-xl shadow-xs hover:shadow transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>
              {editingGoal ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </span>
          </button>

          {editingGoal && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Cancelar</span>
            </button>
          )}
        </div>
      </form>
    </section>
  );
};
