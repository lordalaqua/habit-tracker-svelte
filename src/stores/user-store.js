import { writable } from 'svelte/store';
import { setUserUpdateCallback } from '../core/firebase';

export const userStore = writable(null);

setUserUpdateCallback(user => {
  if (user) {
    userStore.set({ name: user.displayName, email: user.email });
  }
});