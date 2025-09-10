import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/middleware/auth";
import { uploadToCloudinary } from "../../../../lib/utils/cloudinary";

export async function POST(request: NextRequest) {
  const { user, response } = await authenticateRequest(request);

  if (response) {
    return response;
  }

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    console.log("=== UPLOAD REQUEST STARTED ===");
    console.log(
      "Request headers:",
      Object.fromEntries(request.headers.entries())
    );

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("No file provided in upload request");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("File received:", {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });

    // Additional validation
    if (file.size === 0) {
      console.error("File is empty (size 0)");
      return NextResponse.json({ error: "الملف فارغ" }, { status: 400 });
    }

    // Check if file is actually readable
    try {
      const bytes = await file.arrayBuffer();
      console.log("File buffer created successfully, size:", bytes.byteLength);
    } catch (bufferError) {
      console.error("Failed to create file buffer:", bufferError);
      return NextResponse.json(
        { error: "فشل في قراءة الملف. تأكد من أن الملف سليم." },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid file type:", file.type);
      return NextResponse.json(
        {
          error: "نوع الملف غير مدعوم. يُسمح بـ JPEG, PNG, GIF, و WebP فقط.",
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error("File too large:", file.size, "bytes");
      return NextResponse.json(
        { error: "حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Buffer created, size:", buffer.length);
    console.log("File MIME type:", file.type);
    console.log("Uploading to Cloudinary...");

    // Additional validation for Cloudinary requirements
    if (buffer.length === 0) {
      console.error("Buffer is empty");
      return NextResponse.json(
        { error: "الملف فارغ أو تالف" },
        { status: 400 }
      );
    }

    try {
      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(
        buffer,
        "maktabati/products",
        {
          public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`,
          // Remove problematic transformation options
          // quality and format should be applied on delivery, not upload
        },
        file.type // Pass the MIME type
      );

      console.log("Upload successful:", uploadResult.secure_url);
      console.log("=== UPLOAD REQUEST COMPLETED SUCCESSFULLY ===");

      return NextResponse.json({
        message: "تم رفع الملف بنجاح",
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    } catch (cloudinaryError: unknown) {
      console.error("Cloudinary upload error:", cloudinaryError);
      const error = cloudinaryError as {
        message?: string;
        http_code?: number;
        name?: string;
      };
      console.error("Error details:", {
        message: error.message,
        http_code: error.http_code,
        name: error.name,
      });

      return NextResponse.json(
        {
          error: `فشل في رفع الملف إلى خدمة التخزين: ${
            error.message || "خطأ غير معروف"
          }`,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("=== UPLOAD REQUEST FAILED ===");
    console.error("Upload error:", error);
    const err = error as { message?: string; name?: string; stack?: string };
    console.error("Error stack:", err.stack);

    // Provide more specific error messages
    if (err.message && err.message.includes("cloudinary")) {
      return NextResponse.json(
        { error: "خطأ في خدمة رفع الصور. يرجى المحاولة لاحقاً." },
        { status: 500 }
      );
    }

    if (err.message && err.message.includes("buffer")) {
      return NextResponse.json(
        { error: "خطأ في معالجة الملف. تأكد من أن الملف سليم وغير تالف." },
        { status: 400 }
      );
    }

    if (err.name === "TypeError") {
      return NextResponse.json(
        { error: "خطأ في نوع البيانات المرسلة. تأكد من إرسال ملف صورة صحيح." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "فشل في رفع الملف. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}
