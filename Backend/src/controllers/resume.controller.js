const cloudinary = require("../uploads/cloudinary");
const fs = require("fs");

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary as RAW
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "resumes",
    });

    // Remove file from local storage after upload
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      message: "Resume uploaded successfully",
      fileUrl: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Upload failed" });
  }
};
