import React from 'react'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, MessageSquare, Users } from 'lucide-react'

export default function ControlBar({
  isAudioOn,
  isVideoOn,
  isScreenSharing,
  showChat,
  showParticipants,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleChat,
  onToggleParticipants,
  onEndCall
}) {
  return (
    <div className="bg-zinc-950 border-t border-zinc-800 p-4 flex justify-center space-x-4">
      <button onClick={onToggleAudio} className="control-button">
        {isAudioOn ? <Mic /> : <MicOff className="text-red-500" />}
      </button>
      <button onClick={onToggleVideo} className="control-button">
        {isVideoOn ? <Video /> : <VideoOff className="text-red-500" />}
      </button>
      <button onClick={onToggleScreenShare} className={`control-button ${isScreenSharing ? 'bg-blue-600' : ''}`}>
        <Monitor />
      </button>
      <button onClick={onEndCall} className="control-button bg-red-600 hover:bg-red-700">
        <PhoneOff />
      </button>
      <button onClick={onToggleChat} className={`control-button ${showChat ? 'bg-blue-600' : ''}`}>
        <MessageSquare />
      </button>
      <button onClick={onToggleParticipants} className={`control-button ${showParticipants ? 'bg-blue-600' : ''}`}>
        <Users />
      </button>
    </div>
  )
}
