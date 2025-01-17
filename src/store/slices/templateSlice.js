import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  templates: [],
  publicTemplates: [],
  currentTemplate: null,
  loading: false,
  error: null
};

export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (templateData, { rejectWithValue }) => {
    try {
      console.log('Creating template with data:', templateData);
      const response = await api.post('/templates', templateData);
      console.log('Template created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create template:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to create template');
    }
  }
);

export const fetchMyTemplates = createAsyncThunk(
  'templates/fetchMyTemplates',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching my templates');
      const response = await api.get('/templates/my');
      console.log('My templates fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch my templates:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch templates');
    }
  }
);

export const fetchPublicTemplates = createAsyncThunk(
  'templates/fetchPublicTemplates',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching public templates');
      const response = await api.get('/templates/public');
      console.log('Public templates fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch public templates:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch templates');
    }
  }
);

export const fetchTemplateById = createAsyncThunk(
  'templates/fetchTemplateById',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Fetching template by id:', id);
      const response = await api.get(`/templates/${id}`);
      console.log('Template fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch template:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch template');
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'templates/updateTemplate',
  async ({ id, templateData }, { rejectWithValue }) => {
    try {
      console.log('Updating template:', id, templateData);
      const response = await api.put(`/templates/${id}`, templateData);
      console.log('Template updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to update template:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to update template');
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'templates/deleteTemplate',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Deleting template:', id);
      await api.delete(`/templates/${id}`);
      return id;
    } catch (error) {
      console.error('Failed to delete template:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete template');
    }
  }
);

const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Template
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.unshift(action.payload);
        state.currentTemplate = action.payload;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch My Templates
      .addCase(fetchMyTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchMyTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Public Templates
      .addCase(fetchPublicTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.publicTemplates = action.payload;
      })
      .addCase(fetchPublicTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Template By Id
      .addCase(fetchTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTemplate = action.payload;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Template
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.map(template =>
          template._id === action.payload._id ? action.payload : template
        );
        state.currentTemplate = action.payload;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Template
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.filter(template => template._id !== action.payload);
        if (state.currentTemplate?._id === action.payload) {
          state.currentTemplate = null;
        }
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentTemplate, clearError } = templateSlice.actions;

export const selectMyTemplates = state => state.templates.templates;
export const selectPublicTemplates = state => state.templates.publicTemplates;
export const selectCurrentTemplate = state => state.templates.currentTemplate;
export const selectTemplatesLoading = state => state.templates.loading;
export const selectTemplatesError = state => state.templates.error;

export default templateSlice.reducer;
