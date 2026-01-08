import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

const BookingChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm the Sick Day with Ferris booking assistant. I can help you inquire about booking the band for your venue. What can I help you with today?"
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    venueName: ''
  })
  const [showUserForm, setShowUserForm] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmitUserInfo = (e) => {
    e.preventDefault()
    if (userInfo.name && userInfo.email) {
      setShowUserForm(false)
      setMessages([
        {
          id: 1,
          role: 'assistant',
          content: `Thanks ${userInfo.name}! I'm here to help you book Sick Day with Ferris${userInfo.venueName ? ` for ${userInfo.venueName}` : ''}. What dates are you interested in?`
        }
      ])
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isLoading) return

    const newMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputMessage
    }
    setMessages([...messages, newMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Call the correct agent API endpoint
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputMessage,
          conversation_id: conversationId,
          sender_name: userInfo.name,
          sender_email: userInfo.email,
          sender_type: 'venue',
          venue_name: userInfo.venueName || null
        })
      })

      const data = await response.json()
      
      if (!conversationId) {
        setConversationId(data.conversation_id)
      }

      const assistantMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: data.response
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please email us directly at hello@sickdaywithferris.com or contact our booking manager Kacie at kacie@kaciebaxley.com"
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary to-secondary p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <MessageCircle size={28} className="text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-dark/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-primary/20 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle size={24} className="text-white" />
                <div>
                  <h3 className="font-bold text-white">Booking Assistant</h3>
                  <p className="text-xs text-white/70">Sick Day with Ferris</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {showUserForm ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/10 p-4 rounded-lg"
                >
                  <p className="text-light mb-4">Before we start, please tell us a bit about yourself:</p>
                  <form onSubmit={handleSubmitUserInfo} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      className="w-full px-3 py-2 bg-dark/50 border border-primary/30 rounded-lg text-light placeholder-light/50 focus:outline-none focus:border-primary"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email *"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      className="w-full px-3 py-2 bg-dark/50 border border-primary/30 rounded-lg text-light placeholder-light/50 focus:outline-none focus:border-primary"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Venue Name (optional)"
                      value={userInfo.venueName}
                      onChange={(e) => setUserInfo({ ...userInfo, venueName: e.target.value })}
                      className="w-full px-3 py-2 bg-dark/50 border border-primary/30 rounded-lg text-light placeholder-light/50 focus:outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
                    >
                      Start Chat
                    </button>
                  </form>
                </motion.div>
              ) : (
                <>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-primary to-secondary text-white'
                            : 'bg-primary/10 text-light'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Loader2 className="animate-spin text-primary" size={20} />
                      </div>
                    </motion.div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {!showUserForm && (
              <div className="p-4 border-t border-primary/20">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 bg-dark/50 border border-primary/30 rounded-full text-light placeholder-light/50 focus:outline-none focus:border-primary"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-primary to-secondary p-2 rounded-full text-white hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default BookingChat
