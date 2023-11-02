const {
    createUser,
    deleteUser,
    login,
    // getAllFollowers,
    // addFollowers,
    // getAllFollowersuserid,
    // getAllFollowinguserid,
    // unfollowers,
    // checkFollowerprofile,
  } = require("../controller/admin");
  const router = require("express").Router();
  const fs = require("fs");
  const { checkToken } = require("../auth/token_validation");
  const { imageUserUpload, asyncWrapper } = require("../middleware/upload");
  const { validateMIMEType } = require("validate-image-type");
  // ! register
  router.post(
    "/register",
    imageUserUpload.single("avatar"),
    asyncWrapper(async (req, res, next) => {
      try {
        if (!req.file) {
          console.log(req.file);
          // เราสามารถส่งข้อความแสดงข้อผิดพลาดไปยังไคลเอนต์ได้ที่นี่
          return res.status(400).json({
            success: 0,
            message: "Image upload is required",
          });
        }
  
        const validationResult = await validateMIMEType(req.file.path, {
          originalFilename: req.file.originalname,
          allowMimeTypes: [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/jpg",
          ],
        });
  
        if (!validationResult.ok) {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ message: "Invalid image file type" });
        }
        next();
        console.log("upload is checked valid");
      } catch (error) {
        fs.unlinkSync(req.file.path);
        return res.status(500).json({ message: "Internal server error" });
      }
    }),
    createUser
  );
//   router.delete("/", checkToken, deleteUser);
  // router.post("/register", createUser);
  router.post("/login", login);
  module.exports = router;
  