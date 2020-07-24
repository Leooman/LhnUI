interface RoundedRect {
  ctx: any
  x: number
  y: number
  width: number
  height: number
  r: number
  fill: boolean
  stroke: boolean
  multichamber: boolean
  shadow: boolean
}
export function drawRoundedRect({
  ctx,
  x,
  y,
  width,
  height,
  r,
  fill,
  stroke,
  multichamber,
  shadow,
}: RoundedRect) {
  // 多物理表时多框偏移量
  const offset = 3

  ctx.save()
  ctx.beginPath()

  // 绘制外圈
  if (multichamber) {
    let times = 0
    while (times++ < 2) {
      ctx.moveTo(x + offset * times, y - offset * (times - 1))
      ctx.arcTo(
        x + offset * times,
        y - offset * times,
        x + r + offset * times,
        y - offset * times,
        r
      )
      ctx.arcTo(
        x + width + offset * times,
        y - offset * times,
        x + width + offset * times,
        y + r - offset * times,
        r
      )
      ctx.arcTo(
        x + width + offset * times,
        y + height - offset * times,
        x + width - r + offset * times,
        y + height - offset * times,
        r
      )
      !r &&
        ctx.lineTo(
          x + width - r + offset * (times - 1),
          y + height - offset * times
        )
    }
  }

  // 绘制内圈
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + r, r)
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r)
  ctx.arcTo(x, y + height, x, y + height - r, r)
  ctx.arcTo(x, y, x + r, y, r)

  if (shadow) {
    ctx.shadowColor = '#B0B0B0'
    ctx.shadowBlur = 8
    ctx.shadowOffsetX = 3
    ctx.shadowOffsetY = 3
  }
  if (fill) {
    ctx.fill()
  }
  if (stroke) {
    ctx.stroke()
  }
  ctx.restore()
}

export function drawShading(
  ctx: CanvasRenderingContext2D,
  canvas: any,
  scaleRatio: number
) {
  const max =
    Math.max(canvas.width, canvas.height) / (scaleRatio < 1 ? scaleRatio : 1)
  if (ctx) {
    ctx.save()
    let i = 0
    const gap = 10
    while (i * gap < max) {
      ctx.strokeStyle = i % 4 ? '#F8F8F8' : '#EBEBEB'
      ctx.beginPath()
      ctx.moveTo(i * gap - 0.5, -0.5)
      ctx.lineTo(i * gap - 0.5, max - 0.5 + 50)
      ctx.stroke()
      ++i
    }
    i = 0
    while (i * gap < max) {
      ctx.strokeStyle = i % 4 ? '#F8F8F8' : '#EBEBEB'
      ctx.beginPath()
      ctx.moveTo(-0.5, i * gap - 0.5)
      ctx.lineTo(max - 0.5 + 50, i * gap - 0.5)
      ctx.stroke()
      ++i
    }
    ctx.restore()
  }
}

export function fittingString(ctx: any, str: string, maxWidth: number) {
  let strWidth = ctx.measureText(str).width
  const ellipsis = '…'
  const ellipsisWidth = ctx.measureText(ellipsis).width
  if (strWidth <= maxWidth || maxWidth <= ellipsisWidth) {
    return str
  } else {
    let len = str.length
    while (strWidth >= maxWidth - ellipsisWidth && len-- > 0) {
      str = str.slice(0, len)
      strWidth = ctx.measureText(str).width
    }
    return str + ellipsis
  }
}
