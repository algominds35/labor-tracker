"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface JobActionsProps {
  jobId: number
  currentStatus: string
}

export default function JobActions({ jobId, currentStatus }: JobActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggleStatus() {
    setLoading(true)
    const newStatus = currentStatus === "active" ? "archived" : "active"

    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      router.refresh()
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggleStatus}
      disabled={loading}
      className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
    >
      {loading
        ? "..."
        : currentStatus === "active"
        ? "Archive Job"
        : "Unarchive Job"}
    </button>
  )
}
