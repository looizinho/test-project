import React, { useState } from 'react';

const TodoForm = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText('');
    setExpanded(false);
  };

  return (
    <div className="card todo-form">
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="Adicione uma nova tarefa..."
          rows={expanded ? 3 : 1}
        />
        <div className="todo-form-actions">
          <button type="button" className="btn" onClick={() => { setText(''); setExpanded(false); }}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
            Adicionar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
