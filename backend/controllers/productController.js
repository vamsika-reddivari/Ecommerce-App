import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js"; // <-- .js added

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find().sort({ date: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subcategory, sizes, bestseller } = req.body;

    // ✅ Validation
    if (!name || !description || !price || !category || !subcategory || !sizes) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    // ✅ Handle Images
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    // ✅ Upload images to Cloudinary
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    // ✅ Save to MongoDB
    const newProduct = new productModel({
      name,
      description,
      price,
      image: imagesUrl,
      category,
      subCategory: subcategory,
      sizes: JSON.parse(sizes), // Ensure sizes is a JSON string in the request
      bestSeller: bestseller || false,
      date: Date.now(),
    });

    await newProduct.save();

    res.status(201).json({ success: true, message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await productModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };
