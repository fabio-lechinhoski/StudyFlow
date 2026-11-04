import { GoalStatus } from '../types/studyGoal';

export interface DeadlineInfo {
  formattedDate: string;
  relativeLabel: string;
  urgency: 'overdue' | 'soon' | 'normal' | 'completed';
}

/**
 * Formata uma string YYYY-MM-DD para o formato brasileiro DD/MM/AAAA
 * e calcula a proximidade do prazo sem sofrer com fuso horário.
 */
export function getDeadlineInfo(deadlineStr: string, status: GoalStatus): DeadlineInfo {
  if (!deadlineStr) {
    return {
      formattedDate: 'Sem prazo definido',
      relativeLabel: '',
      urgency: status === GoalStatus.COMPLETED ? 'completed' : 'normal',
    };
  }

  const parts = deadlineStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return {
      formattedDate: deadlineStr,
      relativeLabel: '',
      urgency: 'normal',
    };
  }

  const [year, month, day] = parts;
  const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;

  if (status === GoalStatus.COMPLETED) {
    return {
      formattedDate,
      relativeLabel: 'Objetivo concluído',
      urgency: 'completed',
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      formattedDate,
      relativeLabel: overdueDays === 1 ? 'Prazo vencido ontem' : `Atrasado há ${overdueDays} dias`,
      urgency: 'overdue',
    };
  }

  if (diffDays === 0) {
    return {
      formattedDate,
      relativeLabel: 'Vence hoje',
      urgency: 'soon',
    };
  }

  if (diffDays === 1) {
    return {
      formattedDate,
      relativeLabel: 'Vence amanhã',
      urgency: 'soon',
    };
  }

  if (diffDays <= 3) {
    return {
      formattedDate,
      relativeLabel: `Faltam ${diffDays} dias`,
      urgency: 'soon',
    };
  }

  return {
    formattedDate,
    relativeLabel: `Faltam ${diffDays} dias`,
    urgency: 'normal',
  };
}

/**
 * Retorna a data de hoje no formato YYYY-MM-DD para uso em inputs de data.
 */
export function getTodayInputString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
