export enum GoalStatus {
  NOT_STARTED = 'nao_iniciado',
  IN_PROGRESS = 'em_andamento',
  COMPLETED = 'concluido',
}

export type GoalCategory =
  | 'programacao'
  | 'exatas'
  | 'humanas'
  | 'idiomas'
  | 'design'
  | 'carreira'
  | 'outros';

export type GoalPriority = 'baixa' | 'media' | 'alta';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  status: GoalStatus;
  category: GoalCategory;
  priority: GoalPriority;
  subtasks: SubTask[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyGoalFormData {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
  category?: GoalCategory;
  priority?: GoalPriority;
  subtasks?: SubTask[];
}

export type StatusFilter = 'todos' | GoalStatus;

export type CategoryFilter = 'todas' | GoalCategory;

export type SortOption =
  | 'deadline_asc'
  | 'priority_desc'
  | 'created_desc'
  | 'title_asc';

export type ViewMode = 'list' | 'kanban';

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  [GoalStatus.NOT_STARTED]: 'Não iniciado',
  [GoalStatus.IN_PROGRESS]: 'Em andamento',
  [GoalStatus.COMPLETED]: 'Concluído',
};

export const GOAL_STATUS_DESCRIPTIONS: Record<GoalStatus, string> = {
  [GoalStatus.NOT_STARTED]: 'Objetivos planejados que você ainda vai começar',
  [GoalStatus.IN_PROGRESS]: 'Conteúdos que você está estudando no momento',
  [GoalStatus.COMPLETED]: 'Assuntos que você já finalizou e praticou',
};

export const GOAL_CATEGORY_LABELS: Record<GoalCategory, string> = {
  programacao: 'Programação & Tech',
  exatas: 'Ciências & Exatas',
  humanas: 'Humanas & Leitura',
  idiomas: 'Idiomas',
  design: 'Design & Criatividade',
  carreira: 'Carreira & Projetos',
  outros: 'Geral',
};

export const GOAL_PRIORITY_LABELS: Record<GoalPriority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};
