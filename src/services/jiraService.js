import api from '../api/axios';

export const createJiraTicket = async ({ summary, priority, description, reporter, pageUrl }) => {
  try {
    const data = {
      summary,
      description,
      priority,
      reporter,
      pageUrl
    };

    console.log('Creating ticket with data:', data);

    const response = await api.post('/api/jira/tickets', data);
    return response.data;
  } catch (error) {
    console.error('Error creating Jira ticket:', {
      message: error.message,
      response: error.response?.data
    });
    
    if (error.response?.data?.errorMessages?.length > 0) {
      throw new Error(error.response.data.errorMessages[0]);
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Failed to create ticket');
  }
};

export const getUserTickets = async (email, startAt = 0) => {
  try {
    const response = await api.get('/api/jira/tickets', {
      params: {
        email,
        startAt
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw new Error('Failed to fetch tickets');
  }
};
