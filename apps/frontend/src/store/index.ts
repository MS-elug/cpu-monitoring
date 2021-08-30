import { configureStore } from '@reduxjs/toolkit';
import configSlice from './config/config-slice';
import cpuLoadSlice from './cpu-load/cpu-load-slice';

const store = configureStore({
  reducer: {
    cpuLoad: cpuLoadSlice,
    config: configSlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;