# To-Do List — projeto test-project

## ✅ Planejado
- React + Vite
- Material Design 3 (usando `@mdyoung/mdc-react` ou `@react-md/theme`)
- Persistência em arquivos JSON (API local via `fetch`/`blob` + `download`)
- PWA (manifest + service worker)
- Suporte a temas claro/escuro
- Filter (all/active/completed)
- Add/Edit/Delete tasks

## 🛠️ Passo 1: Inicializar projeto Vite + React

**Estado atual:**
- ✅ Estrutura de arquivos criada
- ✅ `package.json` configurado
- ✅ `vite.config.js` pronto
- ✅ `index.html` com metadados e referência ao script
- ✅ `public/manifest.json` com configuração PWA
- ✅ `public/sw.js` com service worker básico
- ✅ `src/main.jsx` → entry point React
- ✅ `src/styles/main.css` → estilos Material Design 3
- ✅ `src/components/TodoApp.jsx` → componente principal
- ✅ `src/components/TodoForm.jsx` → formulário de nova tarefa
- ✅ `src/components/TodoList.jsx` → lista com edit/delete/toggle
- ✅ `src/utils/jsonStorage.js` → persistência via IndexedDB + export JSON

## 📝 Próximo Passo: Instalar dependências e rodar

```bash
cd /home/paf/.openclaw/workspace/development/test-project
pnpm install
pnpm run dev
```

## 🔮 Próximos passos
- [ ] Testar o dev server (Vite)
- [ ] Verificar PWA (manifest + service worker)
- [ ] Testar persistência (IndexedDB + export JSON)
- [ ] Ajustar componentes se necessário
- [ ] Otimizar tamanho dos ícones e assets (falta criar os PNGs)

---

Você quer que eu rode `pnpm install` agora e comece a testar?