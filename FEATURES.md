# Feature Walkthrough

## What This App Does

This is a **laser-focused labor variance tracker** for construction contractors. It does ONE thing well: tells you if a job is drifting badly enough that you need to act THIS WEEK.

## Core Workflow

### 1. Create a Job

**When**: At project kickoff, when you have an estimate

**What you enter**:
- Job name (e.g., "Main Street HVAC Install")
- Estimated labor hours (from your bid/estimate)
- Expected duration in weeks (your best guess)

**Example**:
- Name: "Elm Street Plumbing Rough-In"
- Estimated: 320 hours
- Duration: 6 weeks

### 2. Weekly Updates

**When**: Every Friday (or your preferred check-in day)

**What you enter**:
- **Total actual hours to date** - Add up timesheets/payroll for this job
- **Percent complete** - Your judgment call (look at the work, not the hours)

**Example** (Week 3):
- Actual hours: 180
- Percent complete: 40%

### 3. Instant Analysis

The system immediately calculates:

**Planned Labor**: At 40% complete, you should have used 128 hours (40% of 320)

**Variance**: 180 actual - 128 planned = **52 hours over** (16.25% variance)

**Status**: 🔴 **RED** (over 15% variance)

**Projection**: At this rate, you'll finish at 450 total hours (130 hours over budget)

**Action**: This job needs attention THIS WEEK

## Status Meanings

### 🟢 GREEN (≤ 5% variance)
**What it means**: Job is on track

**What to do**: Keep doing what you're doing. Check in next week.

**Example**: 
- Estimated: 200 hrs
- Actual: 50 hrs at 25% complete
- Planned: 50 hrs (200 × 0.25)
- Variance: 0% ✓

### 🟡 YELLOW (5-15% variance)
**What it means**: Job is trending over budget

**What to do**: 
- Monitor closely this week
- Check if there are valid reasons (scope changes, conditions)
- Consider adjusting crew or methods

**Example**:
- Estimated: 400 hrs
- Actual: 180 hrs at 40% complete
- Planned: 160 hrs (400 × 0.40)
- Variance: 20 hrs (5%)

### 🔴 RED (> 15% variance)
**What it means**: Job is significantly over budget

**Action needed THIS WEEK**:
- Review crew efficiency
- Check for scope creep
- Look for unforeseen conditions
- Consider change orders
- Adjust plan immediately

**Example**:
- Estimated: 300 hrs
- Actual: 200 hrs at 50% complete
- Planned: 150 hrs (300 × 0.50)
- Variance: 50 hrs (16.7%) 🚨

## Email Reports

### Test Emails

Click "Send Test Email" on any job to receive an instant email with:
- Current status (GREEN/YELLOW/RED)
- Variance analysis
- Projected overrun
- Plain English explanation

**Use this to**:
- Preview what weekly emails look like
- Share with PMs or supervisors
- Document job status

### Email Format

```
LABOR VARIANCE REPORT
Main Street HVAC Install

STATUS: RED
ALERT: Job is 18.5% over budget. Projected overrun: 95 hours. 
Action needed this week.

---

JOB DETAILS:
• Estimated Labor: 500 hours
• Expected Duration: 8 weeks

CURRENT PROGRESS:
• Actual Labor to Date: 285 hours
• Percent Complete: 48%

VARIANCE ANALYSIS:
• Planned Labor (at 48% complete): 240.0 hours
• Labor Variance: 45.0 hours (9.0%)
• Projected Total Labor: 593.8 hours
• Projected Overrun: 93.8 hours

---

⚠️ ACTION REQUIRED THIS WEEK

This job is significantly over budget. Review crew efficiency, 
scope changes, or unforeseen conditions.
```

## Key Concepts

### Why Percent Complete Matters

**The insight**: Just because you've used 50% of hours doesn't mean you're 50% done!

**Scenario 1** (On track):
- Used: 100 hrs (50% of 200)
- Complete: 50%
- Status: 🟢 GREEN

**Scenario 2** (Over budget):
- Used: 100 hrs (50% of 200)
- Complete: 30%
- Status: 🔴 RED - You're only 30% done but used 50% of budget

### Projection Logic

If you're 40% done and have used 180 hours:
- Projected total = 180 ÷ 0.40 = **450 hours**
- If estimate was 320 hours, overrun = **130 hours**

This assumes current pace continues (which is why RED status = act now to change the pace)

### What This Replaces

**Before**: 
- Spreadsheet with manual calculations
- Realize job is over budget when it's too late
- Guessing if variance is "bad enough" to worry about

**After**:
- Input 2 numbers once per week
- Instant status + projection
- Clear thresholds (5%, 15%)
- Email reports you can forward

## What This Is NOT

- ❌ Time tracking (use your existing system)
- ❌ Payroll (export from your payroll provider)
- ❌ Estimating (create estimates elsewhere)
- ❌ Project management (use your PM tools)
- ❌ Crew scheduling (not included)

## Typical Use Cases

### Use Case 1: Weekly PM Meeting

Every Friday at 9am:
1. Pull actual hours from payroll/timesheets
2. Walk through active jobs
3. For each job: update actual hours + % complete
4. Review any RED or YELLOW flags
5. Decide actions for next week

### Use Case 2: Multi-Project Oversight

Owner with 5 active jobs:
1. Check job list (all statuses visible)
2. Focus on RED jobs first
3. Email reports to PMs
4. Archive completed jobs

### Use Case 3: Customer Updates

Proactive contractor:
1. Job turns YELLOW at week 4
2. Send email report to customer
3. Explain unforeseen conditions (found asbestos, etc.)
4. Justify change order with data

## Archive vs Active

### Active Jobs
- Show on main page
- Included in weekly workflow
- Trigger email alerts

### Archived Jobs
- Hidden by default (shown at bottom)
- Historical reference
- No longer in active monitoring

**When to archive**:
- Job complete and paid
- Moving to next phase (tracked separately)
- Canceled/on-hold jobs

## Tips for Success

### 1. Be Consistent
Update every Friday (or pick your day) - consistency matters more than perfect accuracy

### 2. Be Honest on % Complete
Don't base it on hours - look at the actual work. 60% of a 10-week job might not be 6 weeks!

### 3. Act on RED Immediately
The projection assumes current pace continues - intervene to change it

### 4. Document YELLOW
When jobs go YELLOW, note why in your own records (scope change, weather delay, etc.)

### 5. Use Emails as Backup
Forward variance reports to create a paper trail for change orders

## Future Enhancements (Not in MVP)

Things this app could do but doesn't (by design):
- CSV import from timesheets
- Multiple users per account
- Mobile app
- Historical charts
- Benchmark against similar jobs
- Phase tracking
- Material tracking
- Automated weekly emails (currently manual "test email")

This MVP focuses on the ONE thing that matters: **catching over-budget jobs early enough to do something about it.**
