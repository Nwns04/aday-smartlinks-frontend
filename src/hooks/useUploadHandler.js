import { useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";

export default function useUploadHandler(setFormDataOrSetter) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file, fieldName) => {
    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

      const res = await API.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        data,
        {
          baseURL: "", // override backend URL
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const transformedUrl = res.data.secure_url.replace(
        "/upload/",
        "/upload/w_300,h_300,c_fill,g_auto/"
      );

      if (typeof setFormDataOrSetter === "function") {
        // If a single state setter (like setProfileImage)
        setFormDataOrSetter(transformedUrl);
      } else {
        // If it's setFormData with a field name
        setFormDataOrSetter((prev) => ({
          ...prev,
          [fieldName]: transformedUrl,
        }));
      }

      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    handleUpload,
  };
}
