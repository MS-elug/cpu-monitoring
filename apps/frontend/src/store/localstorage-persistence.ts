import { Store } from '@reduxjs/toolkit';
import { configSlice } from './config/config-slice';

export const setupLocalStoragePeristence = (store: Store) => {
  // Subscribe to store update to backup the config state
  store.subscribe(() => {
    const state = store.getState();
    // Backup conf slice
    localStorage.setItem('config', JSON.stringify(state.config));
  });

  // Restore the config state
  try {
    const configState = localStorage.getItem('config');
    if (configState) {
      store.dispatch(configSlice.actions.hydrate(JSON.parse(configState)));
    }
  } catch (err) {
    console.error(err);
    // In case of error, remove the store data to avoid the error again in the future
    localStorage.removeItem('config');
  }
};
