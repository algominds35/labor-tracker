export type JobStatus = 'GREEN' | 'YELLOW' | 'RED'

export interface VarianceCalculation {
  plannedLabor: number
  laborVariance: number
  variancePercent: number
  status: JobStatus
  projectedTotal: number | null
  projectedOverrun: number | null
  explanation: string
}

export interface JobStats {
  currentWeek: number
  totalHours: number
  percentComplete: number
  plannedUsage: number
  laborVariance: number
  variancePercent: number
  status: string
  projectedTotal: number
}

export function calculateStats(
  job: { estimatedHours: number; expectedWeeks: number },
  updates: { actualHours: number; percentComplete: number }[]
): JobStats {
  const currentWeek = updates.length
  const totalHours = updates.reduce((sum, u) => sum + u.actualHours, 0)
  const percentComplete = updates.length > 0 ? updates[updates.length - 1].percentComplete : 0
  
  const plannedUsage = job.estimatedHours * (percentComplete / 100)
  const laborVariance = totalHours - plannedUsage
  const variancePercent = job.estimatedHours > 0 ? (laborVariance / job.estimatedHours) * 100 : 0
  
  let status = 'green'
  if (variancePercent > 15) {
    status = 'red'
  } else if (variancePercent > 5) {
    status = 'yellow'
  }
  
  const projectedTotal = percentComplete > 0 ? totalHours / (percentComplete / 100) : job.estimatedHours
  
  return {
    currentWeek,
    totalHours,
    percentComplete,
    plannedUsage,
    laborVariance,
    variancePercent,
    status,
    projectedTotal,
  }
}

export function calculateVariance(
  estimatedHours: number,
  actualHours: number,
  percentComplete: number
): VarianceCalculation {
  // Planned labor usage = estimated_hours × (percent_complete / 100)
  const plannedLabor = estimatedHours * (percentComplete / 100)
  
  // Labor variance = actual_hours − planned_labor
  const laborVariance = actualHours - plannedLabor
  
  // Variance percent = (labor_variance / estimated_hours) × 100
  const variancePercent = (laborVariance / estimatedHours) * 100
  
  // Status logic
  let status: JobStatus
  if (variancePercent <= 5) {
    status = 'GREEN'
  } else if (variancePercent <= 15) {
    status = 'YELLOW'
  } else {
    status = 'RED'
  }
  
  // Projection
  let projectedTotal: number | null = null
  let projectedOverrun: number | null = null
  
  if (percentComplete > 0) {
    projectedTotal = actualHours / (percentComplete / 100)
    projectedOverrun = projectedTotal - estimatedHours
  }
  
  // Generate explanation
  const explanation = generateExplanation(
    status,
    variancePercent,
    projectedOverrun,
    percentComplete
  )
  
  return {
    plannedLabor,
    laborVariance,
    variancePercent,
    status,
    projectedTotal,
    projectedOverrun,
    explanation,
  }
}

function generateExplanation(
  status: JobStatus,
  variancePercent: number,
  projectedOverrun: number | null,
  percentComplete: number
): string {
  if (percentComplete === 0) {
    return 'Job just started. No variance to report yet.'
  }
  
  if (status === 'GREEN') {
    return 'Job is on track. Labor usage is within 5% of planned progress.'
  }
  
  if (status === 'YELLOW') {
    const overrunHours = projectedOverrun ? Math.round(projectedOverrun) : 0
    return `Job is trending ${variancePercent.toFixed(1)}% over budget. Projected overrun: ${overrunHours} hours. Monitor closely.`
  }
  
  // RED
  const overrunHours = projectedOverrun ? Math.round(projectedOverrun) : 0
  return `ALERT: Job is ${variancePercent.toFixed(1)}% over budget. Projected overrun: ${overrunHours} hours. Action needed this week.`
}
