import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    // Get user from database by email
    let userId = session?.user?.id
    
    if (!userId && session?.user?.email) {
      // Try to find user by email
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })
      userId = user?.id
    }
    
    if (!userId) {
      console.error("No user ID found. Session:", JSON.stringify(session))
      return NextResponse.json({ error: "Unauthorized - no user ID" }, { status: 401 })
    }

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
