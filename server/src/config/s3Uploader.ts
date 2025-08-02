import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";

// Load config from environment variables
const REGION = process.env.S3_REGION || "af-south-1";
const BUCKET_NAME = process.env.S3_BUCKET_NAME || "linkup-bucket";
const ACCESS_KEY = process.env.S3_ACCESS_KEY || "";
const SECRET_KEY = process.env.S3_SECRET_KEY || "";
const ENDPOINT = process.env.S3_ENDPOINT || null;
const forcePathStyle = !!ENDPOINT;

const s3 = new S3Client({
  region: REGION,
  endpoint: ENDPOINT || undefined,
  forcePathStyle,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

function getMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".mp4":
      return "video/mp4";
    case ".mov":
      return "video/quicktime";
    default:
      return "application/octet-stream";
  }
}

export const s3Service = {
  /**
   * Upload a file buffer to S3 or MinIO.
   * @param fileBuffer File buffer (from multer)
   * @param originalName Original filename (for extension)
   * @param folder Optional S3 folder
   * @returns Public URL of uploaded file
   */
  async uploadFileBufferToS3(
    fileBuffer: Buffer,
    originalName: string,
    folder: string = ""
  ): Promise<string> {
    const ext = path.extname(originalName).toLowerCase();
    const fileName = uuidv4() + ext;
    const s3Key = folder ? `${folder}/${fileName}` : fileName;

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: getMimeType(originalName),
      ACL: ObjectCannedACL.public_read,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    return ENDPOINT
      ? `${ENDPOINT.replace(/\/$/, "")}/${BUCKET_NAME}/${s3Key}`
      : `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${s3Key}`;
  },
};
