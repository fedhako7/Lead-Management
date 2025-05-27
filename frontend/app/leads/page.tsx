import { Suspense } from "react"
import LeadsClient from "./leads-client"
import Breadcrumb from "@/components/breadcrumb"

export default function LeadsPage() {
  return (
    <>
      <Breadcrumb />
      <Suspense fallback={<div>Loading...</div>}>
        <LeadsClient />
      </Suspense>
    </>
  )
}
