import express from "express";
import {
  addFood,
  deleteFood,
  getFoods,
  getFoodById,
  updateFood,
  getFoodsByCategory,
  getTotalFood,
} from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// image storage

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/addFood", upload.single("image"), addFood);
foodRouter.get("/getFoods", getFoods);
foodRouter.post("/deleteFood", deleteFood);
foodRouter.get("/total", getTotalFood);
foodRouter.get("/getFood/:id", getFoodById);
foodRouter.put("/updateFood/:id", upload.single("image"), updateFood);
foodRouter.get("/get/:category", getFoodsByCategory);


export default foodRouter;

