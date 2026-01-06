import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    // TEMP: Use a hardcoded user ID if session fails (for testing)
    const userId = session?.user?.id || "temp-user-id"

    const { name, estimatedHours, expectedWeeks } = await request.json()

    if (!name || !estimatedHours || !expectedWeeks) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const job = await prisma.job.create({
      data: {
        name,
        estimatedHours,
        expectedWeeks,
        userId: userId,
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error("Job creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
