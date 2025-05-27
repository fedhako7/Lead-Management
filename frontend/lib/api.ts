const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface LeadResponse {
  leads: Lead[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Lead {
  _id: string // Changed from id to _id
  name: string
  email: string
  status: LeadStatus
  createdAt: string
  updatedAt: string
}

export type LeadStatus = "New" | "Engaged" | "Proposal Sent" | "Closed-Won" | "Closed-Lost"

export interface LeadQuery {
  page?: number
  limit?: number
  search?: string
  status?: LeadStatus | "all"
  sortBy?: "name" | "email" | "createdAt"
  sortOrder?: "asc" | "desc"
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "An error occurred")
      }

      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async getLeads(query: LeadQuery = {}): Promise<ApiResponse<LeadResponse>> {
    const searchParams = new URLSearchParams()

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const endpoint = `/leads${queryString ? `?${queryString}` : ""}`

    return this.request<LeadResponse>(endpoint)
  }

  async createLead(lead: Omit<Lead, "_id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Lead>> {
    return this.request<Lead>("/leads", {
      method: "POST",
      body: JSON.stringify(lead),
    })
  }

  async getLeadById(id: string): Promise<ApiResponse<Lead>> {
    return this.request<Lead>(`/leads/${id}`)
  }

  async updateLead(id: string, lead: Partial<Lead>): Promise<ApiResponse<Lead>> {
    return this.request<Lead>(`/leads/${id}`, {
      method: "PUT",
      body: JSON.stringify(lead),
    })
  }

  async deleteLead(id: string): Promise<ApiResponse> {
    return this.request(`/leads/${id}`, {
      method: "DELETE",
    })
  }

  async getLeadStats(): Promise<
    ApiResponse<{
      total: number
      statusCounts: Record<LeadStatus, number>
      conversionRate: number
    }>
  > {
    return this.request("/leads/stats")
  }
}

export const apiClient = new ApiClient()
