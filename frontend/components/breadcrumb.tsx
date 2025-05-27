"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname()

  // Generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Dashboard", href: "/" }]

    if (pathSegments.length === 0) {
      return [{ label: "Dashboard" }]
    }

    let currentPath = ""
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`

      let label = segment.charAt(0).toUpperCase() + segment.slice(1)

      // Custom labels for specific routes
      if (segment === "leads" && pathSegments[index + 1] === "new") {
        return // Skip this segment, we'll handle it in the next iteration
      }

      if (segment === "new" && pathSegments[index - 1] === "leads") {
        label = "Add New Lead"
      }

      if (segment === "leads") {
        label = "Lead Management"
      }

      // If it's the last segment, don't include href (current page)
      if (index === pathSegments.length - 1) {
        breadcrumbs.push({ label })
      } else {
        breadcrumbs.push({ label, href: currentPath })
      }
    })

    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg className="w-4 h-4 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}

              {item.href ? (
                <Link href={item.href} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-700 font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
