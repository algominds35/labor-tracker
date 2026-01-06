import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { calculateVariance } from "@/lib/calculations"
import UpdateForm from "./UpdateForm"
import JobActions from "./JobActions"
import SendTestEmail from "./SendTestEmail"

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const job = await prisma.job.findUnique({
    where: { id: parseInt(id) },
    include: {
      updates: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!job || job.userId !== session.user.id) {
    notFound()
  }

  const latestUpdate = job.updates[0]
  let variance = null

  if (latestUpdate) {
    variance = calculateVariance(
      job.estimatedHours,
      latestUpdate.actualHours,
      latestUpdate.percentComplete
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/" className="text-xl font-bold">
              Labor Tracker
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Status: {job.status === "active" ? "Active" : "Archived"}
            </p>
          </div>
          <JobActions jobId={job.id} currentStatus={job.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Estimated Hours</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {job.estimatedHours}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Expected Duration</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {job.expectedWeeks} weeks
            </div>
          </div>
          {latestUpdate && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600">Progress</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {latestUpdate.percentComplete}%
              </div>
            </div>
          )}
        </div>

        {variance && (
          <div
            className={`rounded-lg shadow p-6 mb-8 ${
              variance.status === "GREEN"
                ? "bg-green-50 border border-green-200"
                : variance.status === "YELLOW"
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Status: {variance.status}
                </h2>
                <p className="text-gray-700 mb-4">{variance.explanation}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Planned Labor:</span>
                    <span className="font-medium ml-2">
                      {variance.plannedLabor.toFixed(1)} hrs
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Actual Labor:</span>
                    <span className="font-medium ml-2">
                      {latestUpdate.actualHours} hrs
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Variance:</span>
                    <span className="font-medium ml-2">
                      {variance.laborVariance.toFixed(1)} hrs ({variance.variancePercent.toFixed(1)}%)
                    </span>
                  </div>
                  {variance.projectedOverrun !== null && (
                    <div>
                      <span className="text-gray-600">Projected Overrun:</span>
                      <span className="font-medium ml-2">
                        {variance.projectedOverrun.toFixed(1)} hrs
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <SendTestEmail jobId={job.id} />
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Weekly Update</h2>
          <UpdateForm jobId={job.id} latestUpdate={latestUpdate} />
        </div>

        {job.updates.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Update History</h2>
            <div className="space-y-3">
              {job.updates.map((update) => (
                <div
                  key={update.id}
                  className="border-l-4 border-gray-200 pl-4 py-2"
                >
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">
                        {update.actualHours} hrs actual
                      </span>
                      {" • "}
                      <span>{update.percentComplete}% complete</span>
                    </div>
                    <div className="text-gray-500">
                      {new Date(update.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
