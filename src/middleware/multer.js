import multer from "multer";
import { nanoid } from "nanoid";
import fs from "fs";

export const fileType = {
  images: ["image/png", "image/jpeg"],
};

export const multerstore = (typeFile = [], custompath = "original") => {
  const fullPath = `uploads/${custompath}`;
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      return cb(null, nanoid(5) + "___" + file.originalname);
    },
  });
  function fileFilter(req, file, cb) {
    if (typeFile.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("soory not allow this file type"), false);
    }
  }
  return multer({ storage, fileFilter });
};

export const multerHost = (typeFile = []) => {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (typeFile.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("soory not allow this file type"), false);
    }
  }
  return multer({ storage, fileFilter });
};
