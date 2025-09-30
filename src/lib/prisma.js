import { PrismaClient } from '../generated/prisma/index.js';

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// export default prisma;
