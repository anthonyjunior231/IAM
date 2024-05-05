// importing relevant modules
import * as dotenv from "dotenv";
import path from "path";
const envPath=path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath});

// import relevant types
import { defaultConfigTypes, AWSConfigTypes, DBConfigTypes, FirebaseConfigTypes, verificationTypes } from "../types/config.types";

export const isProd: boolean = process.env.ENGINE_ENV === "production";
export const isDevelopment: boolean = process.env.ENGINE_ENV === "development";
export const PORT: number = parseInt(process.env.PORT || "8000", 10);


interface CorsSettings {
  credentials: boolean;
  origin: string[];
  methods: string[];
}

export const corsSettings: CorsSettings = isProd
  ? {
      credentials: true,
      origin: [
        "https://google.com",
        "http://localhost:8000",
        "http://localhost:3000",
        "http://localhost:5173",
        "https://storage.googleapis.com"
      ],
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"]
    }
  : {
      credentials: true,
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:9000",
        "http://localhost:5173",
        "https://www.test.google.com",
        "http://localhost:8080", 
        "https://storage.googleapis.com" 
      ],
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"]
    };


// defaultConfig object - this contains any config strings || numbers
export const defaultConfig: defaultConfigTypes = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 8000,
  SECRET_KEY: process.env.SECRET_KEY ? String(process.env.SECRET_KEY) : "",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? String(process.env.ADMIN_PASSWORD) : "",
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ? String(process.env.ENCRYPTION_KEY) : "",
};
export const AWSConfig: AWSConfigTypes = {
  AWS_ACCESS_KEY:process.env.AWS_ACCESS_KEY? String(process.env.AWS_ACCESS_KEY): "",
  AWS_SECRET_KEY:process.env.AWS_SECRET_KEY? String(process.env.AWS_SECRET_KEY): "",
}
export const DBConfig: DBConfigTypes={
  DB_USER: process.env.DB_USER ? String(process.env.DB_USER) : "",
  DB_HOST: process.env.DB_HOST ? String(process.env.DB_HOST) : "",
  DB_NAME: process.env.DB_NAME ? String(process.env.DB_NAME) : "",
  DB_PASSWORD:process.env.DB_PASSWORD ? String(process.env.DB_PASSWORD) : "",
  DB_PORT:process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  
}
export const FirebaseConfig: FirebaseConfigTypes = {
  FIREBASE_STORAGE_BUCKET:process.env.FIREBASE_STORAGE_BUCKET? String(process.env.FIREBASE_STORAGE_BUCKET): "",
}

export const verificationConfig : verificationTypes = {
  VERIFICATION_CODE_LENGTH : 4,
  username : (process.env.mailuser),
  password : (process.env.mailpass)
}
