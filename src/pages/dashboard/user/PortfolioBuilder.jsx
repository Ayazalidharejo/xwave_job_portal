import { useEffect, useState, useRef } from 'react'
import Save from '@mui/icons-material/Save'
import Preview from '@mui/icons-material/Preview'
import CircularProgress from '@mui/material/CircularProgress'
import Mic from '@mui/icons-material/Mic'
import MicOff from '@mui/icons-material/MicOff'
import Add from '@mui/icons-material/Add'
import Delete from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import Title from '@mui/icons-material/Title'
import TextFields from '@mui/icons-material/TextFields'
import Image from '@mui/icons-material/Image'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { setMyPortfolio, setPortfolioLoading, setPortfolioError } from '../../../store/slices/portfolioSlice'
import { portfolioApi } from '../../../services/api'
import { useVoiceCommand } from '../../../hooks/useVoiceCommand'

/** Block types: paragraph | heading | links | image */
const BLOCK_TYPES = [
  { type: 'paragraph', label: 'Paragraph', Icon: TextFields },
  { type: 'heading', label: 'Heading', Icon: Title },
  { type: 'links', label: 'Links', Icon: LinkIcon },
  { type: 'image', label: 'Image', Icon: Image },
]

function emptyBlock(type) {
  if (type === 'paragraph') return { type: 'paragraph', content: '' }
  if (type === 'heading') return { type: 'heading', content: '', level: 1 }
  if (type === 'links') return { type: 'links', links: [{ label: '', href: '' }] }
  if (type === 'image') return { type: 'image', url: '', alt: '', width: 'auto', height: 'auto' }
  return { type: 'paragraph', content: '' }
}

/** Normalize legacy section (hero with title/content) to blocks */
function sectionsToBlocks(sections) {
  if (!sections?.length) return []
  const first = sections[0]
  if (first.type === 'hero' && (first.title || first.content)) {
    const blocks = []
    if (first.title) blocks.push({ type: 'heading', content: first.title, level: 1 })
    if (first.content) blocks.push({ type: 'paragraph', content: first.content })
    return blocks.length ? blocks : [{ type: 'paragraph', content: '' }]
  }
  if (Array.isArray(first.blocks)) return first.blocks
  return sections.map((s) => {
    if (s.type === 'paragraph') return { type: 'paragraph', content: s.content ?? '' }
    if (s.type === 'heading') return { type: 'heading', content: s.content ?? '', level: s.level ?? 1 }
    if (s.type === 'links') return { type: 'links', links: Array.isArray(s.links) ? s.links : [{ label: '', href: '' }] }
    if (s.type === 'image') return { type: 'image', url: s.url ?? '', alt: s.alt ?? '', width: s.width ?? 'auto', height: s.height ?? 'auto' }
    return { type: 'paragraph', content: '' }
  })
}

/** Serialize blocks to sections payload (one section with title + blocks) */
function blocksToSections(title, blocks) {
  return [{ type: 'section', title: title || 'My Portfolio', blocks }]
}

export function PortfolioBuilder() {
  const dispatch = useAppDispatch()
  const { myPortfolio, loading } = useAppSelector((state) => state.portfolio)
  const [sectionTitle, setSectionTitle] = useState('')
  const [blocks, setBlocks] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleVoiceCommand = (cmd) => {
    if (cmd.type === 'removeLastBlock') {
      setBlocks((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
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
            next[i] = { ...next[i], content: lastSpace >= 0 ? content.slice(0, lastSpace) : '' }
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
    }
    if (cmd.type === 'insertParagraph' && cmd.payload) {
      setBlocks((prev) => [...prev, { type: 'paragraph', content: cmd.payload }])
    }
    if (cmd.type === 'insertHeading' && cmd.payload?.content != null) {
      setBlocks((prev) => [...prev, { type: 'heading', content: cmd.payload.content, level: cmd.payload.level ?? 1 }])
    }
    if (cmd.type === 'dictation' && cmd.payload) {
      setBlocks((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.type === 'paragraph' || last?.type === 'heading') {
          next[next.length - 1] = { ...last, content: (last.content || '') + (last.content ? ' ' : '') + cmd.payload }
          return next
        }
        next.push({ type: 'paragraph', content: cmd.payload })
        return next
      })
    }
  }

  const { isListening, transcript, error: voiceError, supported, startListening, stopListening } = useVoiceCommand(handleVoiceCommand)

  const load = async () => {
    dispatch(setPortfolioLoading(true))
    try {
      const { data } = await portfolioApi.getMy()
      dispatch(setMyPortfolio(data))
      if (data?.sections?.length) {
        setSectionTitle(data.sections[0]?.title ?? '')
        setBlocks(sectionsToBlocks(data.sections))
      } else {
        setSectionTitle('')
        setBlocks([{ type: 'paragraph', content: '' }])
      }
    } catch (err) {
      dispatch(setPortfolioError(err.response?.data?.message || 'Failed to load'))
    } finally {
      dispatch(setPortfolioLoading(false))
    }
  }

  useEffect(() => { load() }, [])
  useEffect(() => {
    if (myPortfolio?.sections?.length) {
      setSectionTitle(myPortfolio.sections[0]?.title ?? '')
      setBlocks(sectionsToBlocks(myPortfolio.sections))
    }
  }, [myPortfolio])

  const handleSave = async () => {
    const payload = blocksToSections(sectionTitle, blocks.length ? blocks : [emptyBlock('paragraph')])
    try {
      const { data } = await portfolioApi.upsertMy({ sections: payload })
      dispatch(setMyPortfolio(data))
    } catch (err) {
      dispatch(setPortfolioError(err.response?.data?.message || 'Failed to save'))
    }
  }

  const addBlock = (type) => {
    setBlocks((prev) => [...prev, emptyBlock(type)])
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
  }

  const updateLinks = (index, linkIndex, field, value) => {
    setBlocks((prev) => {
      const next = [...prev]
      const block = next[index]
      if (block.type !== 'links' || !block.links) return prev
      const links = [...block.links]
      links[linkIndex] = { ...links[linkIndex], [field]: value }
      next[index] = { ...block, links }
      return next
    })
  }

  const addLink = (index) => {
    setBlocks((prev) => {
      const next = [...prev]
      const block = next[index]
      if (block.type !== 'links') return prev
      next[index] = { ...block, links: [...(block.links || []), { label: '', href: '' }] }
      return next
    })
  }

  const removeLink = (blockIndex, linkIndex) => {
    setBlocks((prev) => {
      const next = [...prev]
      const block = next[blockIndex]
      if (block.type !== 'links' || !block.links) return prev
      const links = block.links.filter((_, i) => i !== linkIndex)
      next[blockIndex] = { ...block, links: links.length ? links : [{ label: '', href: '' }] }
      return next
    })
  }

  const handleImageSelect = async (e, blockIndex) => {
    const file = e.target?.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { data } = await portfolioApi.uploadImage(file)
      if (data?.url) updateBlock(blockIndex, { url: data.url })
    } catch (err) {
      dispatch(setPortfolioError(err.response?.data?.message || 'Image upload failed'))
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
      <h1 className="text-2xl font-semibold text-zinc-900 mb-1">Portfolio Builder</h1>
      <p className="text-sm text-zinc-500 mb-6">
        Add paragraphs, headings, links (one or more), and images. Images are stored with Cloudinary. <strong>Voice / AI advice:</strong> say &quot;add image&quot; or &quot;insert an image&quot; to add an image block; &quot;new paragraph …&quot;, &quot;new heading one …&quot;.
      </p>

      <div className="card-advanced p-4 sm:p-6 mb-4">
        <label htmlFor="portfolio-title" className="block text-sm font-medium text-zinc-700 mb-2">Section title</label>
        <input
          id="portfolio-title"
          type="text"
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
          className="input-saas w-full mb-4"
          placeholder="e.g. About me"
        />

        {supported && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
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

        <div className="flex flex-wrap gap-2 mb-4">
          {BLOCK_TYPES.map(({ type, label, Icon }) => (
            <button key={type} type="button" onClick={() => addBlock(type)} className="btn-secondary gap-2">
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {blocks.map((block, index) => (
            <div key={index} className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-500 uppercase">
                  {block.type}
                  {block.type === 'heading' && ` (H${block.level ?? 1})`}
                </span>
                <button type="button" onClick={() => removeBlock(index)} className="p-1.5 rounded-lg text-zinc-500 hover:bg-red-50 hover:text-red-600" aria-label="Remove block">
                  <Delete className="w-4 h-4" />
                </button>
              </div>

              {block.type === 'paragraph' && (
                <textarea
                  value={block.content ?? ''}
                  onChange={(e) => updateBlock(index, { content: e.target.value })}
                  className="input-saas w-full resize-y min-h-[80px]"
                  placeholder="Paragraph text…"
                />
              )}

              {block.type === 'heading' && (
                <>
                  <input
                    type="text"
                    value={block.content ?? ''}
                    onChange={(e) => updateBlock(index, { content: e.target.value })}
                    className="input-saas w-full mb-2"
                    placeholder="Heading text…"
                  />
                  <select
                    value={block.level ?? 1}
                    onChange={(e) => updateBlock(index, { level: Number(e.target.value) })}
                    className="input-saas w-24"
                  >
                    <option value={1}>H1</option>
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                  </select>
                </>
              )}

              {block.type === 'links' && (
                <div className="space-y-2">
                  {(block.links || [{ label: '', href: '' }]).map((link, linkIndex) => (
                    <div key={linkIndex} className="flex gap-2 flex-wrap items-center">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateLinks(index, linkIndex, 'label', e.target.value)}
                        className="input-saas flex-1 min-w-[100px]"
                        placeholder="Link label"
                      />
                      <input
                        type="url"
                        value={link.href}
                        onChange={(e) => updateLinks(index, linkIndex, 'href', e.target.value)}
                        className="input-saas flex-1 min-w-[120px]"
                        placeholder="https://…"
                      />
                      <button type="button" onClick={() => removeLink(index, linkIndex)} className="p-2 rounded-lg text-zinc-500 hover:bg-red-50 hover:text-red-600" aria-label="Remove link">
                        <Delete className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addLink(index)} className="btn-tertiary gap-1 text-sm">
                    <Add className="w-4 h-4" /> Add link
                  </button>
                </div>
              )}

              {block.type === 'image' && (
                <div>
                  {block.url ? (
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <img
                        src={block.url}
                        alt={block.alt || ''}
                        className="rounded-lg object-cover border border-zinc-200 shrink-0"
                        style={{
                          width: block.width === 'auto' ? 'auto' : block.width,
                          height: block.height === 'auto' ? 'auto' : block.height,
                          maxWidth: '100%',
                          maxHeight: block.height === 'auto' ? 200 : undefined,
                        }}
                      />
                      <div className="flex-1 min-w-0 space-y-2">
                        <input
                          type="text"
                          value={block.alt ?? ''}
                          onChange={(e) => updateBlock(index, { alt: e.target.value })}
                          className="input-saas w-full"
                          placeholder="Alt text (optional)"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-0.5">Width</label>
                            <select
                              value={block.width ?? 'auto'}
                              onChange={(e) => updateBlock(index, { width: e.target.value })}
                              className="input-saas w-full text-sm"
                            >
                              <option value="auto">Auto</option>
                              <option value="150px">150px</option>
                              <option value="200px">200px</option>
                              <option value="250px">250px</option>
                              <option value="300px">300px</option>
                              <option value="100%">100%</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-0.5">Height</label>
                            <select
                              value={block.height ?? 'auto'}
                              onChange={(e) => updateBlock(index, { height: e.target.value })}
                              className="input-saas w-full text-sm"
                            >
                              <option value="auto">Auto</option>
                              <option value="120px">120px</option>
                              <option value="180px">180px</option>
                              <option value="240px">240px</option>
                              <option value="300px">300px</option>
                              <option value="400px">400px</option>
                            </select>
                          </div>
                        </div>
                        <button type="button" onClick={() => triggerImageUpload(index)} className="btn-secondary text-sm">
                          Replace image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => triggerImageUpload(index)}
                      disabled={uploading}
                      className="w-full py-8 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-60 transition-colors"
                    >
                      {uploading ? 'Uploading…' : 'Click to upload image (Cloudinary)'}
                    </button>
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
          <button type="button" onClick={handleSave} disabled={loading} className="btn-primary gap-2 disabled:opacity-60 flex items-center justify-center">
            {loading ? (
              <>
                <CircularProgress size={18} color="inherit" sx={{ color: 'white' }} />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
          <button type="button" onClick={() => setShowPreview(!showPreview)} className="btn-secondary gap-2">
            <Preview className="w-4 h-4" />
            {showPreview ? 'Hide' : 'Show'} preview
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="card-advanced p-6 overflow-hidden">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">{sectionTitle || 'Untitled'}</h2>
          <div className="prose prose-sm max-w-none space-y-3">
            {blocks.map((block, i) => {
              if (block.type === 'paragraph') return <p key={i} className="whitespace-pre-wrap text-zinc-700">{block.content || '\u00A0'}</p>
              if (block.type === 'heading') {
                const Tag = `h${Math.min(3, block.level || 1)}`
                return <Tag key={i} className="font-semibold text-zinc-900">{block.content || '\u00A0'}</Tag>
              }
              if (block.type === 'links' && block.links?.length) {
                return (
                  <ul key={i} className="list-none pl-0 space-y-1">
                    {block.links.filter((l) => l.label || l.href).map((link, j) => (
                      <li key={j}>
                        <a href={link.href || '#'} target="_blank" rel="noopener noreferrer" className="text-[var(--theme-primary)] hover:underline">
                          {link.label || link.href || 'Link'}
                        </a>
                      </li>
                    ))}
                  </ul>
                )
              }
              if (block.type === 'image' && block.url) {
                const imgStyle = {
                  width: block.width === 'auto' ? undefined : block.width,
                  height: block.height === 'auto' ? undefined : block.height,
                  maxWidth: '100%',
                  objectFit: 'cover',
                }
                return <img key={i} src={block.url} alt={block.alt || ''} className="rounded-lg" style={imgStyle} />
              }
              return null
            })}
          </div>
        </div>
      )}

      {myPortfolio?.publicSlug && (
        <p className="mt-4 text-sm text-[var(--theme-primary)] break-all">Public: /portfolios/public/{myPortfolio.publicSlug}</p>
      )}
    </div>
  )
}
