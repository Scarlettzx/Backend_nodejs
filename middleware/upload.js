const multer = require("multer");
const { validateMIMEType } = require("validate-image-type");
// const fs = require('fs');
// ? multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + `-${Date.now()}-image-${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg"
  ) {
    console.log(file);
    cb(null, true);
  } else {
    console.log(file.originalname);
    console.log(file);
    cb(
      // null,
      new Error("Invalid file type. Only JPEG and PNG and JPG files are allowed."),
      false
    );
    // const error = new Error(
    //   "Invalid file type. Only JPEG and PNG files are allowed."
    // );
    // cb(error, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
  fileFilter: fileFilter,
});
const asyncWrapper = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};
module.exports = { upload, asyncWrapper };
