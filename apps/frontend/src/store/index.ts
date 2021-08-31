import { configureStore } from '@reduxjs/toolkit';
import { enablePersistantStore } from '../environement/environement';
import { configSlice, ConfigState } from './config/config-slice';
import { cpuLoadSlice, CPULoadState } from './cpu-load/cpu-load-slice';
import { setupLocalStoragePeristence } from './localstorage-persistence';


export interface IPreloadedState {
  cpuLoad: CPULoadState;
  config: ConfigState;
}

export function storeBuilder(preloadedState?: IPreloadedState){
  return configureStore({
    reducer: {
      cpuLoad: cpuLoadSlice.reducer,
      config: configSlice.reducer
    },
    preloadedState
  });
}
const store = storeBuilder();

// Persistant store
if (enablePersistantStore && window.localStorage) {
  setupLocalStoragePeristence(store, [{ name: 'config', hydrate: configSlice.actions.hydrate }]);
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
