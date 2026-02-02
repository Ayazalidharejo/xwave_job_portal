import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Mouse-follow 3D tilt + parallax for auth cards.
 * Returns card transform style and parallax offsets for background layers.
 * @param {Object} options - { maxTilt: number, smooth: number, parallaxFactor: number }
 */
export function useTilt3d(options = {}) {
  const {
    maxTilt = 10,
    smooth = 0.12,
    parallaxFactor = 1,
  } = options

  const [style, setStyle] = useState({
    rotateX: 0,
    rotateY: 0,
    parallaxX: 0,
    parallaxY: 0,
  })
  const rafRef = useRef(null)
  const targetRef = useRef({ rotateX: 0, rotateY: 0, px: 0, py: 0 })
  const currentRef = useRef({ ...style })
  const containerRef = useRef(null)

  const handleMove = useCallback((e) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const x = (e.clientX - cx) / (rect.width / 2)
    const y = (e.clientY - cy) / (rect.height / 2)
    targetRef.current = {
      rotateX: Math.max(-maxTilt, Math.min(maxTilt, -y * maxTilt)),
      rotateY: Math.max(-maxTilt, Math.min(maxTilt, x * maxTilt)),
      px: x * 24 * parallaxFactor,
      py: y * 24 * parallaxFactor,
    }
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [maxTilt, parallaxFactor])

  const handleLeave = useCallback(() => {
    targetRef.current = { rotateX: 0, rotateY: 0, px: 0, py: 0 }
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animate)
  }, [])

  function animate() {
    const target = targetRef.current
    const current = currentRef.current
    const lerp = (a, b, t) => a + (b - a) * t
    current.rotateX = lerp(current.rotateX, target.rotateX, smooth)
    current.rotateY = lerp(current.rotateY, target.rotateY, smooth)
    current.parallaxX = lerp(current.parallaxX, target.px, smooth)
    current.parallaxY = lerp(current.parallaxY, target.py, smooth)
    setStyle({
      rotateX: current.rotateX,
      rotateY: current.rotateY,
      parallaxX: current.parallaxX,
      parallaxY: current.parallaxY,
    })
    const stillMoving =
      Math.abs(current.rotateX - target.rotateX) > 0.01 ||
      Math.abs(current.rotateY - target.rotateY) > 0.01
    rafRef.current = stillMoving ? requestAnimationFrame(animate) : null
  }

  useEffect(() => {
    const doc = document
    doc.addEventListener('mousemove', handleMove, { passive: true })
    doc.addEventListener('mouseleave', handleLeave)
    return () => {
      doc.removeEventListener('mousemove', handleMove)
      doc.removeEventListener('mouseleave', handleLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleMove, handleLeave])

  return {
    containerRef,
    cardStyle: {
      transform: `perspective(1200px) rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transformStyle: 'preserve-3d',
      willChange: 'transform',
    },
    parallax: { x: style.parallaxX, y: style.parallaxY },
  }
}
