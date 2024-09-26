import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// get all food items

const getFoods = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unable to get Food List" });
  }
};

// delete food item

const deleteFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unable to delete this Food" });
  }
};

// get single food item by id

const getFoodById = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (food) {
      res.json({ success: true, data: food });
    } else {
      res.json({ success: false, message: "Food not found" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unable to get food item" });
  }
};

// Update Food Item
const updateFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // Update food details
    if (req.body.name) food.name = req.body.name;
    if (req.body.description) food.description = req.body.description;
    if (req.body.price) food.price = req.body.price;
    if (req.body.category) food.category = req.body.category;
    if (req.body.status) food.status = req.body.status;

    // Handle image update
    if (req.file) {
      // Delete old image file
      fs.unlink(`uploads/${food.image}`, () => {});

      // Update with new image filename
      food.image = req.file.filename;
    }

    await food.save();
    res.json({ success: true, message: "Food updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Unable to update food item" });
  }
};

const getFoodsByCategory = async (req, res) => {
  // const category = req.params.category.trim();
  const category = req.params.category.trim().toLowerCase();

  console.log("Fetching foods for category:", category);
  try {
    // const foods = await foodModel.find({ category: category });
    const foods = await foodModel.find({
      category: { $regex: new RegExp(category, "i") },
    });

    console.log("Foods found:", foods);
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Unable to get food items for this category",
    });
  }
};

const getTotalFood = async (req, res) => {
  try {
    const count = await foodModel.countDocuments({});
    res.json({ success: true, totalFoodList: count });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error retrieving total menu" });
  }
};

export {
  addFood,
  getFoods,
  deleteFood,
  getFoodById,
  updateFood,
  getFoodsByCategory,
  getTotalFood,
};
