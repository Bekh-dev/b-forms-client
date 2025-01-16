const getEnvVar = (key) => {
  if (window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }
  return import.meta.env[key];
};

export const config = {
  apiUrl: getEnvVar('VITE_API_URL'),
  appName: 'B-Forms',
  jira: {
    domain: getEnvVar('VITE_JIRA_DOMAIN'),
    email: getEnvVar('VITE_JIRA_EMAIL'),
    projectKey: getEnvVar('VITE_JIRA_PROJECT_KEY'),
    apiToken: getEnvVar('VITE_JIRA_API_TOKEN')
  }
};
