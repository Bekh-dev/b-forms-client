import api from './api/axios';

const defaultConfig = {
  apiUrl: 'https://b-froms-server.onrender.com',
  appName: 'B-Forms',
  jira: {
    domain: '',
    email: '',
    projectKey: '',
    apiToken: ''
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
