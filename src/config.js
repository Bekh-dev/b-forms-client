export const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  appName: 'B-Forms',
  jira: {
    domain: import.meta.env.VITE_JIRA_DOMAIN,
    email: import.meta.env.VITE_JIRA_EMAIL,
    projectKey: import.meta.env.VITE_JIRA_PROJECT_KEY,
    apiToken: import.meta.env.VITE_JIRA_API_TOKEN
  }
};
