// /store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // You can add other reducers here for other features
    // e.g., chat: chatReducer
  },
});
