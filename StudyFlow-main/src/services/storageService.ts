import {
  GoalCategory,
  GoalPriority,
  GoalStatus,
  StudyGoal,
  StudyGoalFormData,
  SubTask,
} from '../types/studyGoal';

const STORAGE_KEY = 'studyflow_goals_v1';
const THEME_STORAGE_KEY = 'studyflow_theme_v1';

const VALID_CATEGORIES: GoalCategory[] = [
  'programacao',
  'exatas',
  'humanas',
  'idiomas',
  'design',
  'carreira',
  'outros',
];

const VALID_PRIORITIES: GoalPriority[] = ['baixa', 'media', 'alta'];

function getFutureDateString(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gera objetivos de exemplo com datas sempre atualizadas no momento do clique.
 */
export function buildSampleStudyGoals(): StudyGoal[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'sample-1',
      title: 'Fundamentos de Lógica de Programação',
      description:
        'Compreender variáveis, estruturas condicionais (if/else) e laços de repetição resolvendo exercícios práticos.',
      deadline: getFutureDateString(5),
      status: GoalStatus.IN_PROGRESS,
      category: 'programacao',
      priority: 'alta',
      subtasks: [
        { id: 'st-1', title: 'Estudar variáveis e tipos de dados', completed: true },
        { id: 'st-2', title: 'Praticar condicionais (if / else / switch)', completed: true },
        { id: 'st-3', title: 'Resolver 5 exercícios de laços (for / while)', completed: false },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-2',
      title: 'Estrutura Semântica e Acessibilidade com HTML5',
      description:
        'Aprender a utilizar tags semânticas como header, nav, main, section, article e footer construindo uma página de portfólio.',
      deadline: getFutureDateString(12),
      status: GoalStatus.NOT_STARTED,
      category: 'design',
      priority: 'media',
      subtasks: [
        { id: 'st-4', title: 'Revisar tags semânticas essenciais do HTML5', completed: false },
        { id: 'st-5', title: 'Estruturar página pessoal com boas práticas de ARIA', completed: false },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-3',
      title: 'Organização da Rotina de Estudos (Técnica Pomodoro)',
      description:
        'Definir horários fixos na semana e aplicar blocos de 25 minutos de foco profundo com 5 minutos de pausa.',
      deadline: getFutureDateString(-2),
      status: GoalStatus.COMPLETED,
      category: 'carreira',
      priority: 'baixa',
      subtasks: [
        { id: 'st-6', title: 'Definir 3 horários fixos na agenda semanal', completed: true },
        { id: 'st-7', title: 'Completar 4 ciclos Pomodoro sem distrações', completed: true },
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export const SAMPLE_STUDY_GOALS: StudyGoal[] = buildSampleStudyGoals();

function normalizeSubtasks(raw: unknown): SubTask[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .filter((item) => typeof item.title === 'string' && item.title.trim().length > 0)
    .map((item, idx) => ({
      id: typeof item.id === 'string' && item.id ? item.id : `sub-${Date.now()}-${idx}`,
      title: String(item.title).trim(),
      completed: Boolean(item.completed),
    }));
}

function normalizeGoal(item: unknown): StudyGoal | null {
  if (!item || typeof item !== 'object') return null;
  const candidate = item as Record<string, unknown>;

  const hasRequiredStrings =
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.deadline === 'string';

  const hasValidStatus =
    candidate.status === GoalStatus.NOT_STARTED ||
    candidate.status === GoalStatus.IN_PROGRESS ||
    candidate.status === GoalStatus.COMPLETED;

  if (!hasRequiredStrings || !hasValidStatus) return null;

  const category: GoalCategory = VALID_CATEGORIES.includes(candidate.category as GoalCategory)
    ? (candidate.category as GoalCategory)
    : 'outros';

  const priority: GoalPriority = VALID_PRIORITIES.includes(candidate.priority as GoalPriority)
    ? (candidate.priority as GoalPriority)
    : 'media';

  const now = new Date().toISOString();

  return {
    id: candidate.id as string,
    title: (candidate.title as string).trim(),
    description: (candidate.description as string).trim(),
    deadline: candidate.deadline as string,
    status: candidate.status as GoalStatus,
    category,
    priority,
    subtasks: normalizeSubtasks(candidate.subtasks),
    createdAt: typeof candidate.createdAt === 'string' ? candidate.createdAt : now,
    updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : now,
  };
}

export const storageService = {
  /**
   * Busca todos os objetivos salvos no localStorage com normalização retrocompatível.
   */
  getGoals(): StudyGoal[] {
    try {
      const rawData = window.localStorage.getItem(STORAGE_KEY);
      if (!rawData) return [];

      const parsed = JSON.parse(rawData);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .map(normalizeGoal)
        .filter((goal): goal is StudyGoal => goal !== null);
    } catch (error) {
      console.error('Erro ao carregar objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage.
   */
  saveGoals(goals: StudyGoal[]): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria e persiste um novo objetivo de estudo.
   */
  createGoal(formData: StudyGoalFormData): StudyGoal[] {
    const currentGoals = this.getGoals();
    const now = new Date().toISOString();

    const newGoal: StudyGoal = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `goal-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      category: formData.category ?? 'outros',
      priority: formData.priority ?? 'media',
      subtasks: formData.subtasks ? normalizeSubtasks(formData.subtasks) : [],
      createdAt: now,
      updatedAt: now,
    };

    const updatedGoals = [newGoal, ...currentGoals];
    this.saveGoals(updatedGoals);
    return updatedGoals;
  },

  /**
   * Atualiza um objetivo existente pelo ID e persiste no localStorage.
   */
  updateGoal(id: string, formData: StudyGoalFormData): StudyGoal[] {
    const currentGoals = this.getGoals();
    const now = new Date().toISOString();

    const updatedGoals = currentGoals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            title: formData.title.trim(),
            description: formData.description.trim(),
            deadline: formData.deadline,
            status: formData.status,
            category: formData.category ?? goal.category,
            priority: formData.priority ?? goal.priority,
            subtasks:
              formData.subtasks !== undefined
                ? normalizeSubtasks(formData.subtasks)
                : goal.subtasks,
            updatedAt: now,
          }
        : goal
    );

    this.saveGoals(updatedGoals);
    return updatedGoals;
  },

  /**
   * Alterna o estado de conclusão de uma sub-tarefa diretamente no card.
   */
  toggleSubtask(goalId: string, subtaskId: string): StudyGoal[] {
    const currentGoals = this.getGoals();
    const now = new Date().toISOString();

    const updatedGoals = currentGoals.map((goal) => {
      if (goal.id !== goalId) return goal;
      const updatedSubtasks = goal.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      return {
        ...goal,
        subtasks: updatedSubtasks,
        updatedAt: now,
      };
    });

    this.saveGoals(updatedGoals);
    return updatedGoals;
  },

  /**
   * Exclui um objetivo pelo ID e persiste no localStorage.
   */
  deleteGoal(id: string): StudyGoal[] {
    const currentGoals = this.getGoals();
    const updatedGoals = currentGoals.filter((goal) => goal.id !== id);
    this.saveGoals(updatedGoals);
    return updatedGoals;
  },

  /**
   * Carrega objetivos de exemplo com datas dinâmicas caso o estudante queira começar com uma base.
   */
  loadSampleGoals(): StudyGoal[] {
    const freshSamples = buildSampleStudyGoals();
    this.saveGoals(freshSamples);
    return freshSamples;
  },

  /**
   * Valida e importa objetivos a partir de uma string JSON de backup.
   */
  importGoalsFromJson(rawJson: string): StudyGoal[] | null {
    try {
      const parsed = JSON.parse(rawJson);
      const list = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === 'object' && Array.isArray((parsed as Record<string, unknown>).goals)
        ? ((parsed as Record<string, unknown>).goals as unknown[])
        : null;

      if (!list) return null;

      const validGoals = list
        .map(normalizeGoal)
        .filter((goal): goal is StudyGoal => goal !== null);

      if (validGoals.length === 0 && list.length > 0) {
        return null;
      }

      this.saveGoals(validGoals);
      return validGoals;
    } catch {
      return null;
    }
  },

  /**
   * Preferência de tema claro/escuro.
   */
  getTheme(): 'light' | 'dark' {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    } catch {
      return 'light';
    }
  },

  saveTheme(theme: 'light' | 'dark'): void {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore storage errors
    }
  },
};
