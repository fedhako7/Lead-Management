export type LeadStatus = "New" | "Engaged" | "Proposal Sent" | "Closed-Won" | "Closed-Lost"

export interface Lead {
  id: string
  name: string
  email: string
  status: LeadStatus
  createdAt: string
}
