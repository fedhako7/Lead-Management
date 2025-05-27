"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadStats = exports.deleteLead = exports.updateLead = exports.getLeadById = exports.createLead = exports.getLeads = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const getLeads = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", status = "all", sortBy = "createdAt", sortOrder = "desc", } = req.query;
        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.max(1, Math.min(50, Number(limit))); // Max 50 items per page
        const skip = (pageNum - 1) * limitNum;
        // Build query
        const query = {};
        // Search functionality
        if (search && search.trim()) {
            query.$or = [
                { name: { $regex: search.trim(), $options: "i" } },
                { email: { $regex: search.trim(), $options: "i" } },
            ];
        }
        // Status filter
        if (status && status !== "all") {
            query.status = status;
        }
        // Sort configuration
        const sortConfig = {};
        sortConfig[sortBy] = sortOrder === "asc" ? 1 : -1;
        // Execute queries
        const [leads, total] = await Promise.all([
            Lead_1.default.find(query).sort(sortConfig).skip(skip).limit(limitNum).lean(),
            Lead_1.default.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / limitNum);
        // Transform leads to include id instead of _id
        const transformedLeads = leads.map((lead) => ({
            _id: lead._id.toString(),
            name: lead.name,
            email: lead.email,
            status: lead.status,
            createdAt: lead.createdAt,
            updatedAt: lead.updatedAt,
        }));
        const response = {
            success: true,
            data: {
                leads: transformedLeads,
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
            },
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error fetching leads:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};
exports.getLeads = getLeads;
const createLead = async (req, res) => {
    try {
        const { name, email, status } = req.body;
        // Validation
        if (!name || !email) {
            res.status(400).json({
                success: false,
                error: "Name and email are required",
            });
            return;
        }
        // Check if email already exists
        const existingLead = await Lead_1.default.findOne({ email: email.toLowerCase() });
        if (existingLead) {
            res.status(400).json({
                success: false,
                error: "A lead with this email already exists",
            });
            return;
        }
        const lead = new Lead_1.default({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            status: status || "New",
        });
        const savedLead = await lead.save();
        const response = {
            success: true,
            data: savedLead,
            message: "Lead created successfully",
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error("Error creating lead:", error);
        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({
                success: false,
                error: validationErrors.join(", "),
            });
        }
        else if (error.code === 11000) {
            res.status(400).json({
                success: false,
                error: "A lead with this email already exists",
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    }
};
exports.createLead = createLead;
const getLeadById = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead_1.default.findById(id);
        if (!lead) {
            res.status(404).json({
                success: false,
                error: "Lead not found",
            });
            return;
        }
        const response = {
            success: true,
            data: lead,
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error fetching lead:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};
exports.getLeadById = getLeadById;
const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, status } = req.body;
        const lead = await Lead_1.default.findById(id);
        if (!lead) {
            res.status(404).json({
                success: false,
                error: "Lead not found",
            });
            return;
        }
        // Check if email is being changed and if it already exists
        if (email && email.toLowerCase() !== lead.email) {
            const existingLead = await Lead_1.default.findOne({
                email: email.toLowerCase(),
                _id: { $ne: id },
            });
            if (existingLead) {
                res.status(400).json({
                    success: false,
                    error: "A lead with this email already exists",
                });
                return;
            }
        }
        const updatedLead = await Lead_1.default.findByIdAndUpdate(id, {
            ...(name && { name: name.trim() }),
            ...(email && { email: email.toLowerCase().trim() }),
            ...(status && { status }),
        }, { new: true, runValidators: true });
        const response = {
            success: true,
            data: updatedLead,
            message: "Lead updated successfully",
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error updating lead:", error);
        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({
                success: false,
                error: validationErrors.join(", "),
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    }
};
exports.updateLead = updateLead;
const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead_1.default.findByIdAndDelete(id);
        if (!lead) {
            res.status(404).json({
                success: false,
                error: "Lead not found",
            });
            return;
        }
        const response = {
            success: true,
            message: "Lead deleted successfully",
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error deleting lead:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};
exports.deleteLead = deleteLead;
const getLeadStats = async (req, res) => {
    try {
        const stats = await Lead_1.default.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);
        const total = await Lead_1.default.countDocuments();
        const statusCounts = {
            New: 0,
            Engaged: 0,
            "Proposal Sent": 0,
            "Closed-Won": 0,
            "Closed-Lost": 0,
        };
        stats.forEach((stat) => {
            statusCounts[stat._id] = stat.count;
        });
        const conversionRate = total > 0 ? Math.round((statusCounts["Closed-Won"] / total) * 100) : 0;
        const response = {
            success: true,
            data: {
                total,
                statusCounts,
                conversionRate,
            },
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error fetching lead stats:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};
exports.getLeadStats = getLeadStats;
//# sourceMappingURL=leadController.js.map