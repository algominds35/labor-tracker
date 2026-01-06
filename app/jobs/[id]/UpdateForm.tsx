"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface UpdateFormProps {
  jobId: number
  latestUpdate?: {
    actualHours: number
    percentComplete: number
  } | null
}

export default function UpdateForm({ jobId, latestUpdate }: UpdateFormProps) {
  const [actualHours, setActualHours] = useState(
    latestUpdate?.actualHours.toString() || ""
  )
  const [percentComplete, setPercentComplete] = useState(
    latestUpdate?.percentComplete.toString() || ""
  )
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`/api/jobs/${jobId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actualHours: parseFloat(actualHours),
          percentComplete: parseFloat(percentComplete),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Failed to create update")
        setLoading(false)
        return
      }

      router.refresh()
      setLoading(false)
    } catch (err) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="actualHours"
            className="block text-sm font-medium text-gray-700"
          >
            Total Actual Hours to Date
          </label>
          <input
            id="actualHours"
            type="number"
            step="0.1"
            required
            value={actualHours}
            onChange={(e) => setActualHours(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="percentComplete"
            className="block text-sm font-medium text-gray-700"
          >
            Percent Complete (0-100)
          </label>
          <input
            id="percentComplete"
            type="number"
            step="0.1"
            min="0"
            max="100"
            required
            value={percentComplete}
            onChange={(e) => setPercentComplete(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Update"}
      </button>
    </form>
  )
}
