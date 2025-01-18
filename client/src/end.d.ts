/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_TOKEN_PROVIDER_URL: string;
    readonly VITE_STREAM_API_KEY: string;
    // Add more environment variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  