// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const prisma=require('../config/prismaConfig')
dotenv.config();


prisma.User.deleteMany({})
prisma.Folder.deleteMany({})
prisma.File.deleteMany({})
async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Check if users already exist
    const existingUsers = await prisma.user.count();
    
    if (existingUsers > 0) {
      console.log('📊 Database already has data. Skipping seed...');
      console.log(`   Found ${existingUsers} existing users.`);
      return;
    }

    // Create default admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@photovault.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Created admin user: ${admin.email}`);

    // Create demo users
    console.log('👥 Creating demo users...');
    const demoUsers = [
      {
        email: 'john@example.com',
        name: 'John Doe',
        password: 'John123!',
      },
      {
        email: 'jane@example.com',
        name: 'Jane Smith',
        password: 'Jane123!',
      },
      {
        email: 'demo@example.com',
        name: 'Demo User',
        password: 'Demo123!',
      },
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          role: 'USER',
        },
      });
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.email}`);
    }

    // Create folders for each user
    console.log('📁 Creating folders for users...');
    const allUsers = [admin, ...createdUsers];
    
    for (const user of allUsers) {
      // Create default "Main Gallery" folder
      const defaultFolder = await prisma.folder.create({
        data: {
          name: 'Main Gallery',
          description: 'Your default photo gallery - all uploaded photos go here',
          isDefault: true,
          userId: user.id,
        },
      });
      console.log(`✅ Created default folder for ${user.name}`);

      // Create additional sample folders for demo users (skip for admin)
      if (user.role !== 'ADMIN') {
        const sampleFolders = [
          {
            name: 'Vacation 2024',
            description: 'Summer trip to the beach',
            isDefault: false,
          },
          {
            name: 'Family Moments',
            description: 'Precious family memories',
            isDefault: false,
          },
          {
            name: 'Work Projects',
            description: 'Designs and presentations',
            isDefault: false,
          },
        ];

        for (const folderData of sampleFolders) {
          await prisma.folder.create({
            data: {
              ...folderData,
              userId: user.id,
            },
          });
        }
        console.log(`✅ Created sample folders for ${user.name}`);
      }
    }

    // Get all folders for sample files
    const allFolders = await prisma.folder.findMany();
    
    // Create sample file records
    console.log('🖼️ Creating sample file records...');
    
    const sampleFiles = [
      {
        url: 'https://picsum.photos/id/1015/800/600',
        publicId: 'sample/landscape-1015',
        filename: 'mountain-landscape.jpg',
        size: 1024000,
        mimeType: 'image/jpeg',
        width: 800,
        height: 600,
        format: 'jpg',
      },
      {
        url: 'https://picsum.photos/id/104/800/600',
        publicId: 'sample/portrait-104',
        filename: 'portrait-photo.jpg',
        size: 856000,
        mimeType: 'image/jpeg',
        width: 800,
        height: 600,
        format: 'jpg',
      },
      {
        url: 'https://picsum.photos/id/106/800/600',
        publicId: 'sample/flowers-106',
        filename: 'beautiful-flowers.jpg',
        size: 945000,
        mimeType: 'image/jpeg',
        width: 800,
        height: 600,
        format: 'jpg',
      },
      {
        url: 'https://picsum.photos/id/20/800/600',
        publicId: 'sample/coffee-20',
        filename: 'coffee-and-laptop.jpg',
        size: 789000,
        mimeType: 'image/jpeg',
        width: 800,
        height: 600,
        format: 'jpg',
      },
      {
        url: 'https://picsum.photos/id/26/800/600',
        publicId: 'sample/venice-26',
        filename: 'venice-canal.jpg',
        size: 1123000,
        mimeType: 'image/jpeg',
        width: 800,
        height: 600,
        format: 'jpg',
      },
    ];

    // Add sample files to each user's default folder (except admin)
    for (const user of createdUsers) {
      const userDefaultFolder = allFolders.find(
        f => f.userId === user.id && f.isDefault === true
      );
      
      if (userDefaultFolder) {
        for (const sampleFile of sampleFiles) {
          await prisma.file.create({
            data: {
              ...sampleFile,
              folderId: userDefaultFolder.id,
              userId: user.id,
            },
          });
        }
        console.log(`✅ Added ${sampleFiles.length} sample photos for ${user.name}`);
      }
    }

    // Generate statistics
    const stats = {
      users: await prisma.user.count(),
      folders: await prisma.folder.count(),
      files: await prisma.file.count(),
    };

    console.log('\n📊 Seeding Statistics:');
    console.log(`   - Users: ${stats.users}`);
    console.log(`   - Folders: ${stats.folders}`);
    console.log(`   - Files: ${stats.files}`);
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('   📧 Admin: admin@photovault.com');
    console.log('   🔐 Password: Admin123!');
    console.log('   ---');
    console.log('   📧 Demo: demo@example.com');
    console.log('   🔐 Password: Demo123!');
    console.log('   ---');
    console.log('   📧 John: john@example.com');
    console.log('   🔐 Password: John123!');
    console.log('   ---');
    console.log('   📧 Jane: jane@example.com');
    console.log('   🔐 Password: Jane123!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });