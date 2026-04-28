const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// 1. Create the pg Pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Create the adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to Prisma
const prisma = new PrismaClient({ adapter });

// Only export at the bottom after prisma is defined
module.exports = prisma;