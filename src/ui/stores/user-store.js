import { writable } from 'svelte/store';

const STORAGE_KEY = 'user-store';

const storedValue = localStorage.getItem(STORAGE_KEY);

const defaultValue = { user: null };
const store = writable(storedValue ? JSON.parse(storedValue) : defaultValue);
import appStateStore, { APP_STATES } from '../stores/app-state-store';

import('../../firebase/authentication')
  .then(({ onUserUpdate }) => {
    onUserUpdate(user => {
      if (user) {
        const value = {
          user: {
            id: user.uid,
            name: user.displayName,
            email: user.email
          }
        };
        // TODO: change the set to an update that also has access to previous user
        // and that calls the habitTrackerStore.load(user) method when the user is first loaded
        userStore.set(value);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      }
    });
  })
  .catch(() => {
    appStateStore.set(APP_STATES.ERROR);
  });

const userStore = {
  subscribe: store.subscribe,
  set: store.set,
  clear: () => {
    store.set(defaultValue);
    localStorage.removeItem(STORAGE_KEY);
  }
};

export default userStore;
