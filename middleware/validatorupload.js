const { validateMIMEType } = require("validate-image-type");
const { asyncWrapper } = require("../middleware/upload");
asyncWrapper(async (req, res, next, cb) => {
  try {
    const validationResult = await validateMIMEType(req.file.path, {
      originalFilename: req.file.originalname,
      allowMimeTypes: ["image/jpeg", "image/png", "image/svg+xml"],
    });

    if (!validationResult.ok) {
      return res.status(400).json({ message: "Invalid image file type" });
    }

    console.log("upload is checked valid");
    next();
  } catch {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = asyncWrapper;
