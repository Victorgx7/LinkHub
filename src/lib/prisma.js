import { PrismaClient } from '@prisma/client';

/**
 * Instância única e segura do Prisma Client para evitar exaustão de conexões
 * no pool do MySQL durante recarregamento a quente (HMR) no ambiente de desenvolvimento do Next.js.
 */
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
