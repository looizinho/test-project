# Aplicativo

Aplicastivo é um app de lista de tarefas (To-Do List) feito com React + Vite, com foco em simplicidade, uso offline e persistência local.

## Funcionalidades
- Criar, editar, concluir e remover tarefas
- Filtrar tarefas por status: todas, pendentes e concluídas
- Persistência local em arquivo JSON (`data/tasks.json`) via API local (`/api/tasks`)
- Exportação de tarefas em JSON e Markdown
- Suporte a PWA (manifest + service worker)
- Interface responsiva com tema claro/escuro

## Tecnologias
- React 18
- Vite 5
- JavaScript (ESM)
- API local no Vite (middleware Node)
- Service Worker

## Como executar
1. Instale as dependências:

```bash
pnpm install
```

2. Rode o projeto em desenvolvimento:

```bash
pnpm run dev
```

3. Gere build de produção:

```bash
pnpm run build
```

4. Visualize a build localmente:

```bash
pnpm run preview
```

## Estrutura principal
- `src/components/` componentes da interface (formulário, lista e app principal)
- `src/utils/jsonStorage.js` consumo da API local de persistência
- `data/tasks.json` base local de tarefas
- `public/manifest.json` configuração PWA
- `public/sw.js` service worker

## Objetivo
Oferecer uma base prática para organização de tarefas com experiência de app instalável e funcionamento local.
