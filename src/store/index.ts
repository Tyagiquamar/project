import { configureStore } from '@reduxjs/toolkit';
import pollReducer from './pollSlice';
import studentReducer from './studentSlice';

export const store = configureStore({
  reducer: {
    poll: pollReducer,
    student: studentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;