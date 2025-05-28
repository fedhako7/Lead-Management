const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

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
  _id: string
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
      method: options.method || "GET",
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
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("❌ Fetch Error Details:")
      // Type guard to check if error is an instance of Error
      if (error instanceof Error) {
        console.error("- Error Type:", error)

        // Re-throw with more context
        throw new Error(`API Request Failed: ${error.message}`)
      } else {
        // Handle non-Error cases (e.g., string, number, etc.)
        console.error("- Error Type: Unknown")
        throw new Error(`API Request Failed: Unknown error`)
      }
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
