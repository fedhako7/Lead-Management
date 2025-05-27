import { Suspense } from "react"
import LeadsClient from "./leads-client"

export default function LeadsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeadsClient />
    </Suspense>
  )
}
