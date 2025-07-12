import React from 'react'
import { Mic, MicOff, Video, VideoOff, Monitor } from 'lucide-react'

export default function VideoArea({
  localVideoRef,
  remoteVideoRef,
  isVideoOn,
  isScreenSharing,
  meetingId,
  participantCount
}) {
  const hasRemoteVideo = remoteVideoRef.current?.srcObject

  return (
    <div className="flex-1 relative bg-google-gray-900">
      {/* Remote Video */}
      <div className="w-full h-full relative flex items-center justify-center">
        <video
          ref={remoteVideoRef}
          autoPlay
          className="w-full h-full object-cover"
        />

        {!hasRemoteVideo && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-google-gray-800">
            <div className="participant-avatar w-24 h-24 text-3xl mb-4 bg-google-gray-700 text-white flex items-center justify-center rounded-full">
              U
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Waiting for others to join</h3>
            <p className="text-sm text-google-gray-400">Share the meeting link to invite others</p>
          </div>
        )}

        {isScreenSharing && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-google-red-600 px-3 py-1.5 rounded-md text-white">
            <Monitor size={14} />
            <span className="text-sm font-medium">You're presenting</span>
          </div>
        )}
      </div>

      {/* Local Video */}
      <div className="absolute bottom-6 right-6 w-64 h-48 bg-google-gray-800 rounded-xl overflow-hidden border border-google-gray-700 shadow-lg">
        <div className="relative w-full h-full">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />

          {!isVideoOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-google-gray-800">
              <div className="participant-avatar w-16 h-16 text-lg bg-google-gray-600 text-white flex items-center justify-center rounded-full">
                You
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
              {isVideoOn ? <Video size={12} className="text-white" /> : <VideoOff size={12} className="text-google-red-400" />}
            </div>
          </div>

          {/* Label */}
          <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
            You
          </div>
        </div>
      </div>

      {/* Meeting Info */}
      <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-md text-white">
        <p className="text-sm font-medium">Meeting ID: {meetingId}</p>
        <p className="text-xs text-google-gray-300 mt-1">
          {participantCount} participant{participantCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Signal Quality */}
      <div className="absolute top-6 right-6 flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-md">
        <div className="flex space-x-1">
          <div className="w-1 h-3 bg-google-green-500 rounded-sm"></div>
          <div className="w-1 h-4 bg-google-green-500 rounded-sm"></div>
          <div className="w-1 h-5 bg-google-green-500 rounded-sm"></div>
          <div className="w-1 h-6 bg-google-green-500 rounded-sm"></div>
        </div>
        <span className="text-xs text-white">Excellent</span>
      </div>
    </div>
  )
}
