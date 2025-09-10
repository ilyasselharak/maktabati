"use client";
import { useState } from "react";
import Image from "next/image";

export default function TestUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<{
    message: string;
    url: string;
    publicId: string;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError("");
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError("");

    console.log(
      "Starting upload for file:",
      selectedFile.name,
      selectedFile.type,
      selectedFile.size
    );

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const token = localStorage.getItem("adminToken");
      console.log("Using auth token:", token ? "Present" : "Missing");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response data:", result);

      if (response.ok) {
        setUploadResult(result);
        console.log("Upload successful:", result);
      } else {
        setError(result.error || "Upload failed");
        console.error("Upload failed:", result);
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            اختبار رفع الصور
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اختر صورة
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            {selectedFile && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  معلومات الملف:
                </h3>
                <p className="text-sm text-gray-600">
                  الاسم: {selectedFile.name}
                </p>
                <p className="text-sm text-gray-600">
                  الحجم: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-sm text-gray-600">
                  النوع: {selectedFile.type}
                </p>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "جاري الرفع..." : "رفع الصورة"}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="font-medium">خطأ:</p>
                <p>{error}</p>
              </div>
            )}

            {uploadResult && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                <p className="font-medium mb-2">تم الرفع بنجاح!</p>
                <p className="text-sm">الرابط: {uploadResult.url}</p>
                <p className="text-sm">المعرف: {uploadResult.publicId}</p>
                {uploadResult.url && (
                  <div className="mt-3">
                    <Image
                      src={uploadResult.url}
                      alt="Uploaded"
                      width={300}
                      height={200}
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
