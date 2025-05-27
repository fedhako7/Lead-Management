"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { apiClient, type LeadStatus, type LeadResponse } from "@/lib/api"

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function LeadsClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [leadsData, setLeadsData] = useState<LeadResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Local search state for immediate UI updates
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "")

  // Get current params
  const currentPage = Number(searchParams.get("page")) || 1
  const currentLimit = Number(searchParams.get("limit")) || 10
  const currentSearch = searchParams.get("search") || ""
  const currentStatus = (searchParams.get("status") as LeadStatus | "all") || "all"
  const currentSortBy = (searchParams.get("sortBy") as "name" | "email" | "createdAt") || "createdAt"
  const currentSortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc"

  // Debounce the search input
  const debouncedSearchInput = useDebounce(searchInput, 500)

  const updateSearchParams = useCallback(
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === "all" || (key === "page" && value === 1)) {
          params.delete(key)
        } else {
          params.set(key, value.toString())
        }
      })

      router.push(`/leads?${params.toString()}`)
    },
    [searchParams, router],
  )

  const fetchLeads = useCallback(
    async (isSearching = false) => {
      try {
        if (isSearching) {
          setSearching(true)
        } else {
          setLoading(true)
        }
        setError(null)

        const response = await apiClient.getLeads({
          page: currentPage,
          limit: currentLimit,
          search: currentSearch,
          status: currentStatus,
          sortBy: currentSortBy,
          sortOrder: currentSortOrder,
        })

        if (response.success && response.data) {
          setLeadsData(response.data)
        } else {
          setError(response.error || "Failed to fetch leads")
        }
      } catch (err) {
        setError("Failed to fetch leads")
        console.error("Error fetching leads:", err)
      } finally {
        setLoading(false)
        setSearching(false)
      }
    },
    [currentPage, currentLimit, currentSearch, currentStatus, currentSortBy, currentSortOrder],
  )

  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearchInput !== currentSearch) {
      updateSearchParams({ search: debouncedSearchInput, page: 1 })
    }
  }, [debouncedSearchInput, currentSearch, updateSearchParams])

  // Effect for fetching leads
  useEffect(() => {
    const isSearching = searchInput !== currentSearch
    fetchLeads(isSearching)
  }, [currentPage, currentLimit, currentSearch, currentStatus, currentSortBy, currentSortOrder, fetchLeads])

  // Sync search input with URL params when navigating
  useEffect(() => {
    setSearchInput(currentSearch)
  }, [currentSearch])

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "Engaged":
        return "bg-yellow-100 text-yellow-800"
      case "Proposal Sent":
        return "bg-purple-100 text-purple-800"
      case "Closed-Won":
        return "bg-green-100 text-green-800"
      case "Closed-Lost":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value)
  }

  const handleStatusFilter = (status: LeadStatus | "all") => {
    updateSearchParams({ status, page: 1 })
  }

  const handleLimitChange = (limit: number) => {
    updateSearchParams({ limit, page: 1 })
  }

  const handleSort = (sortBy: "name" | "email" | "createdAt") => {
    const newSortOrder = currentSortBy === sortBy && currentSortOrder === "asc" ? "desc" : "asc"
    updateSearchParams({ sortBy, sortOrder: newSortOrder })
  }

  const handlePageChange = (page: number) => {
    updateSearchParams({ page })
  }

  if (loading && !leadsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !leadsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => fetchLeads()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Management</h1>
            <p className="text-gray-600">Manage and track all your leads in one place</p>
          </div>
          <Link href="/leads/new">
            <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Add New Lead
            </button>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow-lg rounded-lg mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters & Search
              {searching && <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchInput}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {searching && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>

              <select
                value={currentStatus}
                onChange={(e) => handleStatusFilter(e.target.value as LeadStatus | "all")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Engaged">Engaged</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Closed-Won">Closed-Won</option>
                <option value="Closed-Lost">Closed-Lost</option>
              </select>

              <select
                value={currentLimit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={6}>6 per page</option>
                <option value={10}>10 per page</option>
                <option value={18}>18 per page</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSort("name")}
                  className={`flex-1 px-3 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1 ${
                    currentSortBy === "name" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                >
                  Name
                  {currentSortBy === "name" && (
                    <svg
                      className={`h-4 w-4 ${currentSortOrder === "asc" ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => handleSort("createdAt")}
                  className={`flex-1 px-3 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1 ${
                    currentSortBy === "createdAt" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                >
                  Date
                  {currentSortBy === "createdAt" && (
                    <svg
                      className={`h-4 w-4 ${currentSortOrder === "asc" ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        {leadsData && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {["New", "Engaged", "Proposal Sent", "Closed-Won", "Closed-Lost"].map((status) => {
              const count = leadsData.leads.filter((lead) => lead.status === status).length
              return (
                <div key={status} className="bg-white shadow-md rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">{status}</div>
                </div>
              )
            })}
          </div>
        )}

        {/* Leads List */}
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                All Leads ({leadsData?.total || 0})
                {searching && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
              </h2>
              {leadsData && leadsData.totalPages > 1 && (
                <div className="text-sm text-gray-600">
                  Page {leadsData.page} of {leadsData.totalPages}
                </div>
              )}
            </div>
          </div>
          <div className="p-6">
            {!leadsData || leadsData.leads.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-600 mb-4">
                  {currentSearch || currentStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first lead"}
                </p>
                <Link href="/leads/new">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Add Your First Lead
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <div className={`space-y-4 ${searching ? "opacity-75" : ""}`}>
                  {leadsData.leads.map((lead) => (
                    <div
                      key={lead._id}
                      className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              <span>{lead.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {leadsData.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {Array.from({ length: leadsData.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 border rounded-lg ${
                            page === currentPage
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= leadsData.totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
