import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendJobStatusEmail } from "@/lib/email"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: {
        updates: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    if (!job || job.userId !== session.user.id) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    if (job.updates.length === 0) {
      return NextResponse.json(
        { error: "No updates available for this job" },
        { status: 400 }
      )
    }

    const result = await sendJobStatusEmail(
      session.user.email,
      job,
      job.updates[0]
    )

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, emailId: result.id })
  } catch (error) {
    console.error("Send email error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
