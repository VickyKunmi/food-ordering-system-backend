import categoryModel from "../models/categoryModel.js";
import fs from "fs";

// add category

const addCategory = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const category = new categoryModel({
    name: req.body.name,
    image: image_filename,
  });
  try {
    await category.save();
    res.json({ success: true, message: "Category Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// get all categories

const getCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.json({ success: true, data: categories });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "unable to get category lists" });
  }
};

// delete category item

const deleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.body.id);
    fs.unlink(`uploads/${category.image}`, () => {});
    await categoryModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Category Deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unable to delete this Category" });
  }
};

// get single category by id
const getCategoryById = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (category) {
      res.json({ success: true, data: category });
    } else {
      res.json({ success: false, message: "Catgory not found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unable to get category Item" });
  }
};

// update category
const updateCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    // update category details
    if (req.body.name) category.name = req.body.name;

    // Handle image update
    if (req.file) {
      // Delete old image file
      fs.unlink(`uploads/${category.image}`, () => {});

      // Update with new image filename
      category.image = req.file.filename;
    }
    await category.save();
    res.json({ success: true, message: "Catgory updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unable to edit category" });
  }
};

const getTotalCategory = async (req, res) => {
  try {
    const count = await categoryModel.countDocuments({});
    res.json({ success: true, totalCategoryList: count });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error retrieving total menu" });
  }
};

export {
  addCategory,
  getCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
  getTotalCategory,
};
