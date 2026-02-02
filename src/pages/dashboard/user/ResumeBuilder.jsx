import { useEffect, useState, useRef } from 'react'
import Mic from '@mui/icons-material/Mic'
import MicOff from '@mui/icons-material/MicOff'
import Save from '@mui/icons-material/Save'
import Download from '@mui/icons-material/Download'
import Add from '@mui/icons-material/Add'
import Delete from '@mui/icons-material/Delete'
import ArrowUpward from '@mui/icons-material/ArrowUpward'
import ArrowDownward from '@mui/icons-material/ArrowDownward'
import Title from '@mui/icons-material/Title'
import TextFields from '@mui/icons-material/TextFields'
import ImageIcon from '@mui/icons-material/Image'
import HorizontalRule from '@mui/icons-material/HorizontalRule'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { setMyResume, setResumeLoading, setResumeError } from '../../../store/slices/resumeSlice'
import { resumeApi } from '../../../services/api'
import { portfolioApi } from '../../../services/api'
import { useVoiceCommand } from '../../../hooks/useVoiceCommand'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const BLOCK_TYPES = [
  { type: 'paragraph', label: 'Paragraph', Icon: TextFields },
  { type: 'heading', label: 'Heading', Icon: Title },
  { type: 'image', label: 'Image', Icon: ImageIcon },
  { type: 'divider', label: 'Single line', Icon: HorizontalRule },
  { type: 'divider_double', label: 'Double line', Icon: HorizontalRule },
]

const HEADING_LEVELS = [
  { value: 1, label: 'H1' },
  { value: 2, label: 'H2' },
  { value: 3, label: 'H3' },
]

const TEXT_COLORS = [
  { value: '', label: 'Default' },
  { value: '#18181b', label: 'Black' },
  { value: '#3f3f46', label: 'Dark gray' },
  { value: '#6366f1', label: 'Indigo' },
  { value: '#2563eb', label: 'Blue' },
  { value: '#059669', label: 'Green' },
  { value: '#dc2626', label: 'Red' },
]

const IMAGE_ALIGN = [
  { value: 'block', label: 'Block (paragraph below)' },
  { value: 'left', label: 'Left (text beside)' },
  { value: 'right', label: 'Right (text beside)' },
]

function emptyBlock(type) {
  if (type === 'paragraph') return { type: 'paragraph', content: '', color: '' }
  if (type === 'heading') return { type: 'heading', content: '', level: 1, color: '' }
  if (type === 'image') return { type: 'image', url: '', alt: '', align: 'block', width: 200, height: 150 }
  if (type === 'divider') return { type: 'divider', lineStyle: 'single' }
  if (type === 'divider_double') return { type: 'divider', lineStyle: 'double' }
  return { type: 'paragraph', content: '', color: '' }
}

/** Normalize legacy content (summary only) to blocks */
function contentToBlocks(content) {
  if (!content) return []
  if (Array.isArray(content.blocks) && content.blocks.length) {
    return content.blocks.map((b) => {
      if (b.type === 'divider') return { type: 'divider', lineStyle: b.lineStyle || 'single' }
      return b
    })
  }
  const blocks = []
  if (content.summary) blocks.push({ type: 'paragraph', content: content.summary, color: '' })
  return blocks.length ? blocks : [{ type: 'paragraph', content: '', color: '' }]
}

/** Serialize blocks + optional summary (first paragraph text) for API */
function blocksToContent(blocks) {
  const summary = blocks.find((b) => b.type === 'paragraph')?.content ?? ''
  return { summary, blocks }
}

/** Default template – image jaisa: name+title right bold, contact left, no divider after contact; all dividers single 90% left */
function getDefaultResumeBlocks() {
  return [
    { type: 'heading', content: 'Imrana Saif', level: 1, color: '' },
    { type: 'paragraph', content: 'UX/UI Designer', color: '' },
    { type: 'heading', content: 'Contact', level: 2, color: '' },
    { type: 'paragraph', content: '+92-3095813292 • imranasaifxwave92@gmail.com • LinkedIn • Behance', color: '' },
    { type: 'heading', content: 'Professional Experience', level: 2, color: '' },
    {
      type: 'paragraph',
      content: `RathiSoft Innovation — Jul 2025 - Jan 2026
A Pakistan-based software development company dedicated to engineering and technology excellence.
Tourism & Travel Booking Platform | 12 Months
• Contributed to **UI/UX improvements** for a travel booking and selling platform.
• Assisted in designing **user-friendly layouts** for tour listings and platform pages.
• Improved **content clarity and information structure** for better user understanding.
• Collaborated with team members to understand **user needs and platform flow**.
• Supported **basic usability enhancements** based on feedback and requirements.
Tools Used: Figma, Canva, Google Docs, Platform Admin Panel, Customer Section, Supplier Section.

MedSynk: Small Clinics Web App — Jul 2025 - Sep 2025
A web app to help small clinics manage appointments, patient records, and daily operations.
• Designed a healthcare management web app to streamline doctor-patient interactions and appointment scheduling. Focused on creating an intuitive, user-friendly interface with clean layouts, easy navigation. Contributed to wireframes, user flows, style guide, and final UI screens to improve overall user experience and accessibility.
Project Link

Dunya News Website Redesign — Jan 2025 - March 2025
Redesign of the Dunya News website to improve usability, navigation, and visual appeal.
• Employed Figma to elevate Zain Estates website from low-fidelity to high-fidelity design, improving auto layout skills. The training sessions during the internship increased participation skills and design knowledge.
Project Link

Fixify: Cars & Bikes Breakdown App — Sep 2024 - Jan 2025
An app to provide quick breakdown assistance for cars and bikes.`,
      color: '',
    },
    { type: 'divider', lineStyle: 'single' },
    { type: 'heading', content: 'Education', level: 2, color: '' },
    {
      type: 'paragraph',
      content: `Government College Faisalabad, Pakistan — Jun 2011 - Aug 2013
Masters of Arts`,
      color: '',
    },
    { type: 'divider', lineStyle: 'single' },
    { type: 'heading', content: 'Certifications', level: 2, color: '' },
    {
      type: 'paragraph',
      content: `XWAVE — Sep 2024 - Sep 2025
• Completed a 12-months on-site UI/UX course; executed 3 impressive portfolio projects during the program using Figma, Wireframing and Prototyping.`,
      color: '',
    },
    { type: 'divider', lineStyle: 'single' },
    { type: 'heading', content: 'Additional Skills', level: 2, color: '' },
    {
      type: 'paragraph',
      content: '- Design Tools: Figma, Canva\n- UX Skills: User research, Wireframing, Prototyping, Work With Components, Animation',
      color: '',
    },
  ]
}

/** Quick-add section templates – har section ek click me add; all dividers single 90% left */
const QUICK_SECTIONS = [
  { label: 'Contact', dividerBefore: 'single', blocks: [{ type: 'heading', content: 'Contact', level: 2, color: '' }, { type: 'paragraph', content: '+92-XXX-XXXXXXX • your.email@example.com • LinkedIn • Behance', color: '' }] },
  { label: 'Professional Experience', dividerBefore: 'single', blocks: [{ type: 'heading', content: 'Professional Experience', level: 2, color: '' }, { type: 'paragraph', content: 'Company Name — Role (Month Year – Month Year)\n• Key responsibility or achievement.\n• Another point.\n• Tools or skills used.', color: '' }] },
  { label: 'Education', dividerBefore: 'single', blocks: [{ type: 'heading', content: 'Education', level: 2, color: '' }, { type: 'paragraph', content: 'Degree — Institution (Year – Year)\nBrief description if needed.', color: '' }] },
  { label: 'Certifications', dividerBefore: 'single', blocks: [{ type: 'heading', content: 'Certifications', level: 2, color: '' }, { type: 'paragraph', content: 'Certification Name (Month Year – Month Year)\n• Course or project detail.', color: '' }] },
  { label: 'Additional Skills', dividerBefore: 'single', blocks: [{ type: 'heading', content: 'Additional Skills', level: 2, color: '' }, { type: 'paragraph', content: '- Design Tools: Figma, Canva\n- UX Skills: User research, Wireframing, Prototyping', color: '' }] },
]

/** Em dash se split: "Company — Dates" → left bold, right right-aligned (image jaisa) */
const EM_DASH = '\u2014'
const DASH_SEP = ' — '

/** Text me **word** ko bold render */
function renderTextWithBold(text) {
  if (!text || !String(text).includes('**')) return text
  const parts = String(text).split(/\*\*(.+?)\*\*/g)
  return parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p)
}

/** Single divider line – 100% width (between experience entries, image jaisa) */
const INLINE_HR_STYLE = { width: '100%', marginTop: '0.75rem', marginBottom: '0.75rem', border: 'none', borderTop: '1px solid #18181b', display: 'block' }

/** Paragraph lines: empty line = single divider; Company — Dates; • bullet (with **bold**); Project line bold+italic; Project Link blue; Tools Used: bold */
function renderParagraphLines(content, colorStyle) {
  if (!content || !content.trim()) return <span className="inline-block min-h-[1em]">\u00A0</span>
  const lines = content.split('\n')
  return (
    <span className="block" style={colorStyle}>
      {lines.map((line, idx) => {
        const t = line.trimStart()
        const mt = idx > 0 ? '0.125rem' : 0
        const prevHadDash = idx > 0 && (lines[idx - 1].includes(DASH_SEP) || lines[idx - 1].includes(EM_DASH))
        if (t === '') {
          return <hr key={idx} style={INLINE_HR_STYLE} aria-hidden />
        }
        if (t.startsWith('•')) {
          return <div key={idx} className="pl-6 py-0.5 leading-relaxed" style={{ textIndent: '-0.5rem', marginTop: mt }}>{renderTextWithBold(line)}</div>
        }
        if (t.startsWith('-')) {
          return <div key={idx} className="pl-6 py-0.5 leading-relaxed" style={{ textIndent: '-0.5rem', marginTop: mt }}>{renderTextWithBold(line)}</div>
        }
        if (t === 'Project Link' || t.startsWith('Project Link ')) {
          return <div key={idx} className="py-0.5 leading-relaxed pl-6" style={{ marginTop: mt }}><span className="text-[#2563eb] underline">{line}</span></div>
        }
        if (t.startsWith('Tools Used:')) {
          return <div key={idx} className="py-0.5 leading-relaxed pl-6" style={{ marginTop: mt }}><span className="font-bold">Tools Used:</span>{renderTextWithBold(line.slice(11) || '')}</div>
        }
        if (t.includes(' | ')) {
          return <div key={idx} className="py-0.5 leading-relaxed pl-6 font-bold italic" style={{ marginTop: mt }}>{line}</div>
        }
        const sep = line.includes(DASH_SEP) ? DASH_SEP : line.includes(EM_DASH) ? EM_DASH : null
        if (sep) {
          const [left, right] = line.split(sep).map((s) => s.trim())
          return (
            <div key={idx} className="flex justify-between items-baseline gap-2 py-0.5 leading-relaxed" style={{ marginTop: mt }}>
              <span className="font-bold">{left || '\u00A0'}</span>
              <span className="shrink-0">{right || ''}</span>
            </div>
          )
        }
        return <div key={idx} className={`py-0.5 leading-relaxed ${prevHadDash ? 'pl-6' : ''}`} style={{ marginTop: mt }}>{renderTextWithBold(line || '\u00A0')}</div>
      })}
    </span>
  )
}

/** Contact line: phone • email • LinkedIn • Behance – link names blue underlined, centered (image jaisa) */
function renderContactLine(content, colorStyle) {
  if (!content || !content.trim()) return <span className="inline-block min-h-[1em]">\u00A0</span>
  const linkNames = ['linkedin', 'behance', 'portfolio', 'dribbble', 'github', 'website', 'project link']
  const parts = content.split(/\s*•\s*/).map((p) => p.trim()).filter(Boolean)
  return (
    <span className="block text-center text-sm leading-relaxed" style={colorStyle}>
      {parts.map((part, idx) => {
        const isLink = linkNames.some((name) => part.toLowerCase() === name || part.toLowerCase().startsWith(name + ' '))
        if (isLink) {
          return <span key={idx}>{idx > 0 && ' • '}<span className="text-[#2563eb] underline">{part}</span></span>
        }
        return <span key={idx}>{idx > 0 && ' • '}{part}</span>
      })}
    </span>
  )
}

export function ResumeBuilder() {
  const dispatch = useAppDispatch()
  const { myResume, loading } = useAppSelector((state) => state.resume)
  const [blocks, setBlocks] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleVoiceCommand = (cmd) => {
    if (cmd.type === 'removeLastBlock') {
      setBlocks((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
      setSelectedIndex(null)
    }
    if (cmd.type === 'removeLastLine') {
      setBlocks((prev) => {
        const next = [...prev]
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i].type === 'paragraph' || next[i].type === 'heading') {
            const content = next[i].content ?? ''
            const lines = content.split(/\n/)
            if (lines.length > 1) lines.pop()
            else lines[0] = ''
            next[i] = { ...next[i], content: lines.join('\n') }
            return next
          }
        }
        return prev
      })
    }
    if (cmd.type === 'removeLastWord') {
      setBlocks((prev) => {
        const next = [...prev]
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i].type === 'paragraph' || next[i].type === 'heading') {
            const content = (next[i].content ?? '').trimEnd()
            const lastSpace = content.lastIndexOf(' ')
            const newContent = lastSpace >= 0 ? content.slice(0, lastSpace) : ''
            next[i] = { ...next[i], content: newContent }
            return next
          }
        }
        return prev
      })
    }
    if (cmd.type === 'removeLastCharacter') {
      setBlocks((prev) => {
        const next = [...prev]
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i].type === 'paragraph' || next[i].type === 'heading') {
            const content = next[i].content ?? ''
            next[i] = { ...next[i], content: content.slice(0, -1) }
            return next
          }
        }
        return prev
      })
    }
    if (cmd.type === 'addImage') {
      setBlocks((prev) => [...prev, emptyBlock('image')])
      setSelectedIndex(blocks.length)
    }
    if (cmd.type === 'insertParagraph' && cmd.payload) {
      setBlocks((prev) => [...prev, { type: 'paragraph', content: cmd.payload, color: '' }])
    }
    if (cmd.type === 'insertHeading' && cmd.payload?.content != null) {
      setBlocks((prev) => [...prev, { type: 'heading', content: cmd.payload.content, level: cmd.payload.level ?? 1, color: '' }])
    }
    if (cmd.type === 'dictation' && cmd.payload) {
      setBlocks((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.type === 'paragraph' || last?.type === 'heading') {
          next[next.length - 1] = { ...last, content: (last.content || '') + (last.content ? ' ' : '') + cmd.payload }
          return next
        }
        next.push({ type: 'paragraph', content: cmd.payload, color: '' })
        return next
      })
    }
    if (cmd.type === 'heading' && selectedIndex != null && blocks[selectedIndex]?.type === 'heading') {
      setBlocks((prev) => {
        const next = [...prev]
        next[selectedIndex] = { ...next[selectedIndex], level: cmd.payload ?? 1 }
        return next
      })
    }
    if (cmd.type === 'imageWidth' && selectedIndex != null && blocks[selectedIndex]?.type === 'image') {
      setBlocks((prev) => {
        const next = [...prev]
        next[selectedIndex] = { ...next[selectedIndex], width: cmd.payload ?? 200 }
        return next
      })
    }
    if (cmd.type === 'imageHeight' && selectedIndex != null && blocks[selectedIndex]?.type === 'image') {
      setBlocks((prev) => {
        const next = [...prev]
        next[selectedIndex] = { ...next[selectedIndex], height: cmd.payload ?? 150 }
        return next
      })
    }
  }

  const { isListening, transcript, error: voiceError, supported, startListening, stopListening } = useVoiceCommand(handleVoiceCommand)

  const load = async () => {
    dispatch(setResumeLoading(true))
    try {
      const { data } = await resumeApi.getMy()
      dispatch(setMyResume(data))
      if (data?.content) {
        const parsed = contentToBlocks(data.content)
        const hasContent = parsed.some((b) => (b.type === 'paragraph' || b.type === 'heading') && (b.content || '').trim())
        if (hasContent) setBlocks(parsed)
        else setBlocks(getDefaultResumeBlocks())
      } else {
        setBlocks(getDefaultResumeBlocks())
      }
    } catch (err) {
      dispatch(setResumeError(err.response?.data?.message || 'Failed to load'))
      setBlocks(getDefaultResumeBlocks())
    } finally {
      dispatch(setResumeLoading(false))
    }
  }

  useEffect(() => { load() }, [])
  /* Blocks sirf load() se set hote hain – edit ke waqt myResume se overwrite nahi karte, isliye preview me edit turant dikhta hai */

  const handleSave = async () => {
    const content = blocksToContent(blocks)
    try {
      await resumeApi.upsertMy({ content })
      dispatch(setMyResume({ ...myResume, content }))
    } catch (err) {
      dispatch(setResumeError(err.response?.data?.message || 'Failed to save'))
    }
  }

  const downloadPDF = async () => {
    const el = document.getElementById('resume-preview-for-pdf')
    if (!el) return
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ format: 'a4', unit: 'mm' })
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = pdf.internal.pageSize.getHeight()
      const imgW = canvas.width
      const imgH = canvas.height
      const ratio = Math.min(pdfW / imgW, pdfH / imgH) * 0.95
      const w = imgW * ratio
      const h = imgH * ratio
      pdf.addImage(imgData, 'PNG', (pdfW - w) / 2, 10, w, h)
      pdf.save('resume.pdf')
    } catch (err) {
      console.error('PDF export failed:', err)
      dispatch(setResumeError('PDF download failed. Try again.'))
    }
  }

  const addBlock = (type) => {
    const newBlock = emptyBlock(type)
    setBlocks((prev) => [...prev, newBlock])
    setSelectedIndex(blocks.length)
  }

  /** Quick add: divider (single/double) + section heading + paragraph (image jaisa) */
  const addQuickSection = (section) => {
    const newBlocks = section.blocks.map((b) => ({ ...b }))
    const lineStyle = section.dividerBefore || 'single'
    setBlocks((prev) => {
      const next = [...prev]
      if (next.length > 0) next.push({ type: 'divider', lineStyle })
      return [...next, ...newBlocks]
    })
    setSelectedIndex(blocks.length + (blocks.length > 0 ? 1 : 0))
  }

  const updateBlock = (index, patch) => {
    setBlocks((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...patch }
      return next
    })
  }

  const removeBlock = (index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index))
    setSelectedIndex(selectedIndex === index ? null : selectedIndex != null && selectedIndex > index ? selectedIndex - 1 : selectedIndex)
  }

  const moveBlock = (index, direction) => {
    if (direction === 'up' && index <= 0) return
    if (direction === 'down' && index >= blocks.length - 1) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    setBlocks((prev) => {
      const next = [...prev]
      ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
      return next
    })
    setSelectedIndex(newIndex)
  }

  const handleImageSelect = async (e, blockIndex) => {
    const file = e.target?.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { data } = await portfolioApi.uploadImage(file)
      if (data?.url) updateBlock(blockIndex, { url: data.url })
    } catch (err) {
      dispatch(setResumeError(err.response?.data?.message || 'Image upload failed'))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const triggerImageUpload = (blockIndex) => {
    const el = fileInputRef.current
    if (el) {
      el.setAttribute('data-block-index', String(blockIndex))
      el.click()
    }
  }

  return (
    <div className="w-full min-w-0">
      <h1 className="text-2xl font-semibold text-zinc-900 mb-1">Resume Builder</h1>
      <p className="text-sm text-zinc-500 mb-6">
        Add <strong>paragraphs</strong>, <strong>headings</strong>, <strong>images</strong>, and <strong>dividers</strong>. For image and text in <strong>one row</strong>, set Position to <strong>Left</strong> or <strong>Right</strong> (text flows beside the image). Voice remove: say &quot;remove last block&quot;, &quot;remove last line&quot;, &quot;remove last word&quot;, or &quot;remove last character&quot;.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left: controls */}
        <div className="space-y-4">
          {supported && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border ${
                  isListening ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening ? 'Stop voice' : 'Start voice'}
              </button>
              {transcript && <span className="text-xs text-zinc-500 truncate max-w-[200px]" title={transcript}>{transcript}</span>}
              {voiceError && <span className="text-xs text-amber-700">{voiceError}</span>}
            </div>
          )}

          <div className="card-advanced p-4 sm:p-5">
            <p className="text-sm font-medium text-zinc-700 mb-2">Quick add section (image jaisa)</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_SECTIONS.map((section) => (
                <button
                  key={section.label}
                  type="button"
                  onClick={() => addQuickSection(section)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-indigo-200 bg-indigo-50/80 text-indigo-700 hover:bg-indigo-100"
                >
                  {section.label}
                </button>
              ))}
            </div>

            <p className="text-sm font-medium text-zinc-700 mb-2">Add block</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {BLOCK_TYPES.map(({ type, label, Icon }) => (
                <button key={type} type="button" onClick={() => addBlock(type)} className="btn-secondary gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <p className="text-sm font-medium text-zinc-700 mb-2">Select & edit block</p>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {blocks.map((block, index) => (
                <div
                  key={index}
                  className={`border rounded-xl p-3 transition-colors ${selectedIndex === index ? 'border-indigo-500 bg-indigo-50/50' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}
                >
                  <div className="flex items-center justify-between mb-2 gap-1">
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 disabled:opacity-40" aria-label="Move up">
                        <ArrowUpward className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 disabled:opacity-40" aria-label="Move down">
                        <ArrowDownward className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                      className="text-left flex-1 min-w-0"
                    >
                      <span className="text-xs font-medium text-zinc-500 uppercase">
                        {block.type}
                        {block.type === 'heading' && ` (H${block.level ?? 1})`}
                      </span>
                      <span className="block truncate text-sm text-zinc-800 mt-0.5">
                        {block.type === 'divider' ? (block.lineStyle === 'double' ? 'Double line' : 'Single line') : block.type === 'image' ? (block.url ? 'Image' : 'No image') : (block.content || 'Empty')}
                      </span>
                    </button>
                    <button type="button" onClick={() => removeBlock(index)} className="p-1.5 rounded-lg text-zinc-500 hover:bg-red-50 hover:text-red-600 shrink-0" aria-label="Remove block">
                      <Delete className="w-4 h-4" />
                    </button>
                  </div>

                  {selectedIndex === index && (
                    <div className="mt-3 pt-3 border-t border-zinc-200 space-y-3">
                      {block.type === 'paragraph' && (
                        <>
                          <textarea
                            value={block.content ?? ''}
                            onChange={(e) => updateBlock(index, { content: e.target.value })}
                            className="input-saas w-full resize-y min-h-[80px]"
                            placeholder="Paragraph text…"
                          />
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Text color</label>
                            <select
                              value={block.color ?? ''}
                              onChange={(e) => updateBlock(index, { color: e.target.value })}
                              className="input-saas w-full"
                            >
                              {TEXT_COLORS.map((c) => (
                                <option key={c.value || 'default'} value={c.value}>{c.label}</option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}

                      {block.type === 'heading' && (
                        <>
                          <input
                            type="text"
                            value={block.content ?? ''}
                            onChange={(e) => updateBlock(index, { content: e.target.value })}
                            className="input-saas w-full"
                            placeholder="Heading text…"
                          />
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Heading level</label>
                            <select
                              value={block.level ?? 1}
                              onChange={(e) => updateBlock(index, { level: Number(e.target.value) })}
                              className="input-saas w-full"
                            >
                              {HEADING_LEVELS.map((l) => (
                                <option key={l.value} value={l.value}>{l.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Text color</label>
                            <select
                              value={block.color ?? ''}
                              onChange={(e) => updateBlock(index, { color: e.target.value })}
                              className="input-saas w-full"
                            >
                              {TEXT_COLORS.map((c) => (
                                <option key={c.value || 'default'} value={c.value}>{c.label}</option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}

                      {block.type === 'divider' && (
                        <div>
                          <label className="block text-xs font-medium text-zinc-500 mb-1">Line style</label>
                          <select
                            value={block.lineStyle || 'single'}
                            onChange={(e) => updateBlock(index, { lineStyle: e.target.value })}
                            className="input-saas w-full"
                          >
                            <option value="single">Single line</option>
                            <option value="double">Double line</option>
                          </select>
                        </div>
                      )}

                      {block.type === 'image' && (
                        <>
                          {block.url ? (
                            <div className="flex items-start gap-3">
                              <img src={block.url} alt={block.alt || ''} className="max-h-24 rounded-lg object-cover border border-zinc-200" />
                              <div className="flex-1 min-w-0 space-y-2">
                                <input
                                  type="text"
                                  value={block.alt ?? ''}
                                  onChange={(e) => updateBlock(index, { alt: e.target.value })}
                                  className="input-saas w-full"
                                  placeholder="Alt text"
                                />
                                <button type="button" onClick={() => triggerImageUpload(index)} className="btn-secondary text-sm w-full">Replace image</button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => triggerImageUpload(index)}
                              disabled={uploading}
                              className="w-full py-6 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-60 text-sm"
                            >
                              {uploading ? 'Uploading…' : 'Click to upload image (Cloudinary)'}
                            </button>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-zinc-500 mb-1">Position</label>
                              <select
                                value={block.align ?? 'left'}
                                onChange={(e) => updateBlock(index, { align: e.target.value })}
                                className="input-saas w-full"
                              >
                                {IMAGE_ALIGN.map((a) => (
                                  <option key={a.value} value={a.value}>{a.value === 'left' ? 'Left → Right' : 'Right → Left'}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-zinc-500 mb-1">Width (px)</label>
                              <input
                                type="number"
                                min={50}
                                max={800}
                                value={block.width ?? 200}
                                onChange={(e) => updateBlock(index, { width: Number(e.target.value) || 200 })}
                                className="input-saas w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-zinc-500 mb-1">Height (px)</label>
                              <input
                                type="number"
                                min={50}
                                max={600}
                                value={block.height ?? 150}
                                onChange={(e) => updateBlock(index, { height: Number(e.target.value) || 150 })}
                                className="input-saas w-full"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              data-block-index=""
              onChange={(e) => {
                const idx = e.currentTarget.getAttribute('data-block-index')
                if (idx !== '' && idx != null) handleImageSelect(e, Number(idx))
              }}
            />

            <div className="flex flex-wrap gap-2 mt-4">
              <button type="button" onClick={handleSave} disabled={loading} className="btn-primary gap-2 disabled:opacity-60">
                <Save className="w-4 h-4" />
                Save resume
              </button>
              <button type="button" onClick={downloadPDF} className="btn-secondary gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>

          {myResume?.status && (
            <p className="text-sm text-zinc-500">Status: <span className="font-medium text-zinc-700">{myResume.status}</span></p>
          )}
          {myResume?.adminFeedback && (
            <div className="p-3 text-sm text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-xl">Admin: {myResume.adminFeedback}</div>
          )}
        </div>

        {/* Right: preview – design image jaisa: single-line horizontal dividers, full width, clean UI */}
        <div className="card-advanced p-6 lg:p-8 min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-zinc-900">Preview</h2>
            <button type="button" onClick={downloadPDF} className="btn-secondary gap-1.5 text-sm py-1.5">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
          <div
            id="resume-preview-for-pdf"
            className="max-w-[21cm] mx-auto bg-white text-black rounded border border-zinc-200 p-8 shadow-inner print:shadow-none"
            style={{ minHeight: '400px' }}
          >
            {blocks.length === 0 ? (
              <p className="text-zinc-500 text-sm">Add a paragraph, heading, or image above.</p>
            ) : (
              (() => {
                return (
                  <div className="text-[#18181b] text-sm leading-relaxed font-sans antialiased" style={{ maxWidth: '21cm' }}>
                    {blocks.map((block, i) => {
                      const prevBlock = blocks[i - 1]
                      const isTitle = prevBlock?.type === 'heading' && prevBlock?.level === 1 && block.type === 'paragraph'
                      const isContact = prevBlock?.type === 'heading' && String(prevBlock?.content || '').trim().toLowerCase() === 'contact' && block.type === 'paragraph'

                      if (block.type === 'paragraph') {
                        const style = block.color ? { color: block.color } : { color: '#18181b' }
                        if (isContact) {
                          return (
                            <p key={i} className="text-[#18181b] text-center mt-1 mb-0">
                              {renderContactLine(block.content, style)}
                            </p>
                          )
                        }
                        return (
                          <p key={i} className={`text-[#18181b] ${isTitle ? 'text-center text-base font-bold mt-0 mb-0' : 'mt-1 mb-0'}`}>
                            {renderParagraphLines(block.content, style)}
                          </p>
                        )
                      }
                      if (block.type === 'heading') {
                        const level = Math.min(3, Math.max(1, block.level ?? 1))
                        const style = block.color ? { color: block.color } : {}
                        const size = { 1: 'text-2xl', 2: 'text-lg', 3: 'text-base' }[level] || 'text-lg'
                        const content = block.content || '\u00A0'
                        const alignClass = level === 1 ? 'text-center' : 'text-left'
                        const mt = level === 1 ? (i === 0 ? '0' : '1.5rem') : '1.25rem'
                        if (level === 1) {
                          return <h1 key={i} className={`font-bold ${size} text-[#18181b] ${alignClass}`} style={{ ...style, marginTop: mt, marginBottom: '0.25rem' }}>{content}</h1>
                        }
                        if (level === 2) {
                          const hrStyle = { width: '100%', border: 'none', borderTop: '1px solid #18181b', display: 'block' }
                          return (
                            <div key={i} style={{ marginTop: mt }}>
                              <h2 className={`font-bold ${size} text-[#18181b] text-left`} style={style}>{content}</h2>
                              <div className="mt-1 mb-3 w-full">
                                <hr style={hrStyle} aria-hidden />
                                <hr style={{ ...hrStyle, marginTop: '2px' }} aria-hidden />
                              </div>
                            </div>
                          )
                        }
                        return <h3 key={i} className={`font-bold ${size} text-[#18181b] mt-3 ${alignClass}`} style={style}>{content}</h3>
                      }
                      if (block.type === 'image' && block.url) {
                        const w = block.width ?? 200
                        const h = block.height ?? 150
                        const align = block.align ?? 'block'
                        if (align === 'block') {
                          return (
                            <div key={i} className="my-2">
                              <img src={block.url} alt={block.alt || ''} width={w} height={h} className="rounded object-cover max-w-full" />
                            </div>
                          )
                        }
                        const floatClass = align === 'right' ? 'float-right ml-4 mb-2' : 'float-left mr-4 mb-2'
                        return (
                          <div key={i} className={floatClass}>
                            <img src={block.url} alt={block.alt || ''} width={w} height={h} className="rounded object-cover" />
                          </div>
                        )
                      }
                      if (block.type === 'divider') {
                        const lineStyle = block.lineStyle || 'single'
                        const hrStyle = { width: '100%', border: 'none', borderTop: '1px solid #18181b', display: 'block' }
                        return (
                          <div key={i} className="my-4 w-full">
                            <hr style={hrStyle} aria-hidden />
                            {lineStyle === 'double' && <hr style={{ ...hrStyle, marginTop: '2px' }} aria-hidden />}
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                )
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
