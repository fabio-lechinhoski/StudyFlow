import React from 'react';
import { GraduationCap, Moon, Plus, Sun } from 'lucide-react';

interface HeaderProps {
  onFocusForm: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onFocusForm,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Identity */}
        <a
          href="#topo"
          className="inline-flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 rounded-lg"
        >
          <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              StudyFlow
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wide mt-0.5 hidden sm:inline">
              Planejador de Estudos
            </span>
          </div>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <a
            href="#resumo"
            className="px-3 py-1.5 rounded-lg hover:text-teal-700 dark:hover:text-teal-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition-colors whitespace-nowrap"
          >
            Resumo
          </a>
          <a
            href="#formulario"
            onClick={(e) => {
              e.preventDefault();
              onFocusForm();
            }}
            className="px-3 py-1.5 rounded-lg hover:text-teal-700 dark:hover:text-teal-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition-colors whitespace-nowrap"
          >
            Cadastrar
          </a>
          <a
            href="#objetivos"
            className="px-3 py-1.5 rounded-lg hover:text-teal-700 dark:hover:text-teal-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition-colors whitespace-nowrap"
          >
            Meus Objetivos
          </a>
          <a
            href="#dicas"
            className="px-3 py-1.5 rounded-lg hover:text-teal-700 dark:hover:text-teal-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition-colors whitespace-nowrap"
          >
            Guia Rápido
          </a>
        </nav>

        {/* Zone 3: Theme Toggle & Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === 'dark'
                ? 'Ativar modo claro'
                : 'Ativar modo escuro'
            }
            title={
              theme === 'dark'
                ? 'Mudar para modo claro'
                : 'Mudar para modo escuro'
            }
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onFocusForm}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 rounded-lg shadow-xs hover:shadow transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
