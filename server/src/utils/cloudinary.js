import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return;

    //upload to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "Lokalo",
    });
    //file hass been uploaded
    console.log("file uploaded successfully", response.url);

    fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload operation is successful

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove file from local storage
    console.error("Error while uploading file to cloudinary", error);

    return null;
  }
};

export { uploadOnCloudinary };
