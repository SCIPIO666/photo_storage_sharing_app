const { z } = require("zod");

const fileSchema = z.object({
  title: z.string().min(1).optional(), // optional if not always present
  folderId: z.string().optional(),
}).catchall(z.any()); // other form fields to pass through

// separate schema for file upload without title requirement
const fileUploadSchema = z.object({
  title: z.string().optional(),
  folderId: z.string().optional(),
});

module.exports = { fileSchema, fileUploadSchema };