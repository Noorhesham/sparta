export const uploadImageToImageKit = async (file: File | Blob) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file instanceof File ? file.name : "uploaded_image");

  const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

  const response = await fetch(IMAGEKIT_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY + ":")}`, // Encode API key
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to upload image to ImageKit");
  }

  return response.json(); // Returns { url, fileId }
};
