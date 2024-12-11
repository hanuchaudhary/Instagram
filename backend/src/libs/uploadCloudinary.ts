import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export const uploadOnCloudinary = async (filePath: string, folder: string, resource_type: 'image' | 'video' | 'raw' | 'auto') => {
    try {
        if (!filePath) return null;
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: resource_type, // image, video, raw
            folder: folder,  // Folder name on cloudinary
            quality: "auto:best", // Quality of the media
        });
        console.log("Media Uploaded");

        await fs.unlink(filePath);
        return response;
    } catch (error) {
        await fs.unlink(filePath).catch(err => console.error("Error deleting file:", err));
        console.log("Error while uploading file:", error);
        throw error;
    }
};
