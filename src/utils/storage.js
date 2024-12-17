
const PREFIX = 'expense_tracker_';

export const storage = {
  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, value);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  get(key) {
    try {
      return localStorage.getItem(PREFIX + key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  remove(key) {
    localStorage.removeItem(PREFIX + key);
  }
};
