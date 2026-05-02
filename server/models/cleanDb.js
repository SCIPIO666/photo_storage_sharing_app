const prisma = require('../config/prismaConfig')

prisma.User.deleteMany({})
prisma.Folder.deleteMany({})
prisma.File.deleteMany({})