import React from 'react'
import { X, Mic, MicOff, Video, VideoOff, Crown } from 'lucide-react'

export default function ParticipantsPanel({ participants, onClose }) {
  return (
    <div className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h3 className="text-white font-semibold text-base">Participants ({participants.length + 1})</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-zinc-700">
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* Current user */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-zinc-700 text-white flex items-center justify-center font-medium">Y</div>
          <div>
            <div className="flex items-center gap-1 text-white text-sm font-medium">
              You <Crown size={12} className="text-yellow-400" />
            </div>
            <div className="flex gap-1 text-xs text-green-400 mt-1">
              <Mic size={12} /> <Video size={12} />
            </div>
          </div>
        </div>
      </div>

      {/* Others */}
      <div className="flex-1 overflow-y-auto">
        {participants.map((p) => (
          <div key={p.id} className="p-4 border-b border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-zinc-700 text-white flex items-center justify-center font-medium">
                {p.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white text-sm">{p.name}</p>
                <div className="flex gap-1 mt-1 text-xs">
                  {p.isAudioOn ? <Mic size={12} className="text-green-400" /> : <MicOff size={12} className="text-red-500" />}
                  {p.isVideoOn ? <Video size={12} className="text-green-400" /> : <VideoOff size={12} className="text-red-500" />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
