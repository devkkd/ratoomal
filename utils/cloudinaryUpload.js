// export async function uploadToCloudinary(file, folder = "products") {
//   try {
//     // Determine resource type
//     const resourceType = file.type.startsWith("video") ? "video" : "image";

//     // Get signature from backend
//     const signRes = await fetch("/api/admin/cloudinary/signature");
//     if (!signRes.ok) throw new Error("Failed to get Cloudinary signature");
//     const signData = await signRes.json();

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("api_key", signData.apiKey);
//     formData.append("timestamp", signData.timestamp);
//     formData.append("signature", signData.signature);
//     formData.append("folder", folder);

//     // Cloudinary upload URL
//     const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/${resourceType}/upload`;

//     const res = await fetch(uploadUrl, {
//       method: "POST",
//       body: formData,
//     });

//     const data = await res.json();

//     if (!data.secure_url) {
//       console.error("Cloudinary upload failed:", data);
//       throw new Error("Cloudinary upload failed");
//     }

//     return data.secure_url;
//   } catch (err) {
//     console.error("Error uploading to Cloudinary:", err);
//     throw err;
//   }
// }
/**
 * Upload files using server-side API (recommended)
 */
export async function uploadMultipleToCloudinary(files, folder = "products", onProgress = null) {
  try {
    console.log('📤 Starting upload for', files.length, 'files');
    
    const results = [];
    const totalFiles = files.length;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file || !file.type) {
        throw new Error(`Invalid file: ${file?.name || 'unknown'}`);
      }

      // Update progress
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: totalFiles,
          percent: Math.round(((i + 1) / totalFiles) * 100),
          fileName: file.name
        });
      }

      // Use server-side API for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        results.push({
          url: data.url,
          type: file.type.startsWith('video') ? 'video' : 'image',
          originalName: file.name,
          publicId: data.publicId || '',
          folder: folder
        });
        console.log(`✅ Uploaded: ${file.name}`);
      } else {
        console.error('❌ Upload failed:', data);
        throw new Error(`Failed to upload ${file.name}: ${data.error || 'Unknown error'}`);
      }
    }

    console.log(`🎉 Upload completed: ${results.length}/${files.length} files`);
    return results;

  } catch (err) {
    console.error('💥 Upload error:', err);
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