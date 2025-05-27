export type LeadStatus = "New" | "Engaged" | "Proposal Sent" | "Closed-Won" | "Closed-Lost"

export interface Lead {
  name: string
  email: string
  status: LeadStatus
  createdAt?: Date
  updatedAt?: Date
}

export interface LeadQuery {
  page?: number
  limit?: number
  search?: string
  status?: LeadStatus | "all"
  sortBy?: "name" | "email" | "createdAt"
  sortOrder?: "asc" | "desc"
}

export interface LeadResponse {
  leads: LeadWithId[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface LeadWithId extends Lead {
  _id: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
