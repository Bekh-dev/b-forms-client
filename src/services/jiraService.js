import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

    const response = await axios.post(`${API_URL}/jira/tickets`, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Jira ticket:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to create ticket');
  }
};

export const getUserTickets = async (email, startAt = 0) => {
  try {
    console.log('Fetching tickets for email:', email);
    const response = await axios.get(`${API_URL}/jira/tickets/${encodeURIComponent(email)}`, {
      params: {
        startAt
      },
      withCredentials: true
    });
    console.log('API Response:', response.data);

    // Преобразуем данные в нужный формат
    return {
      total: response.data.total,
      tickets: response.data.tickets.map(ticket => ({
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
    console.error('Error fetching tickets:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch tickets');
  }
};
