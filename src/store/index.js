import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tutorialReducer from './tutorialSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    user: userReducer,
    tutorial: tutorialReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

export default store;