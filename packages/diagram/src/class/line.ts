import config from '../utils/config'
import { drawLineFns, drawArrowFns } from '../utils/register'
import { uuid } from '@lhn/utils'
import { Point } from './point'
import { Rect } from './rect'
import { Node } from './node'
import { Direction } from './direction'
import { LineMode } from './enums'

export class Line {
  id!: string
  name: string
  from!: Point
  to!: Point
  controlPoints: Point[] = []

  fromArrow?: string
  toArrow?: string
  fromArrowSize: number = 5
  toArrowSize: number = 5
  fromArrowColor?: string
  toArrowColor?: string

  text?: string
  active: boolean = false

  animateColor?: string
  animateSpan?: number
  animatePos?: number = 0
  textRect?: Rect | null
  isAnimate: boolean = false
  animateFromSize: number = 0
  animateToSize: number = 0
  animateType: any

  constructor(options?: Line) {
    if (options) {
      if (options.from) {
        this.from = options.from
      }
      if (options.to) {
        this.to = options.to
      }
      this.id = options.id || uuid()
      this.name = options.name || config.defaultLineName
      this.fromArrow = options.fromArrow || config.defaultFromArrowType
      this.toArrow = options.toArrow || config.defaultToArrowType
      this.calcControlPoints()
      if (options.controlPoints) {
        for (const item of options.controlPoints) {
          this.controlPoints.push(new Point(item.x, item.y, item.direction))
        }
      }
      this.animateColor = options.animateColor || ''
      this.animateSpan = options.animateSpan || 1
      this.text = options.text
    } else {
      this.name = config.defaultLineName
      this.fromArrow = config.defaultToArrowType
    }
  }

  calcTextRect() {
    const center = this.getCenter()
    const width = 50
    const height = config.lineHeight * config.fontSize
    this.textRect = new Rect(
      center.x - width / 2,
      center.y - height / 2,
      width,
      height
    )
  }

  getTextRect() {
    if (!this.textRect) {
      this.calcTextRect()
    }
    return this.textRect
  }

  pointIn(pos: Point) {
    return drawLineFns[this.name].pointIn(pos, this)
  }

  toTextPoints() {
    if (!this.textRect) return false
    return [
      new Point(this.textRect.x, this.textRect.y),
      new Point(this.textRect.x + this.textRect.w, this.textRect.y),
      new Point(
        this.textRect.x + this.textRect.w,
        this.textRect.y + this.textRect.h
      ),
      new Point(this.textRect.x, this.textRect.y + this.textRect.h),
    ]
  }

  getCenter() {
    let center = new Point(this.from.x, this.from.y)
    const i = Math.floor(this.controlPoints.length / 2)
    switch (this.name) {
      case 'polyline':
        center = this.getLineCenter(
          this.controlPoints[i - 1],
          this.controlPoints[i]
        )
        break
    }

    return center
  }

  getLineCenter(from: Point, to: Point) {
    return new Point((from.x + to.x) / 2, (from.y + to.y) / 2)
  }
  _drawText(ctx: CanvasRenderingContext2D) {
    this.getTextRect()
    if (ctx && this.text && this.textRect) {
      ctx.save()
      ctx.fillStyle = config.textRectFill
      ctx.strokeStyle = this.active
        ? config.textRectActiveStroke
        : config.textRectStroke
      ctx.fillRect(
        this.textRect.x,
        this.textRect.y,
        this.textRect.w,
        this.textRect.h
      )
      ctx.strokeRect(
        this.textRect.x,
        this.textRect.y,
        this.textRect.w,
        this.textRect.h
      )

      ctx.font = `${config.fontSize}px ${config.fontFamily}`
      ctx.fillStyle = config.fontColor
      ctx.textAlign = config.textAlign as CanvasTextAlign
      ctx.textBaseline = config.textBaseline as CanvasTextBaseline
      ctx.fillText(
        this.text,
        this.textRect.x +
          (this.textRect.w - ctx.measureText(this.text).width) / 2,
        this.textRect.y + (this.textRect.h - config.fontSize) / 2
      )
      ctx.restore()
    }
  }

  calcControlPoints() {
    if (this.from && this.to && drawLineFns[this.name]) {
      drawLineFns[this.name].controlPointsFn(this)
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    config.lineMode === LineMode.HANDLER && this.calcControlPoints()
    if (!this.isAnimate) {
      ctx.save()
      ctx.lineJoin = config.lineJoin as CanvasLineJoin
      ctx.lineWidth = config.lineWidth
      if (drawLineFns[this.name]) {
        drawLineFns[this.name].drawFn(ctx, this)
      }
      ctx.restore()
    }

    const scale = 1
    if (this.fromArrow && drawArrowFns[this.fromArrow]) {
      ctx.save()
      ctx.beginPath()
      ctx.lineDashOffset = 0
      ctx.setLineDash([])
      ctx.fillStyle = this.active ? config.arrowActiveFill : config.arrowFill
      ctx.strokeStyle = this.active
        ? config.arrowActiveStroke
        : config.arrowStroke
      let f = this.to
      f = this.controlPoints[0]
      drawArrowFns[this.fromArrow](
        ctx,
        f,
        this.from,
        this.fromArrowSize * scale
      )
      ctx.restore()
    }
    if (this.toArrow && drawArrowFns[this.toArrow]) {
      ctx.save()
      ctx.beginPath()
      ctx.lineDashOffset = 0
      ctx.setLineDash([])
      ctx.fillStyle = this.active ? config.arrowActiveFill : config.arrowFill
      ctx.strokeStyle = this.active
        ? config.arrowActiveStroke
        : config.arrowStroke
      let f = this.from
      f = this.controlPoints[this.controlPoints.length - 1]
      drawArrowFns[this.toArrow](ctx, f, this.to, this.toArrowSize * scale)
      ctx.restore()
    }
    if (config.lineMode === LineMode.HANDLER && this.active)
      drawLineFns[this.name].drawEndPointsFn(ctx, this)
    if (this.text && !this.isAnimate) {
      this.calcTextRect()
      this._drawText(ctx)
    }
  }

  getLineToDirection(to: Point) {
    const from = this.controlPoints[this.controlPoints.length - 1]
    if (to.y > from.y) return Direction.Up
    if (to.y < from.y) return Direction.Bottom
    if (to.x > from.x) return Direction.Left
    if (to.x < from.x) return Direction.Right
    return
  }

  hidden(nodes: Array<Node>): boolean {
    const from = nodes.find(node => node.key === this.from.id)
    const to = nodes.find(node => node.key === this.to.id)
    if (from?.table.hidden || to?.table.hidden) return true
    return false
  }

  getPointByPos(pos: number): Point | null {
    if (pos <= 0) {
      return this.from
    }
    switch (this.name) {
      case 'polyline':
        if (!this.controlPoints || !this.controlPoints.length) {
          return this.getLinePtByPos(this.from, this.to, pos)
        } else {
          const points = this.controlPoints.concat(this.to)
          let curPt = this.from
          for (const pt of points) {
            const l = this.lineLen(curPt, pt)
            if (pos > l) {
              pos -= l
              curPt = pt
            } else {
              return this.getLinePtByPos(curPt, pt, pos)
            }
          }
          return this.to
        }
    }
    return null
  }

  getLinePtByPos(from: Point, to: Point, pos: number) {
    const length = this.lineLen(from, to)
    if (pos <= 0) {
      return from
    }
    if (pos >= length) {
      return to
    }
    const x = from.x + (to.x - from.x) * (pos / length)
    const y = from.y + (to.y - from.y) * (pos / length)
    return new Point(x, y)
  }

  round() {
    this.from.round()
    this.to.round()
  }

  lineLen(from: Point, to: Point): number {
    const len = Math.sqrt(
      Math.abs(from.x - to.x) ** 2 + Math.abs(from.y - to.y) ** 2
    )
    return len | 0
  }

  translate(x: number, y: number) {
    this.from.x += x
    this.from.y += y
    this.to.x += x
    this.to.y += y

    for (const pt of this.controlPoints) {
      pt.x += x
      pt.y += y
    }
  }

  updateEndPoints(nodes: Array<Node>) {
    this.from = this.updateEndPoint(nodes, this.from)
    this.to = this.updateEndPoint(nodes, this.to)
    this.calcControlPoints()
  }
  updateEndPoint(nodes: Array<Node>, point: Point) {
    const node = nodes.find(item => item.key === point.id)
    if (node) {
      return node.anchors[point.anchorIndex]
    } else {
      return point
    }
  }
  _calcPosition(pos: Point, node: Node, delta: { x: number; y: number }) {
    const nodeRect = node.toRect()
    if (pos.direction === Direction.Bottom || pos.direction === Direction.Up) {
      pos.x += delta.x
      if (pos.x > nodeRect.ex) {
        pos.x = nodeRect.ex
        pos.y = nodeRect.y + nodeRect.h / 2
        pos.updateDirection(Direction.Right)
      }
      if (pos.x < nodeRect.x) {
        pos.x = nodeRect.x
        pos.y = nodeRect.y + nodeRect.h / 2
        pos.updateDirection(Direction.Left)
      }
    } else {
      pos.y += delta.y
      if (pos.y > nodeRect.ey) {
        pos.y = nodeRect.ey
        pos.x = nodeRect.x + nodeRect.w / 2
        pos.updateDirection(Direction.Bottom)
      }
      if (pos.y < nodeRect.y) {
        pos.y = nodeRect.y
        pos.x = nodeRect.x + nodeRect.w / 2
        pos.updateDirection(Direction.Up)
      }
    }
  }
  lineMove(from: Node, to: Node, delta: { x: number; y: number }) {
    this._calcPosition(this.from, from, delta)
    this._calcPosition(this.to, to, delta)
  }
  lineEndMove(pos: Point, node: Node, delta: { x: number; y: number }) {
    const nodeRect = node.toRect()
    if (pos.direction === Direction.Bottom || pos.direction === Direction.Up) {
      pos.x += delta.x
      if (pos.x > nodeRect.ex) {
        pos.x = nodeRect.ex
        pos.updateDirection(Direction.Right)
      }
      if (pos.x < nodeRect.x) {
        pos.x = nodeRect.x
        pos.updateDirection(Direction.Left)
      }
    } else {
      pos.y += delta.y
      if (pos.y > nodeRect.ey) {
        pos.y = nodeRect.ey
        pos.updateDirection(Direction.Bottom)
      }
      if (pos.y < nodeRect.y) {
        pos.y = nodeRect.y
        pos.updateDirection(Direction.Up)
      }
    }
  }
}
