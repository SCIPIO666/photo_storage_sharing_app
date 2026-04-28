
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Try to query
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Query successful:', result);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Please check your DATABASE_URL in .env file');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();