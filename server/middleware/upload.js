import multer from "multer";
import path from "path";
import winston from "winston";

// Configure logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "upload-middleware" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Configure multer for file uploads
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedMimeTypes = [
    "application/xml",
    "text/xml",
    "application/xml-dtd",
    "text/plain",
  ];

  const allowedExtensions = [".xml"];

  // Check MIME type
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Check file extension as fallback
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      const error = new Error("Invalid file type. Only XML files are allowed.");
      error.code = "INVALID_FILE_TYPE";
      cb(error, false);
    }
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 1, // Only allow one file at a time
  },
});

// Middleware to handle file upload
export const uploadXML = upload.single("xmlFile");

// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    logger.error("Multer error:", error);

    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({
          success: false,
          message: "File too large. Maximum size is 10MB.",
          error: "FILE_TOO_LARGE",
        });

      case "LIMIT_FILE_COUNT":
        return res.status(400).json({
          success: false,
          message: "Too many files. Only one file is allowed.",
          error: "TOO_MANY_FILES",
        });

      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({
          success: false,
          message: 'Unexpected field name. Use "xmlFile" as the field name.',
          error: "UNEXPECTED_FIELD",
        });

      default:
        return res.status(400).json({
          success: false,
          message: "File upload error.",
          error: "UPLOAD_ERROR",
        });
    }
  }

  if (error.code === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      success: false,
      message: error.message,
      error: "INVALID_FILE_TYPE",
    });
  }

  // Pass other errors to the next error handler
  next(error);
};

// Middleware to validate uploaded file
export const validateUploadedFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded. Please select an XML file.",
      error: "NO_FILE",
    });
  }

  // Check if file has content
  if (req.file.size === 0) {
    return res.status(400).json({
      success: false,
      message: "Uploaded file is empty.",
      error: "EMPTY_FILE",
    });
  }

  // Log successful file upload
  logger.info(
    `File uploaded successfully: ${req.file.originalname}, Size: ${req.file.size} bytes`
  );

  next();
};

export default upload;
