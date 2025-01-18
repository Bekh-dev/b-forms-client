import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunks
export const syncWithSalesforce = createAsyncThunk(
  'salesforce/sync',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Syncing with Salesforce:', userData);
      const response = await api.post('/salesforce/sync', userData);
      console.log('Salesforce sync response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Salesforce sync error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to sync with Salesforce');
    }
  }
);

export const getSalesforceStatus = createAsyncThunk(
  'salesforce/status',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Getting Salesforce status');
      const response = await api.get('/salesforce/status');
      console.log('Salesforce status response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Salesforce status error:', error.response?.data || error.message);
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
        state.account = action.payload.account;
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
