const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const logger=require('../utils/logger')
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// prisma.$connect()
//   .then(() => logger.info(' Database connected successfully'))
//   .catch((error) => logger.error(' Database connection failed:', error));

module.exports = prisma;
