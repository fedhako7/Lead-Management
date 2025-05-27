import type { Request, Response } from "express"
import Lead from "../models/Lead"
import type { LeadQuery, LeadResponse, ApiResponse, LeadWithId } from "../types"

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "all",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query as LeadQuery

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.max(1, Math.min(50, Number(limit))) // Max 50 items per page
    const skip = (pageNum - 1) * limitNum

    // Build query
    const query: any = {}

    // Search functionality
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ]
    }

    // Status filter
    if (status && status !== "all") {
      query.status = status
    }

    // Sort configuration
    const sortConfig: any = {}
    sortConfig[sortBy as string] = sortOrder === "asc" ? 1 : -1

    // Execute queries
    const [leads, total] = await Promise.all([
      Lead.find(query).sort(sortConfig).skip(skip).limit(limitNum).lean(),
      Lead.countDocuments(query),
    ])

    const totalPages = Math.ceil(total / limitNum)

    // Transform leads to include id instead of _id
    const transformedLeads: LeadWithId[] = leads.map((lead: any) => ({
      _id: lead._id.toString(),
      name: lead.name,
      email: lead.email,
      status: lead.status,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    }))

    const response: ApiResponse<LeadResponse> = {
      success: true,
      data: {
        leads: transformedLeads,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    }

    res.status(200).json(response)
  } catch (error) {
    console.error("Error fetching leads:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, status } = req.body

    // Validation
    if (!name || !email) {
      res.status(400).json({
        success: false,
        error: "Name and email are required",
      })
      return
    }

    // Check if email already exists
    const existingLead = await Lead.findOne({ email: email.toLowerCase() })
    if (existingLead) {
      res.status(400).json({
        success: false,
        error: "A lead with this email already exists",
      })
      return
    }

    const lead = new Lead({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      status: status || "New",
    })

    const savedLead = await lead.save()

    const response: ApiResponse = {
      success: true,
      data: savedLead,
      message: "Lead created successfully",
    }

    res.status(201).json(response)
  } catch (error: any) {
    console.error("Error creating lead:", error)

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      res.status(400).json({
        success: false,
        error: validationErrors.join(", "),
      })
    } else if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: "A lead with this email already exists",
      })
    } else {
      res.status(500).json({
        success: false,
        error: "Internal server error",
      })
    }
  }
}

export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const lead = await Lead.findById(id)

    if (!lead) {
      res.status(404).json({
        success: false,
        error: "Lead not found",
      })
      return
    }

    const response: ApiResponse = {
      success: true,
      data: lead,
    }

    res.status(200).json(response)
  } catch (error) {
    console.error("Error fetching lead:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name, email, status } = req.body

    const lead = await Lead.findById(id)

    if (!lead) {
      res.status(404).json({
        success: false,
        error: "Lead not found",
      })
      return
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase() !== lead.email) {
      const existingLead = await Lead.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      })

      if (existingLead) {
        res.status(400).json({
          success: false,
          error: "A lead with this email already exists",
        })
        return
      }
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      {
        ...(name && { name: name.trim() }),
        ...(email && { email: email.toLowerCase().trim() }),
        ...(status && { status }),
      },
      { new: true, runValidators: true },
    )

    const response: ApiResponse = {
      success: true,
      data: updatedLead,
      message: "Lead updated successfully",
    }

    res.status(200).json(response)
  } catch (error: any) {
    console.error("Error updating lead:", error)

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      res.status(400).json({
        success: false,
        error: validationErrors.join(", "),
      })
    } else {
      res.status(500).json({
        success: false,
        error: "Internal server error",
      })
    }
  }
}

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const lead = await Lead.findByIdAndDelete(id)

    if (!lead) {
      res.status(404).json({
        success: false,
        error: "Lead not found",
      })
      return
    }

    const response: ApiResponse = {
      success: true,
      message: "Lead deleted successfully",
    }

    res.status(200).json(response)
  } catch (error) {
    console.error("Error deleting lead:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}

export const getLeadStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    const total = await Lead.countDocuments()

    const statusCounts = {
      New: 0,
      Engaged: 0,
      "Proposal Sent": 0,
      "Closed-Won": 0,
      "Closed-Lost": 0,
    }

    stats.forEach((stat) => {
      statusCounts[stat._id as keyof typeof statusCounts] = stat.count
    })

    const conversionRate = total > 0 ? Math.round((statusCounts["Closed-Won"] / total) * 100) : 0

    const response: ApiResponse = {
      success: true,
      data: {
        total,
        statusCounts,
        conversionRate,
      },
    }

    res.status(200).json(response)
  } catch (error) {
    console.error("Error fetching lead stats:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
}
