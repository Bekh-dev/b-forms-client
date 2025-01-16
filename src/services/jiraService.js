import axios from 'axios';

const jiraApi = axios.create({
  baseURL: import.meta.env.VITE_JIRA_DOMAIN + '/rest/api/3',
  auth: {
    username: import.meta.env.VITE_JIRA_EMAIL,
    password: import.meta.env.VITE_JIRA_API_TOKEN
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const createJiraTicket = async ({ summary, priority, description, reporter, templateTitle, pageUrl }) => {
  try {
    const response = await jiraApi.post('/issue', {
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
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Jira ticket:', error);
    throw error;
  }
};

export const getUserTickets = async (email, startAt = 0) => {
  try {
    const jql = `reporter = "${email}" ORDER BY created DESC`;
    const response = await jiraApi.get('/search', {
      params: {
        jql,
        startAt,
        maxResults: 10
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    throw error;
  }
};
