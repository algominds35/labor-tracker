import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { actualHours, percentComplete } = await request.json()

    if (actualHours == null || percentComplete == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (percentComplete < 0 || percentComplete > 100) {
      return NextResponse.json(
        { error: "Percent complete must be between 0 and 100" },
        { status: 400 }
      )
    }

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
    })

    if (!job || job.userId !== session.user.id) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const update = await prisma.weeklyUpdate.create({
      data: {
        jobId: parseInt(id),
        actualHours,
        percentComplete,
      },
    })

    return NextResponse.json(update, { status: 201 })
  } catch (error) {
    console.error("Update creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
