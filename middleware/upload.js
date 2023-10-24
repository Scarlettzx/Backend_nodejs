const multer = require("multer");
// const path = require("path");
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
const videoUserStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/videos/users");
  },
  filename: (req, file, cb) => {
    cb(null, `user-${Date.now()}`);
  },
});
const videoBandStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/videos/bands");
  },
  filename: (req, file, cb) => {
    cb(null, `band-${Date.now()}`);
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

// ตรวจสอบประเภทของไฟล์วิดีโอ
const videofileFilter = (req, file, cb) => {
  if (file.fieldname === "video" && file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(new Error("รูปแบบไฟล์วิดีโอไม่ถูกต้อง"));
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
const videoUserUpload = multer({
  storage: videoUserStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // ! 6MB
  },
  fileFilter: videofileFilter,
});
const videoBandUpload = multer({
  storage: videoBandStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // ! 6MB
  },
  fileFilter: videofileFilter,
});

const asyncWrapper = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};
module.exports = {
  imageUserUpload,
  imageBandUpload,
  videoUserUpload,
  videoBandUpload,
  asyncWrapper,
};
