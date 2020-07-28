import config from '../../utils/config'
import { drawRoundedRect, fittingString } from '../../utils/externals'
import { Node, TableMode } from '../../class'

export function drawTableNode(
  ctx: CanvasRenderingContext2D,
  nodes: Array<Node>
) {
  nodes.forEach((item: Node) => {
    !item.table.hidden && _drawNode(ctx, new Node(item))
  })
}

function _drawNode(ctx: CanvasRenderingContext2D, item: Node) {
  if (ctx) {
    ctx.save()
    const w = Number(item.rect.w) || 100
    const h = Number(item.rect.h) || 50
    const x = Number(item.rect.x)
    const y = Number(item.rect.y)

    ctx.strokeStyle = item.active
      ? config.resizerStroke
      : config.tableNodeStroke
    ctx.fillStyle = config.tableNodeFill
    drawRoundedRect({
      ctx,
      x: x + 0.5,
      y: y + 0.5,
      width: w,
      height:
        config.tableHandle === TableMode.COLLAPSE && item.table.collapse
          ? item.table.titleRect.h
          : h,
      r: 0,
      fill: true,
      stroke: true,
      multichamber: false,
      shadow: true,
    })
    _drawTitle(ctx, item, w, x, y)
    if (item.table.isGroup && item.table.collapseRect) {
      _drawCollapse(ctx, item)
    }
    if (config.tableHandle === TableMode.COLLAPSE) {
      if (item.table.fields && !item.table.collapse && !item.table.isGroup) {
        _drawBody(ctx, item, w, x, y)
      }
    } else if (config.tableHandle === TableMode.SWITCH) {
      if (item.table.fields && !(item.table.isGroup !== item.table.collapse)) {
        _drawBody(ctx, item, w, x, y)
      }
    }
    item.active && drawResizer(ctx, item)
    ctx.restore()
  }
}
export function drawResizer(ctx: CanvasRenderingContext2D, node: Node) {
  if (node.table.hidden) return
  const resizer = node.calcResizer()
  for (let i = 0; i < resizer.length; ++i) {
    ctx.save()
    ctx.strokeStyle = config.resizerStroke
    ctx.fillStyle = config.resizerFill
    ctx.beginPath()
    ctx.fillRect(
      resizer[i].x - config.resizerWidth / 2,
      resizer[i].y - config.resizerWidth / 2,
      config.resizerWidth,
      config.resizerWidth
    )
    ctx.strokeRect(
      resizer[i].x - config.resizerWidth / 2,
      resizer[i].y - config.resizerWidth / 2,
      config.resizerWidth,
      config.resizerWidth
    )
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
}
export function drawAnchors(
  ctx: CanvasRenderingContext2D,
  node: Node,
  scale: number,
  scrollLeft: number,
  scrollTop: number
) {
  if (node.table.hidden) return
  node.calcAnchors()
  for (let i = 0; i < node.anchors.length; ++i) {
    if (node.anchors[i].hidden) {
      continue
    }
    ctx.save()
    ctx.strokeStyle = config.anchorStroke
    ctx.fillStyle = config.anchorFill
    ctx.beginPath()
    ctx.arc(
      node.anchors[i].x * scale - scrollLeft,
      node.anchors[i].y * scale - scrollTop,
      config.anchorRadius,
      0,
      Math.PI * 2
    )
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
}
function _drawCollapse(ctx: CanvasRenderingContext2D, node: Node) {
  if (ctx && node.table.collapseRect) {
    ctx.save()
    ctx.fillStyle = node.table.isGroup
      ? config.tableGroupTitleFill
      : config.tableTitleFill
    ctx.fillRect(
      node.table.collapseRect.x,
      node.table.collapseRect.y,
      node.table.collapseRect.w,
      node.table.collapseRect.h
    )
    ctx.restore()
  }
}
function _drawTitle(
  ctx: CanvasRenderingContext2D,
  node: Node,
  w: number,
  x: number,
  y: number
) {
  if (ctx) {
    if (node.padding && node.fontSize) {
      ctx.save()
      ctx.fillStyle = node.table.isGroup
        ? config.tableGroupTitleFill
        : config.tableTitleFill
      ctx.fillRect(
        node.table.titleRect.x,
        node.table.titleRect.y,
        node.table.titleRect.w,
        node.table.titleRect.h
      )

      ctx.font = `${config.fontSize}px ${config.fontFamily}`
      ctx.fillStyle = config.fontColor
      ctx.textAlign = config.textAlign as CanvasTextAlign
      ctx.textBaseline = config.textBaseline as CanvasTextBaseline
      ctx.fillText(
        fittingString(ctx, node.table.name, w - 14),
        x + node.padding,
        y + node.padding
      )
      ctx.restore()
    }
  }
}
function _drawBody(
  ctx: CanvasRenderingContext2D,
  node: Node,
  w: number,
  x: number,
  y: number
) {
  const padding = config.tablePadding
  const lineHeight = config.fontSize * config.lineHeight
  if (ctx) {
    ctx.save()
    node.table.fields &&
      node.table.fields.forEach((item: any, index) => {
        if (
          y + (index + 2) * lineHeight + padding <=
          node.rect.y + node.rect.h
        ) {
          if (item.primaryKey) {
            ctx.fillStyle = config.tablePrimarykeyFill
            ctx.fillRect(
              x + 1,
              y + (index + 1) * lineHeight + padding + 0.5,
              w - 1,
              lineHeight
            )
          }

          ctx.beginPath()
          ctx.strokeStyle = config.tableNodeStroke
          ctx.moveTo(x + 0.5, y + (index + 1) * lineHeight + padding + 0.5)
          ctx.lineTo(x + w + 0.5, y + (index + 1) * lineHeight + padding + 0.5)
          ctx.stroke()

          ctx.font = `${config.fontSize}px ${config.fontFamily}`
          ctx.fillStyle = config.fontColor
          ctx.textAlign = config.textAlign as CanvasTextAlign
          ctx.textBaseline = config.textBaseline as CanvasTextBaseline
          ctx.fillText(
            fittingString(ctx, item.name, w - padding * 2),
            padding + x,
            y + config.fontSize + padding * 2 + index * lineHeight
          )
        }
      })
    ctx.restore()
  }
}

export function toggleCollapse(nodes: Array<Node>, node: Node) {
  node.table.collapse = !node.table.collapse
  node.calcAnchors()
  const generations = node.getGenerations(nodes)
  if (generations) {
    generations.forEach(item => {
      const parent = item.getParentNode(nodes)
      if (parent) {
        item.table.hidden = parent.table.collapse || parent.table.hidden
      }
    })
  }
}
