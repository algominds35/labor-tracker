import { Resend } from "resend"
import { calculateVariance, type VarianceCalculation } from "./calculations"

const isDemoMode = process.env.RESEND_API_KEY === "demo_mode"
const resend = isDemoMode ? null : new Resend(process.env.RESEND_API_KEY)

interface Job {
  id: number
  name: string
  estimatedHours: number
  expectedWeeks: number
}

interface Update {
  actualHours: number
  percentComplete: number
}

export async function sendJobStatusEmail(
  toEmail: string,
  job: Job,
  latestUpdate: Update
) {
  const variance = calculateVariance(
    job.estimatedHours,
    latestUpdate.actualHours,
    latestUpdate.percentComplete
  )

  const subject = `[${variance.status}] ${job.name} — labor vs progress`
  const text = generateEmailBody(job, latestUpdate, variance)

  try {
    // Demo mode: log to console instead of sending
    if (isDemoMode) {
      console.log("\n" + "=".repeat(60))
      console.log("📧 DEMO MODE - Email Preview (not actually sent)")
      console.log("=".repeat(60))
      console.log(`To: ${toEmail}`)
      console.log(`Subject: ${subject}`)
      console.log("\n" + text)
      console.log("=".repeat(60) + "\n")
      return { success: true, id: "demo_" + Date.now() }
    }

    // Production mode: send via Resend
    const result = await resend!.emails.send({
      from: "Labor Tracker <onboarding@resend.dev>",
      to: toEmail,
      subject,
      text,
    })

    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error("Email send error:", error)
    return { success: false, error }
  }
}

function generateEmailBody(
  job: Job,
  update: Update,
  variance: VarianceCalculation
): string {
  return `
LABOR VARIANCE REPORT
${job.name}

STATUS: ${variance.status}
${variance.explanation}

---

JOB DETAILS:
• Estimated Labor: ${job.estimatedHours} hours
• Expected Duration: ${job.expectedWeeks} weeks

CURRENT PROGRESS:
• Actual Labor to Date: ${update.actualHours} hours
• Percent Complete: ${update.percentComplete}%

VARIANCE ANALYSIS:
• Planned Labor (at ${update.percentComplete}% complete): ${variance.plannedLabor.toFixed(1)} hours
• Labor Variance: ${variance.laborVariance.toFixed(1)} hours (${variance.variancePercent.toFixed(1)}%)
${
  variance.projectedTotal
    ? `• Projected Total Labor: ${variance.projectedTotal.toFixed(1)} hours`
    : ""
}
${
  variance.projectedOverrun
    ? `• Projected Overrun: ${variance.projectedOverrun.toFixed(1)} hours`
    : ""
}

---

${
  variance.status === "RED"
    ? "⚠️ ACTION REQUIRED THIS WEEK\n\nThis job is significantly over budget. Review crew efficiency, scope changes, or unforeseen conditions."
    : variance.status === "YELLOW"
    ? "⚠️ MONITOR CLOSELY\n\nThis job is trending over budget. Keep an eye on progress this week."
    : "✅ ON TRACK\n\nJob is performing within acceptable variance."
}

---
Sent by Labor Tracker
`.trim()
}
