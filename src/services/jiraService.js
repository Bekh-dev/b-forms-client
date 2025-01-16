import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const createJiraTicket = async ({ summary, description, reporter, pageUrl, priority = 'Medium' }) => {
  try {
    const data = {
      summary,
      description,
      reporter,
      pageUrl,
      priority
    };

    console.log('Creating ticket with data:', data);

    const response = await api.post('/jira/tickets', data);
    console.log('Ticket created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating Jira ticket:', {
      message: error.message,
      response: error.response?.data
    });
    throw new Error(error.response?.data?.message || error.message || 'Failed to create ticket');
  }
};

export const getUserTickets = async (email, startAt = 0) => {
  try {
    console.log('Fetching tickets for email:', email, 'from URL:', `${API_URL}/jira/tickets/${encodeURIComponent(email)}`);
    const response = await api.get(`/jira/tickets/${encodeURIComponent(email)}`, {
      params: {
        startAt
      }
    });
    console.log('Tickets response:', response.data);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    // Преобразуем данные в нужный формат
    return {
      total: response.data.total || 0,
      tickets: response.data.tickets || response.data.tickets.map(ticket => ({
        id: ticket.id,
        key: ticket.key,
        summary: ticket.summary,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
        created: new Date(ticket.created).toLocaleString(),
        updated: new Date(ticket.updated).toLocaleString()
      }))
    };
  } catch (error) {
    console.error('Error fetching tickets:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 404) {
      throw new Error('Server endpoint not found. Please check server configuration.');
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch tickets');
  }
};
