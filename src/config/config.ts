import { registerAs } from "@nestjs/config";

export interface EnvConfig {
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  apiKey: string;
  jwtSecret: string;
  nodeEnv: string;
  port: number;
  origin: string;
}

export const config = registerAs('config', (): EnvConfig => {
    return {
        database: { 
            host: process.env.DATABASE_HOST!,
            port: Number(process.env.DATABASE_PORT!),
            user: process.env.DATABASE_USER!,
            password: process.env.DATABASE_PASSWORD!,
            database: process.env.DATABASE_NAME!,
        },
        apiKey: process.env.API_KEY!,
        jwtSecret: process.env.JWT_SECRET!,
        nodeEnv: process.env.NODE_ENV!,
        port: Number(process.env.PORT!),
        origin: process.env.ORIGIN!,
    }
})
