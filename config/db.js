import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://victoryoyekunleolamide:foodOrderingSys123@cluster0.lrota.mongodb.net/FoodOrderingSystem"
    )
    .then(() => console.log("DB Connected"));
};
