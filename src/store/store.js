import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import templateReducer from './slices/templateSlice';
import responseReducer from './slices/responseSlice';
import salesforceReducer from './slices/salesforceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    templates: templateReducer,
    responses: responseReducer,
    salesforce: salesforceReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
