const Gallery = require("../models/Gallery");
const cloudinary = require("../config/cloudinary");

exports.uploadImage = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    if (!req.file || !req.file.path)
      return res.status(400).json({ msg: "No image uploaded" });

    const newItem = await Gallery.create({
      title,
      description,
      category,
      imageUrl: req.file.path, // Cloudinary URL
      uploadedBy: req.user.id,
    });

    res.json({ msg: "Image uploaded successfully", item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getImages = async (req, res) => {
  try {
    const items = await Gallery.find().populate("uploadedBy", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    const updated = await Gallery.findByIdAndUpdate(
      id,
      { title, description, category },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Item not found" });
    res.json({ msg: "Updated successfully", item: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete gallery item
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Gallery.findById(id);
    if (!item) return res.status(404).json({ msg: "Item not found" });

    // delete from Cloudinary if possible
    if (item.imageUrl) {
      const publicId = item.imageUrl.split("/").pop().split(".")[0]; 
      await cloudinary.uploader.destroy(`virtual_lab_gallery/${publicId}`);
    }

    await item.deleteOne();
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};