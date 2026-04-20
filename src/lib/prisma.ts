import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { _prismaClient: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL ?? "";

  if (connectionString.includes("neon.tech")) {
    // Neon serverless (HTTP) — Prisma 7 API
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { neon } = require("@neondatabase/serverless");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaNeon } = require("@prisma/adapter-neon");
    const sql = neon(connectionString);
    const adapter = new PrismaNeon(sql);
    return new PrismaClient({ adapter });
  }

  // Standard PostgreSQL via TCP — local dev
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require("pg");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaPg } = require("@prisma/adapter-pg");
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

function getClient(): PrismaClient {
  if (!globalForPrisma._prismaClient) {
    globalForPrisma._prismaClient = createPrismaClient();
  }
  return globalForPrisma._prismaClient;
}

// Proxy so the client is only instantiated on first actual use (env vars are ready by then)
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop: string) {
    return (getClient() as any)[prop];
  },
});
