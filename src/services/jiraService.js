import api from '../api/axios';

const jiraApi = api;

export const createJiraTicket = async ({ summary, priority, description, reporter, templateTitle, pageUrl }) => {
  try {
    const data = {
      fields: {
        project: {
          key: import.meta.env.VITE_JIRA_PROJECT_KEY
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
                  text: `Template: ${templateTitle || 'N/A'}`,
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
    console.error('Error creating Jira ticket:', error);
    throw error.response?.data || { message: 'Failed to create ticket' };
  }
};

export const getUserTickets = async (email, startAt = 0) => {
  try {
    const jql = `reporter = "${email}" ORDER BY created DESC`;
    const response = await jiraApi.get(`/api/jira/tickets/${email}`, {
      params: {
        jql,
        startAt,
        maxResults: 10
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    throw error.response?.data || { message: 'Failed to fetch tickets' };
  }
};
