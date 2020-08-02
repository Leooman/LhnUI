import config from '../utils/config'
import { Direction, Resize } from './direction'
import { Point } from './point'
import { Rect } from './rect'
import { Line } from './line'
import { LineMode, TableMode } from './enums'
export type TableFields = {
  name: string
  primaryKey: boolean
}
type Table = {
  isGroup: boolean
  name: string
  fields?: Array<TableFields>
  titleRect: Rect
  collapseRect: Rect | null
  collapse?: boolean
  hidden?: boolean
}
export class Node {
  key!: number
  parent?: number
  rect!: Rect
  table!: Table
  padding?: number
  fontSize?: number
  alias?: string
  active?: boolean
  anchors: Array<Point>
  constructor(options: Node) {
    this.key = options.key
    this.parent = options.parent
    this.rect = options.rect
    this.padding = options.padding || config.tablePadding
    this.fontSize = options.fontSize || config.fontSize
    this.table = options.table
    this.table.collapse = options.table.collapse || false
    this.table.hidden = options.table.hidden || false
    this.table.name = options.table.name || config.tableName
    this.table.titleRect = new Rect(
      this.rect.x + 0.5,
      this.rect.y + 0.5,
      this.table.isGroup
        ? this.rect.w - (this.fontSize + this.padding * 2)
        : this.rect.w - 0.5,
      this.fontSize + this.padding * 2
    )
    this.table.collapseRect = this.table.isGroup
      ? new Rect(
          this.rect.x + this.rect.w - this.fontSize - this.padding * 2,
          this.rect.y + 0.5,
          this.fontSize + this.padding * 2,
          this.fontSize + this.padding * 2
        )
      : null
    this.alias = options.alias || ''
    this.active = options.active || false
    this.anchors = options.anchors || this.calcAnchors()
  }
  toPoints() {
    return [
      new Point(this.rect.x, this.rect.y),
      new Point(this.rect.x + this.rect.w, this.rect.y),
      new Point(
        this.rect.x + this.rect.w,
        this.rect.y +
          (config.tableHandle === TableMode.COLLAPSE && this.table.collapse
            ? this.table.titleRect.h
            : this.rect.h)
      ),
      new Point(
        this.rect.x,
        this.rect.y +
          (config.tableHandle === TableMode.COLLAPSE && this.table.collapse
            ? this.table.titleRect.h
            : this.rect.h)
      ),
    ]
  }
  toRect() {
    return new Rect(
      this.rect.x,
      this.rect.y,
      this.rect.w,
      config.tableHandle === TableMode.COLLAPSE && this.table.collapse
        ? this.table.titleRect.h
        : this.rect.h
    )
  }
  translate(delta: { x: number; y: number }, lines?: Array<Line>) {
    this.rect.x += delta.x
    this.rect.y += delta.y
    this.calcAnchors()
    if (config.lineMode === LineMode.HANDLER && lines) {
      lines.forEach(line => {
        if (line.from.id === this.key) {
          line.from.x += delta.x
          line.from.y += delta.y
        }
        if (line.to.id === this.key) {
          line.to.x += delta.x
          line.to.y += delta.y
        }
      })
    }
  }
  calcResizer() {
    const resizer = []
    resizer.push(new Point(this.rect.x, this.rect.y, Resize.LeftTop, this.key))
    resizer.push(
      new Point(
        this.rect.x + this.rect.w,
        this.rect.y,
        Resize.RightTop,
        this.key
      )
    )
    resizer.push(
      new Point(
        this.rect.x + this.rect.w,
        this.rect.y +
          (config.tableHandle === TableMode.COLLAPSE && this.table.collapse
            ? this.table.titleRect.h
            : this.rect.h),
        Resize.RightBottom,
        this.key
      )
    )
    resizer.push(
      new Point(
        this.rect.x,
        this.rect.y +
          (config.tableHandle === TableMode.COLLAPSE && this.table.collapse
            ? this.table.titleRect.h
            : this.rect.h),
        Resize.LeftBottom,
        this.key
      )
    )
    return resizer
  }
  hitResizer(pos: Point) {
    if (!this.active) return
    const resizer = this.calcResizer()
    return resizer.findIndex(item => item.hit(pos, config.resizerWidth / 2))
  }
  resize(
    nodes: Array<Node>,
    direction: Resize,
    delta: { x: number; y: number },
    lines?: Array<Line>
  ) {
    if (config.tableHandle === 0 && this.table.collapse) return
    if (this.rect.h < this.table.titleRect.h) {
      this.rect.h = this.table.titleRect.h
      return
    }
    const parentNode = this.getParentNode(nodes)
    switch (direction) {
      case Resize.LeftTop:
        if (parentNode) {
          this.resizeFromParent(parentNode, delta, Direction.Left)
          this.resizeFromParent(parentNode, delta, Direction.Up)
        } else {
          this.rect.x += delta.x
          this.rect.y += delta.y
          this.rect.w -= delta.x
          this.rect.h -= delta.y
        }
        break
      case Resize.RightTop:
        if (parentNode) {
          this.resizeFromParent(parentNode, delta, Direction.Right)
          this.resizeFromParent(parentNode, delta, Direction.Up)
        } else {
          this.rect.y += delta.y
          this.rect.w += delta.x
          this.rect.h -= delta.y
        }
        break
      case Resize.RightBottom:
        if (parentNode) {
          this.resizeFromParent(parentNode, delta, Direction.Right)
          this.resizeFromParent(parentNode, delta, Direction.Bottom)
        } else {
          this.rect.w += delta.x
          this.rect.h += delta.y
        }
        break
      case Resize.LeftBottom:
        if (parentNode) {
          this.resizeFromParent(parentNode, delta, Direction.Left)
          this.resizeFromParent(parentNode, delta, Direction.Bottom)
        } else {
          this.rect.x += delta.x
          this.rect.w -= delta.x
          this.rect.h += delta.y
        }
        break
    }
    this.calcAnchors()
    if (config.lineMode === LineMode.HANDLER && lines) {
      lines.forEach(line => {
        if (line.from.id === this.key) this._calcLinePosition(line.from)
        if (line.to.id === this.key) this._calcLinePosition(line.to)
      })
    }
  }
  resizeFromParent(
    parent: Node,
    delta: { x: number; y: number },
    direction: Direction
  ) {
    switch (direction) {
      case Direction.Left:
        if (this.rect.x + delta.x <= parent.rect.x) {
          this.rect.x = parent.rect.x
        } else {
          this.rect.x += delta.x
          this.rect.w -= delta.x
        }
        break
      case Direction.Up:
        if (this.rect.y + delta.y <= parent.rect.y + parent.table.titleRect.h) {
          this.rect.y = parent.rect.y + parent.table.titleRect.h
        } else {
          this.rect.y += delta.y
          this.rect.h -= delta.y
        }
        break
      case Direction.Right:
        if (
          this.rect.x + this.rect.w + delta.x >=
          parent.rect.x + parent.rect.w
        ) {
          // this.rect.w = parent.rect.x + parent.rect.w
        } else {
          this.rect.w += delta.x
        }
        break
      case Direction.Bottom:
        if (
          this.rect.y + this.rect.h + delta.y >=
          parent.rect.y + parent.rect.h
        ) {
          // this.rect.h = parent.rect.y + parent.rect.h
        } else {
          this.rect.h += delta.y
        }
        break
    }
  }
  _calcLinePosition(pos: Point) {
    if (pos.direction === Direction.Bottom || pos.direction === Direction.Up) {
      pos.y =
        pos.direction === Direction.Bottom
          ? this.rect.y + this.rect.h
          : this.rect.y
      if (pos.x < this.rect.x) pos.x = this.rect.x
      if (pos.x > this.rect.x + this.rect.w) pos.x = this.rect.x + this.rect.w
    }
    if (pos.direction === Direction.Left || pos.direction === Direction.Right) {
      pos.x =
        pos.direction === Direction.Left
          ? this.rect.x
          : this.rect.x + this.rect.w
      if (pos.y < this.rect.y) pos.y = this.rect.y
      if (pos.y > this.rect.y + this.rect.h) pos.y = this.rect.y + this.rect.h
    }
  }
  calcAnchors() {
    this.anchors = []
    this.anchors.push(
      new Point(
        this.rect.x + this.rect.w / 2,
        this.rect.y,
        Direction.Up,
        this.key
      )
    )
    this.anchors.push(
      new Point(
        this.rect.x + this.rect.w,
        this.rect.y +
          (config.tableHandle === TableMode.COLLAPSE && this.table.collapse
            ? this.table.titleRect.h / 2
            : this.rect.h / 2),
        Direction.Right,
        this.key
      )
    )
    this.anchors.push(
      new Point(
        this.rect.x + this.rect.w / 2,
        this.rect.y +
          (config.tableHandle === TableMode.COLLAPSE && this.table.collapse
            ? this.table.titleRect.h
            : this.rect.h),
        Direction.Bottom,
        this.key
      )
    )
    this.anchors.push(
      new Point(
        this.rect.x,
        this.rect.y +
          (config.tableHandle === TableMode.COLLAPSE && this.table.collapse
            ? this.table.titleRect.h / 2
            : this.rect.h / 2),
        Direction.Left,
        this.key
      )
    )
    return this.anchors
  }
  getChildNode(nodes: Array<Node>) {
    return nodes.filter((item: Node) => item.parent === this.key)
  }
  getGenerations(nodes: Array<Node>) {
    const generations: Node[] = []
    const getChild = function(node: Node) {
      const child = node.getChildNode(nodes)
      if (child) {
        generations.push(...child)
        child.forEach((item: Node) => getChild(item))
      }
    }
    getChild(this)
    return generations
  }
  getParentNode(nodes: Array<Node>) {
    return nodes.find((item: Node) => item.key === this.parent)
  }
  outBounds(nodes: Array<Node>, delta: { x: number; y: number }): boolean {
    const rect = this.table.collapse ? this.table.titleRect : this.rect
    const parentNode = this.getParentNode(nodes)
    if (parentNode) {
      return (
        rect.x + rect.w + delta.x >= parentNode.rect.x + parentNode.rect.w ||
        rect.x + delta.x <= parentNode.rect.x ||
        rect.y + delta.y <= parentNode.rect.y + parentNode.table.titleRect.h ||
        rect.y + rect.h + delta.y >= parentNode.rect.y + parentNode.rect.h
      )
    }
    return false
  }
  updateNodeAnchorStatus(status: boolean) {
    for (let i = 0; i < this.anchors.length; ++i) {
      this.anchors[i].hidden = status
    }
  }
}
