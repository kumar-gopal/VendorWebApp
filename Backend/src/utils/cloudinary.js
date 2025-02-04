import { v2 as cloudinary } from 'cloudinary';
import { statSync, existsSync, unlinkSync } from 'fs';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, // Cloudinary cloud name from environment variables
  api_key: process.env.API_KEY,       // API key for Cloudinary
  api_secret: process.env.API_SECRET  // API secret for Cloudinary
});

const SIZE_LIMIT = 2 * 1024 * 1024; // 2MB file size limit (in bytes)

// Function to upload multiple images to Cloudinary
const uploadMultipleImagesOnCloudinary = async (localFilePaths) => {
  try {
    // Iterate over each file path in the localFilePaths array and upload them concurrently
    const uploadResults = await Promise.all(
      localFilePaths.map(async (filePath) => {
        try {
          // Validate file size
          const stats = statSync(filePath);  // Get file stats (including size)
          if (stats.size > SIZE_LIMIT) {
            return {
              error: `File ${filePath} exceeds the allowed limit of 2MB. Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
              status: 400,  // Return error if file is too large
            };
          }

          // Upload the image to Cloudinary
          const response = await cloudinary.uploader.upload(filePath, {
            resource_type: 'image',  // Specify the resource type as image
          });

          return response;  // Return the Cloudinary upload response
        } catch (error) {
          return {
            error: error.message || `Failed to upload ${filePath} to Cloudinary.`,
            status: 500,  // Return error if there was an issue uploading
          };
        } finally {
          // Clean up local file (delete after upload)
          if (existsSync(filePath)) {
            unlinkSync(filePath);  // Delete the local file from disk
          }
        }
      })
    );

    return uploadResults;  // Return the results of all upload attempts
  } catch (error) {
    console.error("Error uploading images:", error);  // Log error if something went wrong
    return { error: "Failed to upload images.", status: 500 };  // Return generic failure
  }
};

export default uploadMultipleImagesOnCloudinary;
