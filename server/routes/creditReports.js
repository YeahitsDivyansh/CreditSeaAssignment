import express from "express";
import {
  uploadXML,
  handleUploadError,
  validateUploadedFile,
} from "../middleware/upload.js";
import XMLParser from "../services/xmlParser.js";
import CreditReport from "../models/CreditReport.js";
import InMemoryCreditReport from "../models/InMemoryCreditReport.js";
import winston from "winston";
import Joi from "joi";
import mongoose from "mongoose";

// Configure logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "credit-reports-api" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

const router = express.Router();
const xmlParser = new XMLParser();

// Check if MongoDB is connected, otherwise use in-memory storage
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

const getCreditReportModel = () => {
  return isMongoConnected() ? CreditReport : InMemoryCreditReport;
};

// Validation schemas
const panValidationSchema = Joi.object({
  pan: Joi.string()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .required()
    .messages({
      "string.pattern.base": "PAN must be in format: ABCDE1234F",
      "any.required": "PAN is required",
    }),
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string()
    .valid("createdAt", "reportDate", "creditScore")
    .default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});

/**
 * @route   POST /api/credit-reports/upload
 * @desc    Upload and process XML credit report file
 * @access  Public
 */
router.post(
  "/upload",
  uploadXML,
  handleUploadError,
  validateUploadedFile,
  async (req, res) => {
    try {
      const { originalname, buffer } = req.file;

      logger.info(`Processing XML file: ${originalname}`);

      // Parse XML file
      const parseResult = await xmlParser.parseCreditReport(
        buffer,
        originalname
      );

      if (!parseResult.success) {
        logger.error(
          `XML parsing failed for ${originalname}:`,
          parseResult.error
        );
        return res.status(400).json({
          success: false,
          message: "Failed to parse XML file",
          error: parseResult.error,
          fileName: originalname,
        });
      }

      // Create new credit report document
      const creditReportData = {
        ...parseResult.data,
        xmlFileName: originalname,
        processingStatus: "completed",
      };

      const CreditReportModel = getCreditReportModel();

      if (isMongoConnected()) {
        const creditReport = new CreditReportModel(creditReportData);
        var savedReport = await creditReport.save();
      } else {
        // Use in-memory storage
        logger.warn("MongoDB not connected, using in-memory storage");
        var savedReport = await CreditReportModel.save(creditReportData);
      }

      logger.info(
        `Credit report saved successfully for PAN: ${savedReport.pan}`
      );

      res.status(201).json({
        success: true,
        message: "XML file processed and credit report saved successfully",
        data: {
          reportId: savedReport._id,
          pan: savedReport.pan,
          name: savedReport.name,
          creditScore: savedReport.creditScore,
          reportDate: savedReport.reportDate,
          fileName: originalname,
        },
      });
    } catch (error) {
      logger.error("Error processing XML upload:", error);

      // Handle validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationErrors,
        });
      }

      // Handle duplicate key errors
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "A credit report with this PAN already exists",
          error: "DUPLICATE_PAN",
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error while processing XML file",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      });
    }
  }
);

/**
 * @route   GET /api/credit-reports
 * @desc    Get all credit reports with pagination and filtering
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = paginationSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const { page, limit, sortBy, sortOrder } = value;
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const CreditReportModel = getCreditReportModel();

    // Get total count
    const totalCount = await CreditReportModel.countDocuments();

    // Get paginated results
    let reports;
    if (isMongoConnected()) {
      reports = await CreditReportModel.find()
        .select("-creditAccounts -addresses") // Exclude large arrays for list view
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
    } else {
      // In-memory pagination
      const allReports = await CreditReportModel.find();
      reports = allReports
        .sort((a, b) => {
          const aVal = a[sortBy];
          const bVal = b[sortBy];
          if (sortOrder === "desc") {
            return bVal > aVal ? 1 : -1;
          }
          return aVal > bVal ? 1 : -1;
        })
        .slice(skip, skip + limit);
    }

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
        },
      },
    });
  } catch (error) {
    logger.error("Error fetching credit reports:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching credit reports",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
});

/**
 * @route   GET /api/credit-reports/:id
 * @desc    Get a specific credit report by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const CreditReportModel = getCreditReportModel();
    const report = await CreditReportModel.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Credit report not found",
        error: "REPORT_NOT_FOUND",
      });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    logger.error(`Error fetching credit report ${req.params.id}:`, error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID format",
        error: "INVALID_ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while fetching credit report",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
});

/**
 * @route   GET /api/credit-reports/pan/:pan
 * @desc    Get credit reports by PAN number
 * @access  Public
 */
router.get("/pan/:pan", async (req, res) => {
  try {
    const { pan } = req.params;

    // Validate PAN format
    const { error } = panValidationSchema.validate({ pan });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid PAN format",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const CreditReportModel = getCreditReportModel();
    const reports = await CreditReportModel.findByPAN(pan);

    res.json({
      success: true,
      data: {
        pan: pan.toUpperCase(),
        reports,
        count: reports.length,
      },
    });
  } catch (error) {
    logger.error(
      `Error fetching credit reports for PAN ${req.params.pan}:`,
      error
    );
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching credit reports",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
});

/**
 * @route   GET /api/credit-reports/pan/:pan/latest
 * @desc    Get the latest credit report by PAN number
 * @access  Public
 */
router.get("/pan/:pan/latest", async (req, res) => {
  try {
    const { pan } = req.params;

    // Validate PAN format
    const { error } = panValidationSchema.validate({ pan });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid PAN format",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const CreditReportModel = getCreditReportModel();
    const report = await CreditReportModel.findLatestByPAN(pan);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "No credit report found for this PAN",
        error: "REPORT_NOT_FOUND",
      });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    logger.error(
      `Error fetching latest credit report for PAN ${req.params.pan}:`,
      error
    );
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching credit report",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
});

/**
 * @route   DELETE /api/credit-reports/:id
 * @desc    Delete a credit report by ID
 * @access  Public
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const CreditReportModel = getCreditReportModel();
    const report = await CreditReportModel.findByIdAndDelete(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Credit report not found",
        error: "REPORT_NOT_FOUND",
      });
    }

    logger.info(`Credit report deleted: ${id}`);

    res.json({
      success: true,
      message: "Credit report deleted successfully",
      data: {
        deletedId: id,
        pan: report.pan,
      },
    });
  } catch (error) {
    logger.error(`Error deleting credit report ${req.params.id}:`, error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID format",
        error: "INVALID_ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while deleting credit report",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong",
    });
  }
});

export default router;
