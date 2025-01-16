import api from '../api/axios';

const jiraApi = api;

export const createJiraTicket = async ({ summary, priority, description, reporter, pageUrl }) => {
  try {
    const projectKey = import.meta.env.VITE_JIRA_PROJECT_KEY;
    if (!projectKey) {
      throw new Error('Project key is not configured');
    }

    console.log('Creating ticket with project key:', projectKey);

    const data = {
      fields: {
        project: {
          key: projectKey,
          id: "10000" 
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
          id: "10001", 
          name: "Task"
        },
        priority: {
          id: priority === 'High' ? '1' : priority === 'Medium' ? '3' : '5', 
          name: priority
        },
        reporter: {
          emailAddress: reporter
        }
      }
    };

    console.log('Sending ticket data:', JSON.stringify(data, null, 2));

    const response = await jiraApi.post('/api/jira/tickets', data);
    console.log('Jira response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating Jira ticket:', error.response?.data || error.message);
    console.error('Full error object:', error);
    
    if (error.response?.data?.errors?.project) {
      throw new Error(`Project configuration error: ${error.response.data.errors.project}`);
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
