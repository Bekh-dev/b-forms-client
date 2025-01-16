import api from './api/axios';

const defaultConfig = {
  apiUrl: 'https://b-froms-server.onrender.com',
  appName: 'B-Forms',
  jira: {
    domain: process.env.VITE_JIRA_DOMAIN,
    email: process.env.VITE_JIRA_EMAIL,
    projectKey: process.env.VITE_JIRA_PROJECT_KEY,
    apiToken: process.env.VITE_JIRA_API_TOKEN
  }
};

let configPromise = null;

export const getConfig = async () => {
  if (!configPromise) {
    configPromise = api.get('/api/config')
      .then(response => {
        Object.assign(defaultConfig.jira, response.data.jira);
        return defaultConfig;
      })
      .catch(error => {
        console.error('Failed to load config:', error);
        return defaultConfig;
      });
  }
  return configPromise;
};

export const config = defaultConfig;
