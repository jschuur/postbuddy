declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_URL: string;
      CLERK_SECRET_KEY: string;
    }
  }
}
