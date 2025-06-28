import React, { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
}

const createNodes = (count: number, w: number, h: number): Node[] =>
  Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5
  }))

const draw = (ctx: CanvasRenderingContext2D, nodes: Node[]) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  nodes.forEach((n) => {
    n.x += n.vx
    n.y += n.vy
    if (n.x < 0 || n.x > ctx.canvas.width) n.vx *= -1
    if (n.y < 0 || n.y > ctx.canvas.height) n.vy *= -1
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.beginPath()
    ctx.arc(n.x, n.y, 2, 0, Math.PI * 2)
    ctx.fill()
  })
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const d = Math.hypot(dx, dy)
      if (d < 100) {
        ctx.strokeStyle = `rgba(255,255,255,${1 - d / 100})`
        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[j].x, nodes[j].y)
        ctx.stroke()
      }
    }
  }
}

const NeuralBackground: React.FC<{ className?: string }> = ({ className }) => {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    let ctx: CanvasRenderingContext2D | null = null
    try {
      ctx = canvas.getContext('2d')
    } catch {
      return undefined
    }
    if (!ctx) return undefined
    const nodes = createNodes(25, canvas.width, canvas.height)
    let id: number
    const render = () => {
      draw(ctx, nodes)
      id = requestAnimationFrame(render)
    }
    render()
    return () => cancelAnimationFrame(id)
  }, [])

  return <canvas ref={ref} width={600} height={300} className={className} />
}

export default React.memo(NeuralBackground)
