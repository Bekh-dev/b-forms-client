import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/b-forms-client/',
  define: {
    // Prevent Vite from inlining env variables
    'process.env.VITE_JIRA_API_TOKEN': 'window.ENV.VITE_JIRA_API_TOKEN',
    'process.env.VITE_JIRA_EMAIL': 'window.ENV.VITE_JIRA_EMAIL',
    'process.env.VITE_JIRA_DOMAIN': 'window.ENV.VITE_JIRA_DOMAIN',
    'process.env.VITE_JIRA_PROJECT_KEY': 'window.ENV.VITE_JIRA_PROJECT_KEY',
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
  },
  envPrefix: 'VITE_',
});
