import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/models/schema.prisma",
  migrations: {
    path: "src/models/migrations",
    seed: "npx tsx src/models/seed/seeder.ts",
  },
  datasource: {
    // @ts-ignore
    url: process.env.DATABASE_URL!,
  },
});