import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/b-forms-client/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      }
    }
  },
  define: {
    'process.env': {
      VITE_API_URL: JSON.stringify(process.env.VITE_API_URL),
      VITE_JIRA_DOMAIN: JSON.stringify(process.env.VITE_JIRA_DOMAIN),
      VITE_JIRA_EMAIL: JSON.stringify(process.env.VITE_JIRA_EMAIL),
      VITE_JIRA_PROJECT_KEY: JSON.stringify(process.env.VITE_JIRA_PROJECT_KEY),
      VITE_JIRA_API_TOKEN: JSON.stringify(process.env.VITE_JIRA_API_TOKEN)
    }
  }
});
