// config/database.js
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

// Create a single PrismaClient instance for the app
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Test connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Only run test in development
if (process.env.NODE_ENV !== 'production') {
  testConnection();
}

module.exports = prisma;