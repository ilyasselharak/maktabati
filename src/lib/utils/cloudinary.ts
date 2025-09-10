import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

interface CloudinaryUploadOptions {
  folder: string;
  resource_type: "raw" | "auto" | "image" | "video";
  public_id?: string;
  quality?: string | number;
  format?: string;
  [key: string]: string | number | boolean | undefined;
}

export const uploadToCloudinary = async (
  file: Buffer | string,
  folder: string = "maktabati/products",
  options: Record<string, string | number | boolean> = {},
  mimeType?: string
): Promise<CloudinaryUploadResult> => {
  try {
    const defaultOptions: CloudinaryUploadOptions = {
      folder,
      resource_type: "auto",
      ...options,
    };

    console.log("Cloudinary config check:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing",
      api_key: process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing",
    });

    // Check for any invalid transformation options
    const invalidOptions = Object.keys(defaultOptions).filter(
      (key) =>
        defaultOptions[key] === "auto" && !["resource_type"].includes(key)
    );

    if (invalidOptions.length > 0) {
      console.warn(
        "⚠️  Potentially invalid transformation options:",
        invalidOptions
      );
      console.warn("These options should be applied on delivery, not upload");
    }

    let result;

    if (file instanceof Buffer) {
      // For Buffer uploads, use the direct upload method with proper parameters
      console.log("Using Buffer upload method...");
      console.log("MIME type provided:", mimeType);

      // Determine the correct data URI prefix based on MIME type
      let dataUriPrefix = "data:image/jpeg;base64,"; // default

      if (mimeType) {
        if (mimeType === "image/png") {
          dataUriPrefix = "data:image/png;base64,";
        } else if (mimeType === "image/gif") {
          dataUriPrefix = "data:image/gif;base64,";
        } else if (mimeType === "image/webp") {
          dataUriPrefix = "data:image/webp;base64,";
        } else if (mimeType === "image/jpg" || mimeType === "image/jpeg") {
          dataUriPrefix = "data:image/jpeg;base64,";
        }
      }

      console.log("Using data URI prefix:", dataUriPrefix);

      // Convert buffer to base64 data URI for Cloudinary
      const base64Data = `${dataUriPrefix}${file.toString("base64")}`;

      result = await cloudinary.uploader.upload(base64Data, {
        ...defaultOptions,
        resource_type: "image",
      });
    } else {
      // For string paths
      if (typeof file !== "string") {
        throw new Error("Expected file path as string, but received Buffer");
      }
      result = await cloudinary.uploader.upload(file, defaultOptions);
    }

    console.log("Cloudinary upload result:", {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error: unknown) {
    console.error("Cloudinary upload error:", error);
    const err = error as {
      message?: string;
      http_code?: number;
      name?: string;
      stack?: string;
    };
    console.error("Error details:", {
      message: err.message,
      http_code: err.http_code,
      name: err.name,
      stack: err.stack,
    });
    throw new Error(`فشل رفع الصورة: ${err.message || "خطأ غير معروف"}`);
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete image");
  }
};

export const getCloudinaryUrl = (
  publicId: string,
  options: Record<string, string | number | boolean> = {}
): string => {
  const defaultOptions = {
    secure: true,
    ...options,
  };

  return cloudinary.url(publicId, defaultOptions);
};
