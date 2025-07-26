import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import path from "path";

export const s3 = new S3Client({
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true, // TODO: configure this based on S3 setup, not needed when using s3 bucket with AWS
    // but required for  minio
});

export async function uploadImage() {
  const filePath = path.resolve(__dirname, "example.png");
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: "example.jpg",
    Body: fileStream,
    ContentType: "image/png",
  };

  await s3.send(new PutObjectCommand(uploadParams));
}
uploadImage();



