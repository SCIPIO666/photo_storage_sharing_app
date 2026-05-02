
const prisma = require('../config/prismaConfig');
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

async function collectFolderIds(folderId){
    try {
        //collect all ids recursively
        const children= await prisma.folder.findMany({
            where: {parentId: folderId},
            select: {id : true}
        })

        let allIds=[folderId]
        for(let child of children){
            const childIds=await collectFolderIds(child.id)
            allIds=allIds.concat(childIds)
        }

        return allIds
    } catch (error) {
        logger.error(`error: ${error.message}`)
        throw error
    }
}
     async function createFolder(userId,name,parentId ){
        try {
            const newFolder=await  prisma.folder.create({
                data: {
                    name,
                    userId,
                    parentId: options.parentId || null
                }
                
            })
        return newFolder
        } catch (error) {
            logger.error(`error: ${error.message}`)
        }
    }
   async function getUserFolders(userId, rootOnly=false) {

    try{
    const userFolders= await prisma.folder.findMany({
        where: {
            userId,
            parentId: rootOnly? null : undefined,
        },
        include: {
            children : true,
            files: true
        }
    })
    return userFolders
    } catch (error) {
      logger.error(`Error in getUserFiles: ${error.message}`);
      throw error;
    }
  }
  
   async function getFolderById(folderId, userId) {
    try {
      const file = await prisma.folder.findFirst({
        where: { id: folderId, userId },
        include: { files: true }
      });
      
      if (!file) throw new Error('File not found');
      return file;
    } catch (error) {
      logger.error(`Error in getFileById: ${error.message}`);
      throw error;
    }
  }
  
   async function deleteEmptyFolder(folderId, userId) {
    try {
        const folder=await prisma.folder.findUnique({
            where:{folderId,userId},
            include: {
                children: true,
                files: true
            }
        })
        if (folder.children.length>0 ||  folder.files.length>0){
            throw new Error ("Folder is not empty")
        }

       const deletedFolder= await prisma.folder.delete({
            where:{id: folderId}
        })
        return deletedFolder
    } catch (error) {
      logger.error(`Error in deleteFile: ${error.message}`);
      throw error;
    }
  }
  async function deleteFolderRecursively(folderIds){
    //find child folders first
    const childFolders=await prisma.findMany({
        where: {parentId: folderId},
        select: {id : true}
    })
    //recursive deletion
    for (let child of childFolders){
        await deleteFolderRecursively(child.id)
    }

    //find all files in currentFolder
    const deleteFiles=await prisma.file.findMany({
        where: {folderId},
        select:{
            id: true,
            publicId: true
        }
    })
    //delete associated media from cloudinary
    await Promise.all(
        deleteFiles.map(deleteFile=>cloudinary.uploader.destroy(deleteFile.publicId))
    )

    //deleting all files metadata  in current folder
    await prisma.file.deleteMany({
        where:{folderId: folderId}

    })

    //delete the folder itself
    await prisma.folder.delete({
        where:{id: folderId}
    })
  }
    async function deleteManyFolders(folderIds,userId) {
        try {
            //collect all folder ids for all input folders
            let allFolderIds=[]
            for (const folderId of folderIds){
                const ids=await collectFolderIds(folderId)
                allFolderIds=allFolderIds.concat(ids)
            }

            //remove duplicates
            allFolderIds=Array.from(new Set(allFolderIds))

            //extract all files in the folders
            const files= await prisma .file.findMany({
                where : {folderId: {in: allFolderIds}},
                select: {
                    id: true,
                    publicId: true
                }
            })
            //delete from cloudinary ...use publicId 
            await Promise.all(files.map(file=>cloudinary.uploader.destroy(file.publicId)))

            //delete all accompanying metadata
            const deletedResult=await prisma.folder.deleteMany({
                where: {id: {in : allFolderIds}}
            })

            return deletedResult
        } catch (error) {
        logger.error(`Error in deleteManyFiles: ${error.message}`);
        throw error;
        }
    }
  
   async function updateFolder(folderId, updatedData={}) {
    try {
     const existingFolder= await getFileById(folderId, userId);
      
      const updatedFolder = await prisma.folder.update({
        where: { id: fileId ,userId},
        data: {
          ...updateData,
          updatedAt: new Date()
        },
        include: { files: true }
      });
      
      return updatedFolder;
    } catch (error) {
      logger.error(`Error in updateFile: ${error.message}`);
      throw error;
    }
  }
  
   async function getFolderStats(userId) {
    try {
      const stats = await prisma.folder.aggregate({
        where: { userId },
        _count: true,
        _sum: { size: true },
        _avg: { size: true }
      });
      
      const byType = await prisma.folder.groupBy({
        by: ['mimeType'],
        where: { userId },
        _count: true,
        _sum: { size: true }
      });
      
      return {
        totalFolders: stats._count,
        totalSize: stats._sum.size || 0,
        averageSize: stats._avg.size || 0,
        byType
      };
    } catch (error) {
      logger.error(`Error in getStats: ${error.message}`);
      throw error;
    }
  }



module.exports = FolderModel;