import React from 'react';
import { CalendarCheck2, Focus, Puzzle } from 'lucide-react';

export const StudyTipsSection: React.FC = () => {
  const tips = [
    {
      number: '01',
      title: 'Divida em partes pequenas',
      description:
        'Em vez de cadastrar "Aprender Programação", prefira metas específicas como "Praticar estruturas de repetição com 5 exercícios" e use o checklist de etapas.',
      icon: Puzzle,
      accent:
        'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200/70 dark:border-teal-800/60',
    },
    {
      number: '02',
      title: 'Defina prazos realistas',
      description:
        'Escolha datas compatíveis com sua rotina semanal. Um objetivo concluído por semana gera mais constância do que vários acumulados.',
      icon: CalendarCheck2,
      accent:
        'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/70 dark:border-amber-800/60',
    },
    {
      number: '03',
      title: 'Foque em um tema por vez',
      description:
        'Mantenha apenas 1 ou 2 objetivos com o status "Em andamento" simultaneamente para evitar distrações e concluir mais rápido.',
      icon: Focus,
      accent:
        'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/60',
    },
  ];

  return (
    <section
      id="dicas"
      aria-labelledby="tips-heading"
      className="mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800"
    >
      <div className="mb-5">
        <h2
          id="tips-heading"
          className="text-lg font-bold text-slate-900 dark:text-white"
        >
          Guia Rápido para Estudantes Iniciantes
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Três práticas simples para transformar grandes temas em objetivos alcançáveis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.number}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center ${tip.accent}`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                  DICA {tip.number}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {tip.number}. {tip.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {tip.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
