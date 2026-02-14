
// Augment the global NodeJS ProcessEnv interface to include our environment variables.
// This prevents conflict with existing process declarations (e.g. from @types/node).
declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
    readonly SUPABASE_URL: string;
    readonly SUPABASE_KEY: string;
    readonly NODE_ENV: string;
    [key: string]: string | undefined;
  }
}