const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const orders = await prisma.order.findMany();
    console.log('success:', orders);
  } catch (e) {
    console.error('error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
