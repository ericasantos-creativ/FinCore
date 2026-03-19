const DB_NAME = 'fincore_db';
const DB_VERSION = 1;
let dbInstance = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('users')) {
        const store = db.createObjectStore('users', { keyPath: 'id' });
        store.createIndex('email', 'email', { unique: true });
      }

      if (!db.objectStoreNames.contains('companies')) {
        const store = db.createObjectStore('companies', { keyPath: 'id' });
        store.createIndex('user_id', 'user_id');
      }

      if (!db.objectStoreNames.contains('accounts')) {
        const store = db.createObjectStore('accounts', { keyPath: 'id' });
        store.createIndex('user_id', 'user_id');
        store.createIndex('empresa_id', 'empresa_id');
      }

      if (!db.objectStoreNames.contains('categories')) {
        const store = db.createObjectStore('categories', { keyPath: 'id' });
        store.createIndex('user_id', 'user_id');
      }

      if (!db.objectStoreNames.contains('transactions')) {
        const store = db.createObjectStore('transactions', { keyPath: 'id' });
        store.createIndex('user_id', 'user_id');
        store.createIndex('conta_id', 'conta_id');
        store.createIndex('empresa_id', 'empresa_id');
        store.createIndex('categoria_id', 'categoria_id');
      }

      if (!db.objectStoreNames.contains('goals')) {
        const store = db.createObjectStore('goals', { keyPath: 'id' });
        store.createIndex('user_id', 'user_id');
      }

      if (!db.objectStoreNames.contains('investments')) {
        const store = db.createObjectStore('investments', { keyPath: 'id' });
        store.createIndex('user_id', 'user_id');
      }

      if (!db.objectStoreNames.contains('suppliers')) {
        const store = db.createObjectStore('suppliers', { keyPath: 'id' });
        store.createIndex('user_id', 'user_id');
        store.createIndex('empresa_id', 'empresa_id');
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

function withStore(storeName, mode, callback) {
  return openDB().then((db) =>
    new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const result = callback(store);

      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    })
  );
}

export const DB = {
  init() {
    return openDB();
  },

  get(store, id) {
    return withStore(store, 'readonly', (s) => s.get(id));
  },

  getAll(store, filters) {
    return withStore(store, 'readonly', (s) => {
      const request = s.getAll();
      request.onsuccess = () => {};
      return new Promise((resolve) => {
        request.onsuccess = () => {
          let result = request.result || [];
          if (filters && Object.keys(filters).length) {
            result = result.filter((item) => {
              return Object.entries(filters).every(([key, value]) => item[key] === value);
            });
          }
          resolve(result);
        };
      });
    });
  },

  add(store, record) {
    return withStore(store, 'readwrite', (s) => {
      const request = s.add(record);
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(record);
        request.onerror = () => reject(request.error);
      });
    });
  },

  update(store, id, patch) {
    return withStore(store, 'readwrite', (s) => {
      const getRequest = s.get(id);
      return new Promise((resolve, reject) => {
        getRequest.onsuccess = () => {
          const existing = getRequest.result;
          if (!existing) return resolve(null);
          const updated = { ...existing, ...patch, atualizado_em: new Date().toISOString() };
          const putRequest = s.put(updated);
          putRequest.onsuccess = () => resolve(updated);
          putRequest.onerror = () => reject(putRequest.error);
        };
        getRequest.onerror = () => reject(getRequest.error);
      });
    });
  },

  delete(store, id) {
    return withStore(store, 'readwrite', (s) => s.delete(id));
  },

  clear(store) {
    return withStore(store, 'readwrite', (s) => s.clear());
  },

  count(store) {
    return withStore(store, 'readonly', (s) => {
      const request = s.count();
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });
  },

  exportAll() {
    return openDB().then((db) => {
      const exports = {};
      const stores = Array.from(db.objectStoreNames);
      const promises = stores.map((storeName) =>
        DB.getAll(storeName).then((items) => {
          exports[storeName] = items;
        })
      );
      return Promise.all(promises).then(() => exports);
    });
  },

  importAll(json) {
    if (!json || typeof json !== 'object') return Promise.reject(new Error('Invalid import data'));
    return openDB().then((db) => {
      const stores = Array.from(db.objectStoreNames);
      const promises = stores.map((storeName) => {
        const items = Array.isArray(json[storeName]) ? json[storeName] : [];
        return withStore(storeName, 'readwrite', (s) => {
          items.forEach((item) => s.put(item));
        });
      });
      return Promise.all(promises);
    });
  }
};
