import { pointInRect } from '../utils/utils'
import { Point } from './point'

export class Rect {
  ex!: number
  ey!: number
  center: Point = new Point(0, 0)
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number
  ) {
    if (w < 0) {
      w = 0
    }
    if (h < 0) {
      h = 0
    }
    this.init()
  }

  init() {
    this.ex = this.x + this.w
    this.ey = this.y + this.h
    this.calcCenter()
  }

  floor() {
    this.x |= 0
    this.y |= 0
    this.w |= 0
    this.h |= 0
    this.init()
  }

  round() {
    this.x = Math.round(this.x)
    this.y = Math.round(this.y)
    this.w = Math.round(this.w)
    this.h = Math.round(this.h)
    this.init()
  }

  clone(): Rect {
    return new Rect(this.x, this.y, this.w, this.h)
  }

  hit(pt: Point, padding = 0) {
    return (
      pt.x > this.x - padding &&
      pt.x < this.ex + padding &&
      pt.y > this.y - padding &&
      pt.y < this.ey + padding
    )
  }

  hitByRect(rect: Rect) {
    return (
      (rect.x > this.x &&
        rect.x < this.ex &&
        rect.y > this.y &&
        rect.y < this.ey) ||
      (rect.ex > this.x &&
        rect.ex < this.ex &&
        rect.y > this.y &&
        rect.y < this.ey) ||
      (rect.ex > this.x &&
        rect.ex < this.ex &&
        rect.ey > this.y &&
        rect.ey < this.ey) ||
      (rect.x > this.x &&
        rect.x < this.ex &&
        rect.ey > this.y &&
        rect.ey < this.ey)
    )
  }

  hitRotate(point: Point, rotate: number, center: Point) {
    const pts = this.toPoints()
    for (const pt of pts) {
      pt.rotate(rotate, center)
    }

    return pointInRect(point, pts)
  }

  calcCenter() {
    this.center.x = this.x + this.w / 2
    this.center.y = this.y + this.h / 2
  }

  toPoints() {
    return [
      new Point(this.x, this.y),
      new Point(this.ex, this.y),
      new Point(this.ex, this.ey),
      new Point(this.x, this.ey),
    ]
  }

  translate(x: number, y: number) {
    this.x += x
    this.y += y
    this.ex += x
    this.ey += y
    this.calcCenter()
  }

  scale(scale: number, center?: Point, scaleY?: number) {
    if (!center) {
      center = this.center
    }

    if (scaleY === undefined) {
      scaleY = scale
    }

    this.x = center.x - (center.x - this.x) * scale
    this.y = center.y - (center.y - this.y) * scaleY
    this.w *= scale
    this.h *= scaleY
    this.init()
  }
}
