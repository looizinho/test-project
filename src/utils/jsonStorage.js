// jsonStorage.js — Persistência em arquivos JSON (usando IndexedDB para armazenamento local)
const DB_NAME = 'TodoDB';
const STORE_NAME = 'tasks';
const VERSION = 1;

let db = null;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const getDB = async () => {
  if (!db) {
    await openDB();
  }
  return db;
};

// Salvar tarefas no IndexedDB
export const saveTasks = async (tasks) => {
  try {
    const database = await getDB();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.clear();
    
    tasks.forEach(task => store.put({ id: 'tasks', data: task }));
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.error('Erro ao salvar:', err);
  }
};

// Carregar tarefas do IndexedDB
export const loadTasks = async () => {
  try {
    const database = await getDB();
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.get('tasks');
      request.onsuccess = () => resolve(request.result ? request.result.data : []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Erro ao carregar:', err);
    return [];
  }
};

// Deletar todas as tarefas
export const deleteTasks = async () => {
  try {
    const database = await getDB();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      store.clear();
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.error('Erro ao deletar:', err);
  }
};

// Exportar para JSON (usando IndexedDB como fonte)
export const exportTasksJSON = async () => {
  const tasks = await loadTasks();
  const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
