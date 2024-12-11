import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
      url:'postgresql://Education_DB_owner:WJUB7oYkhj4M@ep-cool-sea-a5rb4ffx.us-east-2.aws.neon.tech/Education_DB?sslmode=require'
  }
});
