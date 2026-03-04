import React, { useState, useEffect, useCallback } from 'react';
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { loadTasks, saveTasks, deleteTasks } from '../utils/jsonStorage.js';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [notification, setNotification] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const loadFromStorage = useCallback(() => {
    try {
      const stored = loadTasks();
      if (stored && Array.isArray(stored)) {
        setTasks(stored);
      }
    } catch (err) {
      console.warn('Erro ao carregar tarefas:', err);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('[SW] Registrado'))
        .catch(err => console.warn('[SW] Falha:', err));
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setShowInstall(true);
    });

    const closeExportMenu = () => setShowExportMenu(false);
    window.addEventListener('click', closeExportMenu);

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
      window.removeEventListener('click', closeExportMenu);
    };
  }, [loadFromStorage]);

  const showNotification = useCallback((message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const addTask = useCallback((text) => {
    const newTask = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    showNotification('Tarefa adicionada!');
  }, [tasks, showNotification]);

  const toggleTask = useCallback((id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }, [tasks]);

  const editTask = useCallback((id, newText) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, text: newText.trim() } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    showNotification('Tarefa atualizada!');
  }, [tasks, showNotification]);

  const deleteTask = useCallback((id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    showNotification('Tarefa removida!');
  }, [tasks, showNotification]);

  const clearAll = useCallback(() => {
    if (window.confirm('Tem certeza que deseja apagar todas as tarefas?')) {
      setTasks([]);
      deleteTasks();
      showNotification('Todas as tarefas foram removidas.');
    }
  }, [showNotification]);

  const exportJSON = useCallback(() => {
    try {
      const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('Backup JSON exportado!');
    } catch (err) {
      showNotification('Erro ao exportar.');
    }
  }, [tasks, showNotification]);

  const exportMarkdown = useCallback(() => {
    try {
      const mdTasks = tasks.map(t => `-${t.completed ? '[x]' : '[ ]'} ${t.text}`).join('\n');
      const activeCount = tasks.filter(t => !t.completed).length;
      const completedCount = tasks.filter(t => t.completed).length;
      const mdContent = `# To-Do List\n\n**Total:** ${tasks.length} | **Pendentes:** ${activeCount} | **Concluídas:** ${completedCount}\n\n${mdTasks}`;
      const blob = new Blob([mdContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tasks-${new Date().toISOString().split('T')[0]}.md`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('Backup Markdown exportado!');
    } catch (err) {
      showNotification('Erro ao exportar.');
    }
  }, [tasks, showNotification]);

  const toggleExportMenu = (e) => {
    e.stopPropagation();
    setShowExportMenu(prev => !prev);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">To-Do List</h1>
        <div className="app-actions">
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-icon"
              onClick={toggleExportMenu}
              title="Exportar (JSON ou MD)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </button>
            {showExportMenu && (
              <div className="card" style={{ position: 'absolute', right: 0, top: '100%', marginTop: '8px', minWidth: '140px', padding: '8px', zIndex: 100 }}>
                <button className="btn btn-primary" style={{ width: '100%', marginBottom: '8px' }} onClick={() => { exportJSON(); setShowExportMenu(false); }}>JSON</button>
                <button className="btn" style={{ width: '100%' }} onClick={() => { exportMarkdown(); setShowExportMenu(false); }}>Markdown</button>
              </div>
            )}
          </div>
          {showInstall && (
            <button
              className="btn btn-icon"
              onClick={() => showNotification('Instale o app para usar offline!')}
              title="Instalar PWA"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </button>
          )}
          {tasks.length > 0 && (
            <button
              className="btn btn-icon"
              onClick={clearAll}
              title="Apagar todas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <TodoForm onAdd={addTask} />

      <div className="card">
        <div className="todo-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas ({tasks.length})
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Pendentes ({activeCount})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Concluídas ({completedCount})
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p>Nenhuma tarefa {filter === 'active' ? 'pendente' : filter === 'completed' ? 'concluída' : ''} por aqui.</p>
          </div>
        ) : (
          <TodoList
            tasks={filteredTasks}
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={deleteTask}
          />
        )}
      </div>

      {notification && <div className="toast">{notification}</div>}

      <footer className="app-footer">
        <p>Persistência JSON/MD • PWA Habilitado</p>
      </footer>
    </div>
  );
};

export default TodoApp;
