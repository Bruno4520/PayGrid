import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});
