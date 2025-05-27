"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    // Mongoose validation error
    if (err.name === "ValidationError") {
        const validationErrors = Object.values(err.errors).map((error) => error.message);
        res.status(400).json({
            success: false,
            error: validationErrors.join(", "),
        });
        return;
    }
    // Mongoose duplicate key error
    if (err.code === 11000) {
        res.status(400).json({
            success: false,
            error: "Duplicate field value entered",
        });
        return;
    }
    // Mongoose cast error
    if (err.name === "CastError") {
        res.status(400).json({
            success: false,
            error: "Invalid ID format",
        });
        return;
    }
    // Default error
    res.status(500).json({
        success: false,
        error: "Internal server error",
    });
};
exports.errorHandler = errorHandler;
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`,
    });
};
exports.notFound = notFound;
//# sourceMappingURL=errorHandler.js.map