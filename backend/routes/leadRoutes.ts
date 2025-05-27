import { Router } from "express"
import { getLeads, createLead, getLeadById, updateLead, deleteLead, getLeadStats } from "../controllers/leadController"

const router = Router()

// GET /api/leads - Get all leads with pagination, search, filter, sort
router.get("/", getLeads)

// GET /api/leads/stats - Get lead statistics
router.get("/stats", getLeadStats)

// GET /api/leads/:id - Get single lead by ID
router.get("/:id", getLeadById)

// POST /api/leads - Create new lead
router.post("/", createLead)

// PUT /api/leads/:id - Update lead
router.put("/:id", updateLead)

// DELETE /api/leads/:id - Delete lead
router.delete("/:id", deleteLead)

export default router
