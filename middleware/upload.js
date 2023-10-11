const multer = require("multer");
// const { validateMIMEType } = require("validate-image-type");
// const fs = require('fs');
// ? multer configuration
const imageUserStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/images/users");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + `-${Date.now()}-image-${file.originalname}`);
  },
});
const imageBandStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/images/bands");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + `-${Date.now()}-image-${file.originalname}`);
  },
});
const imageFileFilter = (req, file, cb) => {
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
      new Error(
        "Invalid file type. Only JPEG and PNG and JPG files are allowed."
      ),
      false
    );
    // const error = new Error(
    //   "Invalid file type. Only JPEG and PNG files are allowed."
    // );
    // cb(error, false);
  }
};

const imageUserUpload = multer({
  storage: imageUserStorage,
  limits: {
    fileSize: 1024 * 1024 * 6, // ! 6MB
  },
  fileFilter: imageFileFilter,
});
const imageBandUpload = multer({
  storage: imageBandStorage,
  limits: {
    fileSize: 1024 * 1024 * 6, // ! 6MB
  },
  fileFilter: imageFileFilter,
});

const asyncWrapper = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};
module.exports = { imageUserUpload, imageBandUpload, asyncWrapper };
