import {configureStore} from '@reduxjs/toolkit';
import dashboardSlice from './modules/dashboardSlice';
import genericSlice from './modules/genericSlice';
import menuSlice from './modules/menuSlice';
import orderSlice from './modules/orderSlice';
import profileSlice from './modules/profileSlice';
import settingsSlice from './modules/settingsSlice';

const store = configureStore({
  reducer: {
    generic: genericSlice,
    profile: profileSlice,
    dashboard: dashboardSlice,
    order: orderSlice,
    menu: menuSlice,
    settings: settingsSlice,
  },
});
const dispatch = store.dispatch;
const getStore = store.getState;
export {dispatch, getStore};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
