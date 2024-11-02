import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export const uploadOnCloudinary = async (filePath: any) => {
    try {
        if (!filePath) return null;
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "image",
            folder: "uploads"
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
