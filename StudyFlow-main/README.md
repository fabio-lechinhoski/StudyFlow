# StudyFlow — Planejador de Estudos Pessoal

Aplicação web interativa, responsiva e *offline-first* desenvolvida para ajudar estudantes a planejar, organizar e acompanhar seus objetivos de estudo com clareza e constância.

---

## ✨ Principais Funcionalidades

- **Dashboard de Progresso com Indicador Circular:** Visualização imediata do percentual de conclusão geral e contadores interativos que filtram a lista com um clique.
- **Gestão Completa de Objetivos (CRUD):**
  - Classificação por **Área/Categoria** (*Programação & Tech*, *Ciências & Exatas*, *Humanas & Leitura*, *Idiomas*, *Design*, *Carreira*) e **Prioridade** (*Baixa*, *Média*, *Alta*).
  - **Gerador de Roteiro e Etapas:** Botão *"Sugerir roteiro"* que cria automaticamente uma descrição base e um checklist de sub-tarefas adaptéveis ao tema.
  - **Checklists Interativos nos Cards:** Divida objetivos grandes em pequenas etapas marcáveis diretamente no cartão, com barra de progresso individual.
  - **Atalhos Inteligentes de Prazo:** Botões rápidos (`+3 dias`, `+1 semana`, `+2 semanas`, `+1 mês`) e cálculo automático de urgência sem problemas de fuso horário.
- **Visão em Lista & Quadro Kanban:** Alterne instantaneamente entre a lista detalhada e a visão em colunas Kanban (*Não iniciado*, *Em andamento*, *Concluído*).
- **Busca, Filtros e Ordenação Combinados:** Filtre por status, categoria ou termo de busca (incluindo texto das sub-tarefas) e ordene por prazo, prioridade, data de criação ou ordem alfabética.
- **Modo Escuro (Dark Mode):** Alternância entre tema claro e escuro com persistência automática e suporte à preferência do sistema operacional.
- **Notificações com "Desfazer" (Undo):** Feedback visual flutuante com possibilidade de desfazer exclusões ou mudanças rápidas de status.
- **Backup Portátil (Exportar / Importar JSON):** Exporte seus objetivos para um arquivo `.json` ou restaure backups a qualquer momento.

---

## 🛠️ Tecnologias Utilizadas

- **[React 19](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)** (Estilização utilitária, temas e Dark Mode)
- **[Motion](https://motion.dev/)** (Animações fluidas de layout, cards, modais e notificações)
- **[Lucide React](https://lucide.dev/)** (Ícones consistentes e acessíveis)
- **[Vite](https://vite.dev/)** (Build tool e servidor de desenvolvimento)

---

## 🚀 Como Executar Localmente

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` no navegador.

3. **Verifique a tipagem e gere a build de produção:**
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
