import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import SalesforceSync from '../../components/SalesforceSync';
import { Container, Typography, Paper, Grid, Box } from '@mui/material';

const Profile = () => {
  const user = useSelector(selectUser);

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom color="primary">
        Profile
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <Box sx={{ '& > :not(style)': { mb: 2 } }}>
              <Box>
                <Typography color="text.secondary" variant="subtitle2">
                  Email
                </Typography>
                <Typography>{user.email}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="subtitle2">
                  Name
                </Typography>
                <Typography>{user.name}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="subtitle2">
                  Role
                </Typography>
                <Typography>{user.role}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="subtitle2">
                  Member Since
                </Typography>
                <Typography>{new Date(user.createdAt).toLocaleDateString()}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <SalesforceSync />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;