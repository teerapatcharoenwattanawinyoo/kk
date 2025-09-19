'use client'

import { useEffect, useRef } from 'react'

export function LineChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Chart data for 7 days (matches screenshot style)
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const totalCharge = [8, 18, 30, 22, 34, 28, 32]
    const avgPeriod = [12, 16, 20, 24, 26, 24, 27]

    // Chart dimensions
    const chartWidth = rect.width
    const chartHeight = rect.height
    const padding = { top: 20, right: 10, bottom: 30, left: 30 }
    const graphWidth = chartWidth - padding.left - padding.right
    const graphHeight = chartHeight - padding.top - padding.bottom

    // Clear canvas
    ctx.clearRect(0, 0, chartWidth, chartHeight)

    // Draw grid lines
    ctx.beginPath()
    ctx.strokeStyle = '#f1f5f9'
    ctx.lineWidth = 1

    // Horizontal grid lines
    const yStep = graphHeight / 5
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + yStep * i
      ctx.moveTo(padding.left, y)
      ctx.lineTo(chartWidth - padding.right, y)
    }

    // Vertical grid lines
    for (let i = 0; i < labels.length; i++) {
      const x = padding.left + (graphWidth / (labels.length - 1)) * i
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, chartHeight - padding.bottom)

      // Draw labels
      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(labels[i], x, chartHeight - 10)
    }

    ctx.stroke()

    const maxValue = 50 // 0k-50k scale like screenshot
    const points = labels.length
    const xStep = graphWidth / (points - 1)

    const xy = (arr: number[], i: number) => {
      const x = padding.left + xStep * i
      const y = padding.top + graphHeight - (arr[i] / maxValue) * graphHeight
      return { x, y }
    }

    // Draw AVG dashed line first (behind main)
    ctx.beginPath()
    ctx.strokeStyle = '#cbd5e1' // slate-300
    ctx.lineWidth = 2
    ctx.setLineDash([5, 4])
    for (let i = 0; i < points; i++) {
      const { x, y } = xy(avgPeriod, i)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.setLineDash([])

    // Draw main Total Charge line
    ctx.beginPath()
    ctx.strokeStyle = '#3b82f6' // blue-500
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    for (let i = 0; i < points; i++) {
      const { x, y } = xy(totalCharge, i)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Draw points
    for (let i = 0; i < points; i++) {
      const { x, y } = xy(totalCharge, i)
      ctx.beginPath()
      ctx.fillStyle = '#ffffff'
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw y-axis labels
    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px Inter, sans-serif'
    ctx.textAlign = 'right'

    for (let i = 0; i <= 5; i++) {
      const value = (5 - i) * 10
      const y = padding.top + yStep * i
      ctx.fillText(`${value}k`, padding.left - 5, y + 3)
    }
  }, [])

  return (
    <div className="h-[200px] w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
