import Link from "next/link"
import { apiClient } from "@/lib/api"
import Breadcrumb from "@/components/breadcrumb"

export default async function HomePage() {
  let stats = {
    total: 0,
    statusCounts: {
      New: 0,
      Engaged: 0,
      "Proposal Sent": 0,
      "Closed-Won": 0,
      "Closed-Lost": 0,
    },
    conversionRate: 0,
  }

  let recentLeads: any[] = []

  try {
    // Fetch stats
    const statsResponse = await apiClient.getLeadStats()
    if (statsResponse.success && statsResponse.data) {
      stats = statsResponse.data
    }

    // Fetch recent leads
    const leadsResponse = await apiClient.getLeads({ limit: 5, sortBy: "createdAt", sortOrder: "desc" })
    if (leadsResponse.success && leadsResponse.data) {
      recentLeads = leadsResponse.data.leads
    }
  } catch (error) {
    console.error("Error fetching data:", error)
  }

  return (
    <>
      <Breadcrumb />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to LeadFlow</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your comprehensive lead tracking and management dashboard
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Total Leads</h3>
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-xs text-gray-500">Active leads in pipeline</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">New Leads</h3>
                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.statusCounts.New}</div>
              <p className="text-xs text-gray-500">Awaiting first contact</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Closed Won</h3>
                <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.statusCounts["Closed-Won"]}</div>
              <p className="text-xs text-gray-500">Successfully converted</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
                <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-2xl font-bold text-orange-600">{stats.conversionRate}%</div>
              <p className="text-xs text-gray-500">Lead to customer ratio</p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl rounded-lg p-8">
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <h2 className="text-2xl font-bold">Add New Lead</h2>
              </div>
              <p className="text-blue-100 mb-6">Capture new potential customers and start building relationships</p>
              <p className="mb-6 text-blue-50">
                Quickly add new leads to your pipeline with our streamlined form. Track their progress from initial
                contact to closed deals.
              </p>
              <Link href="/leads/new">
                <button className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                  Create New Lead
                </button>
              </Link>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl rounded-lg p-8">
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h2 className="text-2xl font-bold">View All Leads</h2>
              </div>
              <p className="text-purple-100 mb-6">Monitor and manage your entire lead database</p>
              <p className="mb-6 text-purple-50">
                Access your complete lead database with advanced filtering and sorting options. Track status changes and
                manage your sales pipeline effectively.
              </p>
              <Link href="/leads">
                <button className="w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                  View Lead List
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow-lg rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <p className="text-gray-600">Latest updates from your lead pipeline</p>
            </div>
            <div className="p-6">
              {recentLeads.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div key={lead._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{lead.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-sm text-gray-500">{lead.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.status === "Closed-Won"
                              ? "bg-green-100 text-green-800"
                              : lead.status === "Closed-Lost"
                                ? "bg-red-100 text-red-800"
                                : lead.status === "New"
                                  ? "bg-blue-100 text-blue-800"
                                  : lead.status === "Engaged"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {lead.status}
                        </span>
                        <span className="text-sm text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
