import api from '../api/axios';

const jiraApi = api;

export const createJiraTicket = async ({ summary, priority, description, reporter, pageUrl }) => {
  try {
    const projectKey = import.meta.env.VITE_JIRA_PROJECT_KEY;
    if (!projectKey) {
      throw new Error('Project key is not configured');
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
        },
        reporter: {
          emailAddress: reporter
        }
      }
    };

    const response = await jiraApi.post('/api/jira/tickets', data);
    return response.data;
  } catch (error) {
    console.error('Error creating Jira ticket:', error.response?.data || error.message);
    if (error.response?.data?.errors?.project) {
      throw new Error('Invalid project configuration. Please check your settings.');
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
