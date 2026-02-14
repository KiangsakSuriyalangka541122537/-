import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // We cast process to any to avoid TypeScript complaints in this Node.js context file
  const env = loadEnv(mode, (process as any).cwd(), '')

  return {
    plugins: [react()],
    define: {
      // Define specific environment variables as strings to be replaced during build
      // This allows 'process.env.API_KEY' to work in client code without a real 'process' object
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL),
      'process.env.SUPABASE_KEY': JSON.stringify(env.SUPABASE_KEY),
      'process.env.NODE_ENV': JSON.stringify(mode),
    }
  }
})