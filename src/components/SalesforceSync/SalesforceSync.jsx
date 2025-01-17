import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Card, CardContent, Typography, CircularProgress, Alert, TextField } from '@mui/material';
import { syncWithSalesforce, getSalesforceStatus } from '../../store/slices/salesforceSlice';
import { selectSalesforceLoading, selectSalesforceError, selectSalesforceSynced } from '../../store/slices/salesforceSlice';

const SalesforceSync = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectSalesforceLoading);
  const error = useSelector(selectSalesforceError);
  const synced = useSelector(selectSalesforceSynced);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    dispatch(getSalesforceStatus());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSync = async () => {
    await dispatch(syncWithSalesforce(formData));
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Salesforce Sync
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {synced ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Successfully synced with Salesforce
          </Alert>
        ) : (
          <Box component="form" sx={{ '& > :not(style)': { m: 1 } }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSync}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sync with Salesforce'
              )}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesforceSync;
