const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const {
  uploadImage,
  getImages,
  updateImage,
  deleteImage,
} = require("../controllers/galleryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "virtual_lab_gallery",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// Admin-only actions
router.post("/upload", protect(["admin"]), upload.single("image"), uploadImage);
router.put("/:id", protect(["admin"]), updateImage);
router.delete("/:id", protect(["admin"]), deleteImage);

// Public
router.get("/", getImages);

module.exports = router;
