import api from '../api/axios';
import { config } from '../config';

const jiraApi = api;

// Log all environment variables at startup
console.log('Environment variables:', {
  API_URL: import.meta.env.VITE_API_URL,
  JIRA_DOMAIN: import.meta.env.VITE_JIRA_DOMAIN,
  JIRA_PROJECT_KEY: import.meta.env.VITE_JIRA_PROJECT_KEY,
  // Don't log sensitive information like API tokens
});

export const createJiraTicket = async ({ summary, priority, description, reporter, pageUrl }) => {
  try {
    const projectKey = config.jira.projectKey;
    
    if (!projectKey) {
      throw new Error(`Project key is not configured. Current value: ${projectKey}`);
    }

    if (!config.jira.apiToken) {
      throw new Error('Jira API token is not configured');
    }

    const data = {
      fields: {
        project: {
          key: projectKey
        },
        summary,
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  text: description,
                  type: "text"
                }
              ]
            },
            {
              type: "paragraph",
              content: [
                {
                  text: `Page URL: ${pageUrl}`,
                  type: "text"
                }
              ]
            },
            {
              type: "paragraph",
              content: [
                {
                  text: `Reporter: ${reporter}`,
                  type: "text"
                }
              ]
            }
          ]
        },
        issuetype: {
          name: "Task"
        },
        priority: {
          name: priority
        }
      },
      auth: {
        email: config.jira.email,
        apiToken: config.jira.apiToken
      }
    };

    console.log('Creating ticket with data:', {
      ...data,
      auth: {
        email: config.jira.email,
        apiToken: '***' // Hide token in logs
      }
    });

    const response = await jiraApi.post('/api/jira/tickets', data);
    console.log('Jira response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating Jira ticket:', {
      message: error.message,
      response: error.response?.data,
      projectKey: config.jira.projectKey,
      hasToken: !!config.jira.apiToken
    });
    
    if (error.response?.data?.errorMessages?.length > 0) {
      throw new Error(error.response.data.errorMessages[0]);
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Failed to create ticket');
  }
};

export const getUserTickets = async (email, startAt = 0) => {
  try {
    const response = await jiraApi.get('/api/jira/tickets', {
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
