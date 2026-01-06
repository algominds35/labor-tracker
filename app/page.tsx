import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { signOut } from "@/lib/auth"
import { calculateVariance } from "@/lib/calculations"

export default async function HomePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const jobs = await prisma.job.findMany({
    where: { userId: session.user.id },
    include: {
      updates: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  const activeJobs = jobs.filter((job) => job.status === "active")
  const archivedJobs = jobs.filter((job) => job.status === "archived")

  function getJobStatus(job: typeof jobs[0]) {
    if (job.updates.length === 0) {
      return { status: "PENDING", color: "gray" }
    }
    
    const latestUpdate = job.updates[0]
    const calc = calculateVariance(
      job.estimatedHours,
      latestUpdate.actualHours,
      latestUpdate.percentComplete
    )
    
    const colors = {
      GREEN: "green",
      YELLOW: "yellow",
      RED: "red",
      PENDING: "gray"
    }
    
    return { status: calc.status, color: colors[calc.status] }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Labor Tracker</h1>
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-600">{session.user.email}</span>
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Active Jobs</h2>
          <Link
            href="/jobs/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + New Job
          </Link>
        </div>

        {activeJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No active jobs. Create your first job to get started.
          </div>
        ) : (
          <div className="grid gap-4">
            {activeJobs.map((job) => {
              const { status, color } = getJobStatus(job)
              const latestUpdate = job.updates[0]
              
              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block bg-white rounded-lg shadow hover:shadow-md transition p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            color === "green"
                              ? "bg-green-100 text-green-800"
                              : color === "yellow"
                              ? "bg-yellow-100 text-yellow-800"
                              : color === "red"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        <div>Estimated: {job.estimatedHours} hours</div>
                        {latestUpdate && (
                          <>
                            <div>Actual: {latestUpdate.actualHours} hours</div>
                            <div>Progress: {latestUpdate.percentComplete}%</div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {job.expectedWeeks} weeks
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {archivedJobs.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
              Archived Jobs
            </h2>
            <div className="grid gap-4 opacity-60">
              {archivedJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.name}
                  </h3>
                  <div className="mt-2 text-sm text-gray-600">
                    Estimated: {job.estimatedHours} hours
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
