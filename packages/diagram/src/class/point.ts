import { Direction, Resize } from './direction'
import { Node } from './node'
export class Point {
  constructor(
    public x: number,
    public y: number,
    public direction?: Direction | Resize,
    public id?: number | string,
    public hidden?: boolean,
    public anchorIndex: number = 0
  ) {
    this.id = id
    this.direction = direction
    this.anchorIndex = direction || 0
    this.hidden = hidden || false
  }

  clone(): Point {
    return new Point(this.x, this.y, this.direction)
  }

  floor() {
    this.x |= 0
    this.y |= 0
  }

  round() {
    this.x = Math.round(this.x)
    this.y = Math.round(this.y)
  }

  hit(pt: Point, radius = 5) {
    return (
      pt.x > this.x - radius &&
      pt.x < this.x + radius &&
      pt.y > this.y - radius &&
      pt.y < this.y + radius
    )
  }

  rotate(angle: number, center: { x: number; y: number }): Point {
    if (!angle || angle === 360) {
      return this
    }

    angle *= Math.PI / 180
    const x =
      (this.x - center.x) * Math.cos(angle) -
      (this.y - center.y) * Math.sin(angle) +
      center.x
    const y =
      (this.x - center.x) * Math.sin(angle) +
      (this.y - center.y) * Math.cos(angle) +
      center.y
    this.x = x
    this.y = y
    return this
  }

  getLinkNode(nodes: Array<Node>) {
    return nodes.find(node => node.key === this.id)
  }

  updateDirection(direction: Direction) {
    this.direction = direction
    this.anchorIndex = direction
  }
}
