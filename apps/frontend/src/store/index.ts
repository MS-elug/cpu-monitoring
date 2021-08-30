import { configureStore } from '@reduxjs/toolkit';
import { enablePersistantStore } from '../environement/environement';
import { configSlice } from './config/config-slice';
import { cpuLoadSlice } from './cpu-load/cpu-load-slice';
import { setupLocalStoragePeristence } from './localstorage-persistence';

const store = configureStore({
  reducer: {
    cpuLoad: cpuLoadSlice.reducer,
    config: configSlice.reducer
  }
});

// Persistant store
if (enablePersistantStore && window.localStorage) {
  setupLocalStoragePeristence(store);
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
