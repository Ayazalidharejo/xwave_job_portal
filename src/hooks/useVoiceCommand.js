import { useState, useCallback, useEffect } from 'react'

/**
 * Voice-to-text and command mapping for Resume/Portfolio builder.
 * Uses Web Speech API. Maps phrases like "align text left", "make heading one", "image width 500"
 * to a command object { type, payload }.
 */
const COMMAND_PATTERNS = [
  { pattern: /(?:remove|delete|undo)\s+last\s+block/i, type: 'removeLastBlock' },
  { pattern: /(?:remove|delete)\s+last\s+line/i, type: 'removeLastLine' },
  { pattern: /(?:remove|delete)\s+last\s+word/i, type: 'removeLastWord' },
  { pattern: /(?:remove|delete)\s+last\s+character/i, type: 'removeLastCharacter' },
  { pattern: /(?:add|insert)\s+(?:an?\s+)?image/i, type: 'addImage' },
  { pattern: /new\s+paragraph\s*(.*)/i, type: 'insertParagraph', contentKey: 1 },
  { pattern: /new\s+heading\s+(one|two|three)\s*(.*)/i, type: 'insertHeading', levelKey: 1, contentKey: 2 },
  { pattern: /align\s+text\s+(left|center|right)/i, type: 'textAlign', key: 1 },
  { pattern: /make\s+heading\s+(one|two|three)/i, type: 'heading', key: 1 },
  { pattern: /image\s+width\s+(\d+)\s*pixels?/i, type: 'imageWidth', key: 1 },
  { pattern: /image\s+height\s+(\d+)\s*pixels?/i, type: 'imageHeight', key: 1 },
  { pattern: /font\s+size\s+(\d+)/i, type: 'fontSize', key: 1 },
  { pattern: /bold/i, type: 'bold' },
  { pattern: /italic/i, type: 'italic' },
  { pattern: /underline/i, type: 'underline' },
]

const HEADING_MAP = { one: 1, two: 2, three: 3 }

function parseCommand(text) {
  const t = text.trim()
  for (const pat of COMMAND_PATTERNS) {
    const m = t.match(pat.pattern)
    if (m) {
      if (pat.type === 'insertParagraph') {
        const content = (pat.contentKey !== undefined ? m[pat.contentKey] : t)?.trim() || ''
        return { type: 'insertParagraph', payload: content }
      }
      if (pat.type === 'insertHeading') {
        const level = HEADING_MAP[(m[pat.levelKey] || '').toLowerCase()] ?? 1
        const content = (pat.contentKey !== undefined ? m[pat.contentKey] : t)?.trim() || ''
        return { type: 'insertHeading', payload: { level, content } }
      }
      const payload = pat.key !== undefined ? m[pat.key] : true
      if (pat.type === 'heading') {
        return { type: 'heading', payload: HEADING_MAP[payload?.toLowerCase()] ?? 1 }
      }
      if (pat.type === 'imageWidth' || pat.type === 'imageHeight' || pat.type === 'fontSize') {
        return { type: pat.type, payload: parseInt(payload, 10) || 100 }
      }
      if (pat.type === 'textAlign') {
        return { type: 'textAlign', payload: payload?.toLowerCase() || 'left' }
      }
      return { type: pat.type, payload }
    }
  }
  return null
}

export function useVoiceCommand(onCommand) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    const ok = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    setSupported(!!ok)
    if (!ok) setError('Speech recognition not supported in this browser')
  }, [])

  const startListening = useCallback(() => {
    if (!supported) return
    setError(null)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.onresult = (event) => {
      const last = event.results.length - 1
      const result = event.results[last]
      const text = result[0].transcript
      const isFinal = result.isFinal
      setTranscript(text)
      const cmd = parseCommand(text)
      if (cmd && onCommand) onCommand(cmd)
      else if (isFinal && text.trim() && onCommand) onCommand({ type: 'dictation', payload: text.trim() })
    }
    recognition.onerror = (e) => setError(e.error)
    recognition.onend = () => setIsListening(false)
    recognition.start()
    setIsListening(true)
    return () => {
      try { recognition.stop() } catch (_) {}
    }
  }, [supported, onCommand])

  const stopListening = useCallback(() => {
    setIsListening(false)
    setTranscript('')
  }, [])

  return { isListening, transcript, error, supported, startListening, stopListening }
}
