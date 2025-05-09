import * as dotenv from 'dotenv';
dotenv.config()

export const DB_PORT = process.env.DB_PORT
export const DB_NAME = process.env.DB_NAME
export const PASSWORD = process.env.DB_PASS
export const USER = process.env.DB_USER 
export const DB_HOST = process.env.DB_HOST