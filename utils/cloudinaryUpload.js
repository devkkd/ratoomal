/**
 * Upload files directly to Cloudflare R2 via presigned URLs.
 * This bypasses the Next.js server body size limit entirely —
 * the file goes straight from the browser to R2.
 */
export async function uploadMultipleToCloudinary(files, folder = "products", onProgress = null) {
  try {
    console.log("📤 Starting upload for", files.length, "files");

    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file || !file.type) {
        throw new Error(`Invalid file: ${file?.name || "unknown"}`);
      }

      // Update progress
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: files.length,
          percent: Math.round(((i + 1) / files.length) * 100),
          fileName: file.name,
        });
      }

      // Step 1: Get presigned URL from server
      const presignRes = await fetch("/api/admin/upload-presigned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          folder,
        }),
      });

      if (!presignRes.ok) {
        const text = await presignRes.text();
        throw new Error(`Failed to get upload URL (${presignRes.status}): ${text.substring(0, 200)}`);
      }

      const { presignedUrl, publicUrl } = await presignRes.json();

      // Step 2: Upload directly to R2 — no server size limit!
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error(`R2 upload failed for ${file.name}: ${uploadRes.status} ${uploadRes.statusText}`);
      }

      results.push({
        url: publicUrl,
        type: file.type.startsWith("video") ? "video" : "image",
        originalName: file.name,
        publicId: publicUrl,
        folder,
      });

      console.log(`✅ Uploaded: ${file.name}`);
    }

    console.log(`🎉 Upload completed: ${results.length}/${files.length} files`);
    return results;
  } catch (err) {
    console.error("💥 Upload error:", err);
    throw err;
  }
}

/**
 * Single file upload (for backward compatibility)
 */
export async function uploadToCloudinary(file, folder = "products") {
  const results = await uploadMultipleToCloudinary([file], folder);
  return results[0];
}
