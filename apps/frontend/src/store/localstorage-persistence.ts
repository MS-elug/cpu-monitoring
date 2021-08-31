import { ActionCreatorWithPayload, Store } from '@reduxjs/toolkit';

function storageKeyBuilder(elementName: string): string {
  return `store-backup:${elementName}`;
}

/** Utility to keep  */
export const setupLocalStoragePeristence = (store: Store, elementToPersist: { name: string; hydrate: ActionCreatorWithPayload<any> }[]) => {
  // Subscribe to store update to backup the config state
  store.subscribe(() => {
    const state = store.getState();
    // Backup element
    for (const element of elementToPersist) {
      const storeData = state[element.name];
      const storageKey = storageKeyBuilder(element.name);
      if (storeData) {
        localStorage.setItem(storageKey, JSON.stringify(storeData));
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  });

  // Restore the config state
  for (const element of elementToPersist) {
    const storageKey = storageKeyBuilder(element.name);
    try {
      const elementStateStr = localStorage.getItem(storageKey);
      if (elementStateStr) {
        store.dispatch(element.hydrate(JSON.parse(elementStateStr)));
      }
    } catch (err) {
      console.error(err);
      // In case of error, remove the store data to avoid the error again in the future
      localStorage.removeItem(storageKey);
    }
  }
};
