'use client'
import React, { useEffect, useState } from 'react'
import { Clock, Copy } from 'lucide-react'

export default function MeetingHeader({ meetingId, currentTime, meetingDuration, participantCount, onCopyMeetingId, isConnected }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const t = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setTime(t)
  }, [currentTime])

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-zinc-950 border-b border-zinc-800">
      <div className="flex gap-6 items-center text-sm text-zinc-300">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{time}</span>
        </div>
        <span className="text-zinc-500">|</span>
        <span>Duration: {formatDuration(meetingDuration)}</span>
        <span className="text-zinc-500">|</span>
        <span>{participantCount} Participants</span>
        <span className="text-zinc-500">|</span>
        <span className={isConnected ? 'text-green-500' : 'text-red-500'}>
          {isConnected ? 'Connected' : 'Connecting...'}
        </span>
      </div>

      <button onClick={onCopyMeetingId} className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
        <Copy size={16} />
        Copy Meeting ID
      </button>
    </div>
  )
}
