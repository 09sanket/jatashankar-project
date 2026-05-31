export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Uploads an image to Cloudinary using the unsigned upload API.
 * Performs client-side validations on file type and file size first.
 * 
 * @param file The image File object to upload
 * @returns A promise resolving to the uploaded image URL and publicId
 */
import { env } from "../lib/env";

export async function uploadImage(file: File): Promise<CloudinaryUploadResult> {
  // 1. Validate configuration
  const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // 2. Validate file existence
  if (!file) {
    throw new Error("No file was provided for upload.");
  }

  // 3. Validate file size (Max 5MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File is too large. Maximum allowed size is 5MB.");
  }

  // 4. Validate file type / extension
  const fileType = file.type?.toLowerCase();
  const fileName = file.name?.toLowerCase();
  const fileExtension = fileName ? fileName.substring(fileName.lastIndexOf(".")) : "";

  const isValidMime = ALLOWED_MIME_TYPES.includes(fileType);
  const isValidExt = ALLOWED_EXTENSIONS.includes(fileExtension);

  if (!isValidMime && !isValidExt) {
    throw new Error(
      "Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed."
    );
  }

  // 5. Build FormData for unsigned Cloudinary upload
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || `HTTP error! Status: ${response.status}`;
      throw new Error(`Cloudinary upload failed: ${errorMsg}`);
    }

    const result = await response.json();

    if (!result.secure_url || !result.public_id) {
      throw new Error("Cloudinary response is missing secure_url or public_id.");
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload failure:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during the image upload.");
  }
}
