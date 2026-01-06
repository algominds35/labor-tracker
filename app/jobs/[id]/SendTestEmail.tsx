"use client"

import { useState } from "react"

interface SendTestEmailProps {
  jobId: number
}

export default function SendTestEmail({ jobId }: SendTestEmailProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function sendEmail() {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch(`/api/jobs/${jobId}/send-email`, {
        method: "POST",
      })

      if (response.ok) {
        setMessage("Email sent successfully!")
      } else {
        const data = await response.json()
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("Failed to send email")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={sendEmail}
        disabled={loading}
        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Test Email"}
      </button>
      {message && (
        <span className="text-xs text-gray-600">{message}</span>
      )}
    </div>
  )
}
