# StudyFlow — Planejador de Estudos Pessoal

> Aplicação web *offline-first* para gerenciamento de metas de estudo, controle de prazos e acompanhamento de progresso em lista ou quadro Kanban.

## 🚀 Sobre o Projeto

O **StudyFlow** centraliza o planejamento de rotinas de estudo com persistência local de dados (`localStorage`) e suporte a PWA. A aplicação permite decompor objetivos em checklists de sub-tarefas, alternar a visualização entre lista detalhada e colunas Kanban, filtrar demandas por prioridade e exportar ou restaurar backups completos em formato JSON.

## 🛠️ Tecnologias e Stack

- **Core:** React 19, TypeScript, Vite
- **Estilização & UI:** Tailwind CSS v4 (Dark/Light Mode), Motion (animações de layout e modais), Lucide React (ícones)
- **Dados & Persistência:** LocalStorage, importação/exportação JSON e suporte a PWA

## ✨ Funcionalidades

1. **Dashboard de Progresso:** Indicador circular de conclusão geral e contadores interativos para filtragem rápida por status.
2. **Gestão de Objetivos e Sub-tarefas (CRUD):** Criação de metas classificadas por categoria e prioridade, com gerador automático de roteiro base e checklists individuais por cartão.
3. **Controle de Prazos e Urgência:** Atalhos rápidos de agendamento e cálculo de vencimento ajustado para evitar desvios de fuso horário (timezone).
4. **Visão em Lista & Quadro Kanban:** Alternância imediata entre visualização em lista detalhada e colunas de fluxo (*Não iniciado*, *Em andamento* e *Concluído*).
5. **Busca, Filtros e Ordenação:** Filtragem combinada por status, categoria ou termo de busca (incluindo sub-tarefas) e ordenação por prazo, prioridade, data ou ordem alfabética.
6. **Histórico de Ações (Undo) e Backup JSON:** Notificações flutuantes com opção de desfazer exclusões ou alterações de status, além de exportação e restauração de dados em arquivo `.json`.

## ⚙️ Como Executar o Projeto Localmente

**Pré-requisitos:** Node.js instalado.

1. Clone o repositório:
```bash
git clone [https://github.com/fabio-lechinhoski/StudyFlow.git](https://github.com/fabio-lechinhoski/StudyFlow.git)
```

2. Acesse a pasta do projeto e instale as dependências:
```bash
cd StudyFlow
npm install
```

3. Inicie o servidor de desenvolvimento (disponível em `http://localhost:3000`):
```bash
npm run dev
```

4. Para verificar a tipagem e gerar a build de produção:
```bash
npm run lint
npm run build
```

---

## 📂 Estrutura do Projeto

```text
├── public/
│   ├── favicon.svg              # Ícone vetorial da aplicação
│   ├── manifest.webmanifest     # Manifesto PWA
│   └── og-preview.svg           # Imagem de preview para redes sociais (OpenGraph)
├── src/
│   ├── components/
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── EmptyState.tsx
│   │   ├── GoalCard.tsx
│   │   ├── GoalForm.tsx
│   │   ├── GoalList.tsx
│   │   ├── GoalSummary.tsx
│   │   ├── Header.tsx
│   │   ├── StudyTipsSection.tsx
│   │   └── ToastContainer.tsx
│   ├── services/
│   │   └── storageService.ts    # Persistência localStorage, normalização e backup JSON
│   ├── types/
│   │   └── studyGoal.ts         # Tipagens, enums e constantes de domínio
│   ├── utils/
│   │   └── dateUtils.ts         # Cálculo de prazos e urgência sem desvios de timezone
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
