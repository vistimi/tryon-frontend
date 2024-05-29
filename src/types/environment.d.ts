declare global {
    namespace NodeJS {
        interface ProcessEnv {
            AI_URL: string;
        }
    }
}