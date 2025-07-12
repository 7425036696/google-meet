'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useSocket } from '../context/SocketProvider'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import MeetingHeader from './MeetingHeader.jsx'
import VideoArea from './VideoArea.jsx'
import ControlBar from './ControlBar.jsx'
import ChatPanel from './ChatPanel.jsx'
import ParticipantsPanel from './ParticipantsPanel.jsx'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const servers = {
  iceServers: [
    { urls: ['stun:stun.l.google.com:19302'] }
  ]
}

export default function MeetingRoom() {
  const socket = useSocket()
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerRef = useRef(null)
  const localStream = useRef(null)

  const [meetingId, setMeetingId] = useState('')
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [participants, setParticipants] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [meetingDuration, setMeetingDuration] = useState(0)
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params?.meetingId) {
      const id = Array.isArray(params.meetingId)
        ? params.meetingId.join('/')
        : params.meetingId
      setMeetingId(id)
    }
  }, [params])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      setMeetingDuration(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!socket || !meetingId) return

    const init = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        })

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream.current
        }

        setIsConnected(true)
        socket.emit('join-room', meetingId)

        socket.on('user-joined', (userId) => {
          const isOfferer = socket.id < userId
          if (isOfferer) createOffer(userId)
          setParticipants(prev => [...prev, { id: userId, name: `User ${userId.slice(0, 8)}` }])
        })

        socket.on('offer', async ({ from, offer }) => {
          await createAnswer(from, offer)
        })

        socket.on('answer', ({ from, answer }) => {
          if (peerRef.current?.signalingState === 'have-local-offer') {
            peerRef.current.setRemoteDescription(new RTCSessionDescription(answer))
          }
        })

        socket.on('ice-candidate', ({ from, candidate }) => {
          if (candidate && peerRef.current) {
            peerRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error)
          }
        })

        socket.on('chat-message', ({ from, message, timestamp }) => {
          setChatMessages(prev => [...prev, { from, message, timestamp }])
        })

      } catch (error) {
        console.error('Media access error:', error)
      }
    }

    init()

    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [socket, meetingId])

  const createPeer = (userId) => {
    peerRef.current = new RTCPeerConnection(servers)
    localStream.current.getTracks().forEach(track => {
      peerRef.current.addTrack(track, localStream.current)
    })
    peerRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('ice-candidate', { to: userId, candidate: e.candidate })
      }
    }
    peerRef.current.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0]
      }
    }
    return peerRef.current
  }

  const createOffer = async (userId) => {
    const peer = createPeer(userId)
    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)
    socket.emit('offer', { to: userId, offer })
  }

  const createAnswer = async (userId, offer) => {
    const peer = createPeer(userId)
    await peer.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await peer.createAnswer()
    await peer.setLocalDescription(answer)
    socket.emit('answer', { to: userId, answer })
  }

  const toggleAudio = () => {
    const audioTrack = localStream.current?.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      setIsAudioOn(audioTrack.enabled)
    }
  }

  const toggleVideo = () => {
    const videoTrack = localStream.current?.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      setIsVideoOn(videoTrack.enabled)
    }
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        const videoTrack = screenStream.getVideoTracks()[0]
        const sender = peerRef.current?.getSenders().find(s => s.track?.kind === 'video')

        if (sender) await sender.replaceTrack(videoTrack)

        videoTrack.onended = () => {
          setIsScreenSharing(false)
          const camTrack = localStream.current?.getVideoTracks()[0]
          if (sender && camTrack) sender.replaceTrack(camTrack)
        }

        setIsScreenSharing(true)
      }
    } catch (err) {
      console.error('Screen share error:', err)
      toast.error('Screen share failed')
    }
  }

  const copyMeetingId = () => {
    navigator.clipboard.writeText(meetingId)
    toast.success('Meeting ID copied!')
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        from: 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString()
      }
      setChatMessages(prev => [...prev, message])
      socket.emit('chat-message', { to: meetingId, ...message })
      setNewMessage('')
    }
  }

  const endCall = () => {
    if (localStream.current) localStream.current.getTracks().forEach(track => track.stop())
    socket.emit('leave-room', meetingId)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-google-gray-900 text-white flex flex-col">
      <MeetingHeader 
        meetingId={meetingId}
        currentTime={currentTime}
        meetingDuration={meetingDuration}
        participantCount={participants.length + 1}
        onCopyMeetingId={copyMeetingId}
        isConnected={isConnected}
      />

      <div className="flex-1 flex">
        <VideoArea
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          isVideoOn={isVideoOn}
          isScreenSharing={isScreenSharing}
          meetingId={meetingId}
          participantCount={participants.length + 1}
        />

        {showChat && (
          <ChatPanel
            messages={chatMessages}
            newMessage={newMessage}
            onMessageChange={setNewMessage}
            onSendMessage={sendMessage}
            onClose={() => setShowChat(false)}
          />
        )}

        {showParticipants && (
          <ParticipantsPanel
            participants={participants}
            onClose={() => setShowParticipants(false)}
          />
        )}
      </div>

      <ControlBar
        isAudioOn={isAudioOn}
        isVideoOn={isVideoOn}
        isScreenSharing={isScreenSharing}
        showChat={showChat}
        showParticipants={showParticipants}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onToggleChat={() => setShowChat(!showChat)}
        onToggleParticipants={() => setShowParticipants(!showParticipants)}
        onEndCall={endCall}
      />
    </div>
  )
}
