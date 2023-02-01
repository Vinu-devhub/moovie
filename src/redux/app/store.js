import { configureStore } from '@reduxjs/toolkit';
import homeSliceReducer from '../features/homeSlice';

export const store = configureStore({
  reducer: {
    home: homeSliceReducer,
  },
});
