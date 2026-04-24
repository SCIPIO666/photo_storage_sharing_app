
const { prisma } = require('../prisma/client');
const CloudinaryService = require('../utils/cloudinary');

class PhotoService {
  static async uploadPhoto(userId, albumId, fileBuffer, originalName, mimeType, size) {
    // Verify album belongs to user
    const album = await prisma.album.findFirst({
      where: { id: albumId, userId },
    });
    if (!album) throw new Error('Album not found or access denied');

    // Upload to Cloudinary
    const { url, publicId } = await CloudinaryService.uploadImage(fileBuffer, userId, albumId);

    // Save to DB
    const photo = await prisma.photo.create({
      data: {
        url,
        publicId,
        filename: originalName,
        size,
        mimeType,
        albumId,
        userId,
      },
    });

    return photo;
  }

  static async deletePhotos(userId, photoIds) {
    // Fetch photos to ensure ownership and get publicIds
    const photos = await prisma.photo.findMany({
      where: {
        id: { in: photoIds },
        userId,
      },
    });

    if (photos.length !== photoIds.length) {
      throw new Error('Some photos not found or not owned by user');
    }

    // Delete from Cloudinary (parallel)
    await Promise.all(photos.map(photo => CloudinaryService.deleteImage(photo.publicId)));

    // Delete from DB
    await prisma.photo.deleteMany({
      where: { id: { in: photoIds }, userId },
    });

    return { deletedCount: photos.length };
  }

  static async getPhotosByAlbum(userId, albumId) {
    const album = await prisma.album.findFirst({
      where: { id: albumId, userId },
      include: { photos: { orderBy: { createdAt: 'desc' } } },
    });
    if (!album) throw new Error('Album not found');
    return album.photos;
  }
}

module.exports = PhotoService;