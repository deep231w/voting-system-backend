import { PrismaClient } from '../generated/prisma/index.js';

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // Prevent creating new instances during hot-reload in dev
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
