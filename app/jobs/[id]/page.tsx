"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Job = {
  id: number
  name: string
  estimatedHours: number
  expectedWeeks: number
  status: string
  createdAt: string
  updates: WeeklyUpdate[]
}

type WeeklyUpdate = {
  id: number
  actualHours: number
  percentComplete: number
  createdAt: string
}

type Stats = {
  currentWeek: number
  totalHours: number
  percentComplete: number
  plannedUsage: number
  laborVariance: number
  variancePercent: number
  status: string
  projectedTotal: number
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [jobId, setJobId] = useState<string>("")
  const [job, setJob] = useState<Job | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [formData, setFormData] = useState({
    actualHours: "",
    percentComplete: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    params.then(p => setJobId(p.id))
  }, [params])

  useEffect(() => {
    if (jobId) {
      fetchJob()
    }
  }, [jobId])

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`)
      if (!res.ok) throw new Error("Failed to fetch job")
      const data = await res.json()
      setJob(data.job)
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load job")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch(`/api/jobs/${jobId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actualHours: parseFloat(formData.actualHours),
          percentComplete: parseFloat(formData.percentComplete),
        }),
      })

      if (!res.ok) throw new Error("Failed to create update")

      setFormData({ actualHours: "", percentComplete: "" })
      setShowUpdateForm(false)
      fetchJob() // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create update")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "green":
        return "bg-green-100 text-green-800 border-green-300"
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "red":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "green":
        return "✓ On Track"
      case "yellow":
        return "⚠ Watch"
      case "red":
        return "⚠️ Action Needed"
      default:
        return "Unknown"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-red-800">{error || "Job not found"}</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:underline"
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:underline mb-4"
          >
            ← Back to Jobs
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{job.name}</h1>
          <p className="text-gray-600 mt-1">
            {job.estimatedHours} hours estimated • {job.expectedWeeks} weeks expected
          </p>
        </div>

        {/* Status Card */}
        {stats && (
          <div className={`border-2 rounded-lg p-6 mb-6 ${getStatusColor(stats.status)}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{getStatusText(stats.status)}</h2>
                <p className="text-sm mt-1">Week {stats.currentWeek} of {job.expectedWeeks}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.percentComplete}%</div>
                <div className="text-sm">Complete</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Hours Used:</p>
                <p>{stats.totalHours} / {job.estimatedHours}</p>
              </div>
              <div>
                <p className="font-semibold">Variance:</p>
                <p>{stats.laborVariance > 0 ? "+" : ""}{stats.laborVariance.toFixed(1)} hrs ({stats.variancePercent > 0 ? "+" : ""}{stats.variancePercent.toFixed(1)}%)</p>
              </div>
              <div>
                <p className="font-semibold">Planned Usage:</p>
                <p>{stats.plannedUsage.toFixed(1)} hrs</p>
              </div>
              <div>
                <p className="font-semibold">Projected Total:</p>
                <p>{stats.projectedTotal.toFixed(1)} hrs</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Update Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            {showUpdateForm ? "Cancel" : "+ Add Weekly Update"}
          </button>
        </div>

        {/* Update Form */}
        {showUpdateForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Weekly Update</h3>
            <form onSubmit={handleSubmitUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hours Used This Week
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.actualHours}
                  onChange={(e) => setFormData({ ...formData, actualHours: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., 40"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Percent Complete (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={formData.percentComplete}
                  onChange={(e) => setFormData({ ...formData, percentComplete: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., 25"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {submitting ? "Saving..." : "Save Update"}
              </button>
            </form>
          </div>
        )}

        {/* Updates History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">Update History</h3>
          </div>
          <div className="p-6">
            {job.updates.length === 0 ? (
              <p className="text-gray-600">No updates yet. Add your first weekly update above.</p>
            ) : (
              <div className="space-y-4">
                {job.updates.map((update, index) => (
                  <div key={update.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">Week {index + 1}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(update.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{update.percentComplete}%</p>
                        <p className="text-sm text-gray-600">{update.actualHours} hrs</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
