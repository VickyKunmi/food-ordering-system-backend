import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
  getTotalCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import multer from "multer";

const categoryRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

categoryRouter.post("/add", upload.single("image"), addCategory);
categoryRouter.get("/get", getCategory);
categoryRouter.post("/delete", deleteCategory);
categoryRouter.get("/total", getTotalCategory);
categoryRouter.get("/get/:id", getCategoryById);
categoryRouter.put("/update/:id", upload.single("image"), updateCategory)


export default categoryRouter;
