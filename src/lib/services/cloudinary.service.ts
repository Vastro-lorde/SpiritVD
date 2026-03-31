import { v2 as cloudinary } from "cloudinary";
import { getEnv } from "@/lib/config/env";

function getClient() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    getEnv();
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

export async function uploadImage(
  fileBuffer: Buffer,
  folder: string
): Promise<{ url: string; publicId: string }> {
  const client = getClient();

  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      { folder: `spiritvd/${folder}`, resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(fileBuffer);
  });
}

export async function uploadResume(
  fileBuffer: Buffer,
  originalFilename: string
): Promise<{ url: string; publicId: string }> {
  const client = getClient();
  const safeName = originalFilename.replace(/[^a-zA-Z0-9._-]/g, "_");

  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: "spiritvd/resumes",
        resource_type: "raw",
        public_id: safeName,
        overwrite: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(fileBuffer);
  });
}

export async function deleteAsset(publicId: string): Promise<void> {
  const client = getClient();
  await client.uploader.destroy(publicId);
}
