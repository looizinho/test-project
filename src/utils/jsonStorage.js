const TASKS_API_URL = '/api/tasks';

export const loadTasks = async () => {
  try {
    const response = await fetch(TASKS_API_URL, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Falha ao carregar tarefas (${response.status})`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Erro ao carregar tarefas:', err);
    return [];
  }
};

export const saveTasks = async (tasks) => {
  try {
    const response = await fetch(TASKS_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Array.isArray(tasks) ? tasks : [])
    });

    if (!response.ok) {
      throw new Error(`Falha ao salvar tarefas (${response.status})`);
    }
  } catch (err) {
    console.error('Erro ao salvar tarefas:', err);
    throw err;
  }
};

export const deleteTasks = async () => {
  try {
    const response = await fetch(TASKS_API_URL, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`Falha ao apagar tarefas (${response.status})`);
    }
  } catch (err) {
    console.error('Erro ao deletar tarefas:', err);
    throw err;
  }
};
