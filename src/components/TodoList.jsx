import React, { useState } from 'react';

const TodoList = ({ tasks, onToggle, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleEditStart = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const handleEditSave = (id) => {
    if (!editText.trim()) return;
    onEdit(id, editText);
    setEditingId(null);
    setEditText('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <ul className="todo-list">
      {tasks.map((task) => (
        <li key={task.id} className={`todo-item ${task.completed ? 'completed' : ''}`}>
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />
          <div className="todo-content">
            {editingId === task.id ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSave(task.id);
                    if (e.key === 'Escape') handleEditCancel();
                  }}
                  autoFocus
                  style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button
                  className="btn btn-primary"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={() => handleEditSave(task.id)}
                >
                  Salvar
                </button>
                <button
                  className="btn"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={handleEditCancel}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="todo-text" onDoubleClick={() => handleEditStart(task)}>
                {task.text}
              </div>
            )}
            <small style={{ color: '#999', fontSize: '12px' }}>
              Criado em: {new Date(task.createdAt).toLocaleString('pt-BR')}
            </small>
          </div>
          {editingId !== task.id && (
            <div className="todo-actions">
              <button
                className="btn btn-icon"
                onClick={() => handleEditStart(task)}
                title="Editar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </button>
              <button
                className="btn btn-icon"
                onClick={() => onDelete(task.id)}
                title="Excluir"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
