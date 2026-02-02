import { useEffect, useState, useRef } from 'react'
import Add from '@mui/icons-material/Add'
import Mic from '@mui/icons-material/Mic'
import MicOff from '@mui/icons-material/MicOff'
import Send from '@mui/icons-material/Send'
import VolumeUp from '@mui/icons-material/VolumeUp'
import Stop from '@mui/icons-material/Stop'
import SmartToy from '@mui/icons-material/SmartToy'
import Person from '@mui/icons-material/Person'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { setMyReplies, addReply, setAiLoading, setAiError } from '../../../store/slices/aiSlice'
import { aiApi } from '../../../services/api'

export function AIReplies() {
  const dispatch = useAppDispatch()
  const { myReplies, loading } = useAppSelector((state) => state.ai)
  const user = useAppSelector((state) => state.auth.user)
  const userName = user?.name?.trim() || 'User'
  const [originalComment, setOriginalComment] = useState('')
  const [suggestedReply, setSuggestedReply] = useState('')
  const [open, setOpen] = useState(false)
  
  // AI Chatbox State
  const welcomeName = userName !== 'User' ? userName : 'there'
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${welcomeName}! I'm your AI career assistant. I can help you with:\n\n📝 Resume writing and optimization\n🎯 Interview preparation and tips\n💼 Job application strategies\n📈 Career growth advice\n🔍 LinkedIn profile optimization\n\nFeel free to ask me anything about your career journey! You can type your message or click the microphone to speak with me.`,
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const chatEndRef = useRef(null)
  const synth = window.speechSynthesis

  const load = async () => {
    dispatch(setAiLoading(true))
    try {
      const { data } = await aiApi.getMy()
      dispatch(setMyReplies(data))
    } catch (err) {
      dispatch(setAiError(err.response?.data?.message || 'Failed to load'))
    } finally {
      dispatch(setAiLoading(false))
    }
  }

  useEffect(() => { 
    load() 
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'
      
      recognitionInstance.onstart = () => {
        setIsListening(true)
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        
        // Auto-send and get voice response
        setTimeout(() => {
          sendMessage(true)
        }, 500)
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        alert('Speech recognition error. Please try again.')
      }
      
      setRecognition(recognitionInstance)
    } else {
      console.log('Speech recognition not supported')
    }
  }, [messages])

  // Real-time Voice Functions
  const startListening = () => {
    if (recognition) {
      recognition.start()
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.')
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
    }
  }

  // Text to Speech Function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      synth.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      synth.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    synth.cancel()
    setIsSpeaking(false)
  }

  // Chat Functions
  const sendMessage = async (isVoiceMessage = false) => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const messageText = inputMessage
    setInputMessage('')

    // Add typing indicator
    const typingMessage = {
      id: Date.now() + 1,
      text: 'Thinking...',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      const googleKey = (import.meta.env.VITE_GOOGLE_AI_API_KEY || import.meta.env.REACT_APP_GOOGLE_AI_API_KEY || '').trim()
      const openaiKey = (import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.REACT_APP_OPENAI_API_KEY || '').trim()

      let aiResponseText

      if (googleKey) {
        // Google Gemini API (free tier) - uses current model IDs
        const systemInstruction = {
          parts: [{
            text: `You are a helpful AI assistant for a career development platform. The person you are chatting with is named ${userName}. Address them by name when appropriate (e.g. "Hi ${userName}," or "Great question, ${userName}!"). Provide helpful, professional advice about job applications, resumes, interviews, and career growth. Be encouraging and specific in your responses.`
          }]
        }
        const body = {
          contents: [{ parts: [{ text: messageText }] }],
          systemInstruction,
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 }
        }
        // Current Gemini model IDs (old ones like gemini-1.5-flash / gemini-pro are deprecated)
        const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash-lite', 'gemini-3-flash-preview']
        let lastError = null
        for (const model of modelsToTry) {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            }
          )
          if (response.ok) {
            const data = await response.json()
            aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'No response.'
            break
          }
          const errData = await response.json().catch(() => ({}))
          lastError = errData?.error?.message || `HTTP ${response.status}`
          if (response.status !== 404 && response.status !== 400) break
        }
        if (!aiResponseText) throw new Error(lastError || 'Gemini API error')
      } else if (openaiKey) {
        // OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are a helpful AI assistant for a career development platform. The person you are chatting with is named ${userName}. Address them by name when appropriate. Provide helpful, professional advice about job applications, resumes, interviews, and career growth. Be encouraging and specific in your responses.`
              },
              { role: 'user', content: messageText }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        })
        if (!response.ok) throw new Error('AI service unavailable')
        const data = await response.json()
        aiResponseText = data.choices[0].message.content
      } else {
        throw new Error('No API key. Add VITE_GOOGLE_AI_API_KEY or VITE_OPENAI_API_KEY in .env')
      }

      // Remove typing indicator and add real response
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id))
      
      const aiResponse = {
        id: Date.now() + 2,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      
      // Auto-speak response for both voice and text messages
      setTimeout(() => {
        speakText(aiResponse.text)
      }, 500)

    } catch (error) {
      console.error('AI Error:', error)
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== typingMessage.id))

      const errMsg = error?.message || String(error)
      const isNoKey = /no api key|undefined|empty/i.test(errMsg)
      
      // Fallback response – show reason so user can fix
      const fallbackResponse = {
        id: Date.now() + 2,
        text: isNoKey
          ? "⚠️ API key nahi mili. .env file mein VITE_GOOGLE_AI_API_KEY add karo aur dev server restart karo (Ctrl+C phir npm run dev)."
          : `I'm sorry, AI service error: ${errMsg}. Check browser console (F12) for details.`,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, fallbackResponse])
      
      // Auto-speak fallback response
      setTimeout(() => {
        speakText(fallbackResponse.text)
      }, 500)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = async () => {
    if (!originalComment.trim() || !suggestedReply.trim()) return
    try {
      const { data } = await aiApi.create({ originalComment, suggestedReply })
      dispatch(addReply(data))
      setOriginalComment('')
      setSuggestedReply('')
      setOpen(false)
    } catch (err) {
      dispatch(setAiError(err.response?.data?.message || 'Failed to create'))
    }
  }

  return (
    <div className="w-full min-w-0 my-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h1 className="text-2xl font-semibold text-neutral-900">AI Reply System</h1>
        <button type="button" onClick={() => setOpen(true)} className="btn-primary gap-2 self-stretch sm:self-auto">
          <Add className="w-4 h-4" />
          New reply
        </button>
      </div>
      <p className="text-sm text-neutral-500 mb-4 hidden sm:block">
        Submit AI-suggested replies. Admin will approve before posting.
      </p>

      {/* AI Chatbox */}
      <div className="mb-6">
        <div className="card-advanced p-4">
          <div className="flex items-center gap-2 mb-4">
            <SmartToy className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-zinc-900">AI Assistant Chat</h2>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Online</span>
          </div>
          
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-xs lg:max-w-md ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-primary-600 text-white ml-2' 
                      : 'bg-gray-200 text-gray-600 mr-2'
                  }`}>
                    {message.sender === 'user' ? (
                      <Person className="w-4 h-4" />
                    ) : (
                      <SmartToy className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`px-3 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm">
                      {message.isTyping ? (
                        <span className="flex items-center gap-1">
                          Thinking
                          <span className="flex gap-1">
                            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                          </span>
                        </span>
                      ) : (
                        message.text
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${
                        message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.sender === 'ai' && !message.isTyping && (
                        <button
                          onClick={() => isSpeaking ? stopSpeaking() : speakText(message.text)}
                          className="text-xs hover:text-primary-600 transition-colors"
                          title={isSpeaking ? 'Stop speaking' : 'Speak this message'}
                        >
                          {isSpeaking ? (
                            <Stop className="w-3 h-3" />
                          ) : (
                            <VolumeUp className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Voice Listening Status */}
          {isListening && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-700">🎤 Listening... Speak now!</span>
                </div>
                <button
                  onClick={stopListening}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Stop className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* AI Speaking Status */}
          {isSpeaking && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-700">🔊 AI is speaking...</span>
                </div>
                <button
                  onClick={stopSpeaking}
                  className="text-green-600 hover:text-green-800"
                >
                  <Stop className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(false)}
              placeholder="🎤 Click mic to speak directly or type your message..."
              className="input-saas flex-1"
              disabled={isListening}
            />
            <button
              onClick={isListening ? stopListening : startListening}
              className={`btn-secondary ${isListening ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
              title={isListening ? 'Stop listening' : 'Start voice conversation (speak directly, AI responds with voice)'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={() => sendMessage(false)}
              disabled={!inputMessage.trim() || isListening}
              className="btn-primary disabled:opacity-60"
              title="Send text message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            🗣️ Voice-to-Voice: Click mic and speak directly - AI responds automatically with voice
            <br />
            💬 Text-to-Voice: Type your message and AI responds with voice
          </div>
        </div>
      </div>

      {/* Original LinkedIn Replies Table */}
      {/* <div className="bg-white border border-neutral-200 rounded-saas-lg overflow-x-auto">
        <table className="w-full min-w-[320px] text-sm text-left">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="py-3 px-4 font-medium text-neutral-700">Original comment</th>
              <th className="py-3 px-4 font-medium text-neutral-700">Suggested reply</th>
              <th className="py-3 px-4 font-medium text-neutral-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="py-4 px-4 text-neutral-500">Loading...</td></tr>
            ) : myReplies.length === 0 ? (
              <tr><td colSpan={3} className="py-4 px-4 text-neutral-500">No replies yet.</td></tr>
            ) : (
              myReplies.map((row) => (
                <tr key={row._id} className="border-b border-neutral-100">
                  <td className="py-3 px-4 max-w-[200px] truncate">{row.originalComment?.slice(0, 60)}…</td>
                  <td className="py-3 px-4 max-w-[200px] truncate">{row.suggestedReply?.slice(0, 60)}…</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded border border-neutral-200 bg-neutral-50 text-neutral-700">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div> */}

      {/* {open && (
        <div className="mt-4 p-4 sm:p-6 bg-white border border-neutral-200 rounded-saas-lg space-y-4">
          <div>
            <label htmlFor="ai-original" className="block text-sm font-medium text-neutral-700 mb-2">Original comment</label>
            <textarea
              id="ai-original"
              rows={2}
              value={originalComment}
              onChange={(e) => setOriginalComment(e.target.value)}
              className="input-saas w-full resize-y"
            />
          </div>
          <div>
            <label htmlFor="ai-suggested" className="block text-sm font-medium text-neutral-700 mb-2">Suggested reply</label>
            <textarea
              id="ai-suggested"
              rows={3}
              value={suggestedReply}
              onChange={(e) => setSuggestedReply(e.target.value)}
              className="input-saas w-full resize-y"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!originalComment.trim() || !suggestedReply.trim()}
              className="btn-primary disabled:opacity-60"
            >
              Submit for approval
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )} */}
    </div>
  )
}
