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
export function convertToHTML(input: string) {
  let html = input;

  // Convert <strong> and <em> tags
  html = html.replace(/<strong>([^<]+)<\/strong>/g, "<strong>$1</strong>");
  html = html.replace(/<em>([^<]+)<\/em>/g, "<em>$1</em>");

  // Convert <p> tags
  html = html.replace(/<p>([^<]+)<\/p>/g, "<p>$1</p>");

  // Convert <ol> and <li> tags
  //@ts-ignore
  html = html.replace(/<ol>(.*?)<\/ol>/gs, "<ol>$1</ol>");
  html = html.replace(/<li>([^<]+)<\/li>/g, "<li>$1</li>");

  // Convert <h2> tags with class attributes
  html = html.replace(/<h2 class="([^"]+)" levels="2">([^<]+)<\/h2>/g, '<h2 class="$1">$2</h2>');

  // Convert <div> tags with class attributes
  html = html.replace(/<div class="([^"]+)">([^<]+)<\/div>/g, '<div class="$1">$2</div>');

  return html;
}
