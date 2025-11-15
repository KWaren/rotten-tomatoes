import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global;

const useAccelerate =
  process.env.ACCELERATE_URL &&
  process.env.ACCELERATE_URL.startsWith("prisma://");

const prismaDirect =
  globalForPrisma.prismaDirect ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

const prisma = useAccelerate
  ? globalForPrisma.prisma ||
    new PrismaClient({
      datasources: {
        db: {
          url: process.env.ACCELERATE_URL,
        },
      },
    }).$extends(withAccelerate())
  : prismaDirect; 

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaDirect = prismaDirect;
}

export default prisma;
export { prismaDirect };
