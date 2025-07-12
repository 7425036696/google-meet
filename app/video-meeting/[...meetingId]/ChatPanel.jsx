import React from 'react'
import { X, Send } from 'lucide-react'

export default function ChatPanel({ messages, newMessage, onMessageChange, onSendMessage, onClose }) {
  return (
    <div className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h3 className="text-white font-semibold text-base">In-call Messages</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-zinc-700">
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-sm text-center text-zinc-400">No messages yet</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`space-y-1 ${msg.from === 'You' ? 'text-right' : 'text-left'}`}>
              {msg.from !== 'You' && (
                <p className="text-xs text-zinc-400 font-medium">{msg.from}</p>
              )}
              <div className="inline-block max-w-[80%] px-3 py-2 rounded-md bg-zinc-800 text-sm text-white">
                {msg.message}
              </div>
              <p className="text-[10px] text-zinc-500">{msg.timestamp}</p>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-zinc-800 text-sm rounded text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 rounded disabled:opacity-50"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
