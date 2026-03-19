const initialState = {
  user: null,
  activeCompany: null,
  activeScreen: 'dashboard',
  theme: 'dark',
  slogan: '',
  transactions: [],
  accounts: [],
  categories: [],
  goals: [],
  investments: [],
  suppliers: [],
  companies: [],
  filters: {},
  isLoading: false,
  notifications: []
};

const subscribers = new Set();
let state = { ...initialState };

export const Store = {
  getState() {
    return { ...state };
  },

  setState(patch) {
    if (!patch || typeof patch !== 'object') return;
    state = { ...state, ...patch };
    subscribers.forEach((fn) => {
      try {
        fn(state);
      } catch (error) {
        console.error('Store subscriber error:', error);
      }
    });
  },

  subscribe(fn) {
    if (typeof fn === 'function') {
      subscribers.add(fn);
    }
  },

  unsubscribe(fn) {
    subscribers.delete(fn);
  },

  reset() {
    state = { ...initialState };
    subscribers.forEach((fn) => {
      try {
        fn(state);
      } catch (error) {
        console.error('Store subscriber error:', error);
      }
    });
  }
};
