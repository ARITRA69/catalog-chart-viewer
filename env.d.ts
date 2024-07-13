export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALPHA_VANTAGE_API_KEY: string;
    }
  }
}
