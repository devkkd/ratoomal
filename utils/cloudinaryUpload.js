export async function uploadToCloudinary(file, folder = "products") {
  try {
    // Determine resource type
    const resourceType = file.type.startsWith("video") ? "video" : "image";

    // Get signature from backend
    const signRes = await fetch("/api/admin/cloudinary/signature");
    if (!signRes.ok) throw new Error("Failed to get Cloudinary signature");
    const signData = await signRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", signData.timestamp);
    formData.append("signature", signData.signature);
    formData.append("folder", folder);

    // Cloudinary upload URL
    const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/${resourceType}/upload`;

    const res = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.secure_url) {
      console.error("Cloudinary upload failed:", data);
      throw new Error("Cloudinary upload failed");
    }

    return data.secure_url;
  } catch (err) {
    console.error("Error uploading to Cloudinary:", err);
    throw err;
  }
}
