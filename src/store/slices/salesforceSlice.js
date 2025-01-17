import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunks
export const syncWithSalesforce = createAsyncThunk(
  'salesforce/sync',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/salesforce/sync', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sync with Salesforce');
    }
  }
);

export const getSalesforceStatus = createAsyncThunk(
  'salesforce/status',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/salesforce/status');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get Salesforce status');
    }
  }
);

const salesforceSlice = createSlice({
  name: 'salesforce',
  initialState: {
    synced: false,
    lastSync: null,
    account: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncWithSalesforce.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncWithSalesforce.fulfilled, (state, action) => {
        state.loading = false;
        state.synced = true;
        state.lastSync = new Date().toISOString();
      })
      .addCase(syncWithSalesforce.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSalesforceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSalesforceStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.synced = action.payload.synced;
        state.lastSync = action.payload.lastSync;
        state.account = action.payload.account;
      })
      .addCase(getSalesforceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = salesforceSlice.actions;

export const selectSalesforceState = (state) => state.salesforce;
export const selectSalesforceLoading = (state) => state.salesforce.loading;
export const selectSalesforceError = (state) => state.salesforce.error;
export const selectSalesforceSynced = (state) => state.salesforce.synced;
export const selectSalesforceAccount = (state) => state.salesforce.account;

export default salesforceSlice.reducer;
