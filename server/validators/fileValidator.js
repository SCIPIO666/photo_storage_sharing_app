// validations/photoValidation.js
const z = require('zod');

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const maxSize = 10 * 1024 * 1024; // 10MB

const fileMetadataSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string().refine((mime) => allowedMimeTypes.includes(mime), {
    message: 'Unsupported file type. Use JPEG, PNG, WEBP, or GIF.',
  }),
  size: z.number().max(maxSize, 'File too large (max 10MB)'),
});

const createAlbumSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

const uploadPhotoSchema = z.object({
  albumId: z.string().cuid(),
});

const deletePhotosSchema = z.object({
  photoIds: z.array(z.string().cuid()).min(1),
});

module.exports = {
  fileMetadataSchema,
  createAlbumSchema,
  uploadPhotoSchema,
  deletePhotosSchema,
};