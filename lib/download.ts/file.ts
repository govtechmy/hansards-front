import axios from "axios";
const API_URL = process.env.API_URL;
const PATH = `api/file/download`;

export const getPresignedUrl = async (url: string) => {
  try {
    const response = await axios.post(`${API_URL}${PATH}`, { url });
    return response.data.url as string;
  } catch (error) {
    console.error("Error fetching presigned URL:", error);
    return url;
  }
};

export const generateDownloadLink = async (fileName: string, url: string) => {
  if (!url) {
    console.error("No URL provided for download.");
    return;
  }

  const presignedUrl = await getPresignedUrl(url);
  const link = document.createElement("a");
  link.href = presignedUrl;
  link.download = fileName;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
