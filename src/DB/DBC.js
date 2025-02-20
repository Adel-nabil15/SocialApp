import mongoose from "mongoose";

const checkDBC = async () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/Test")
    .then(() => {
      console.log("DBC is work");
    })
    .catch((err) => {
      console.log("there is error in DBC ");
    });
};

export default checkDBC;
