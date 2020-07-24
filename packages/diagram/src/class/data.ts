import config from '../utils/config'
import { Node } from './node'
import { Line } from './line'
import { Point } from './point'

export class Data {
  nodes: Node[] = []
  lines: Line[] = []
  lineName?: string
  fromArrowType?: string
  toArrowType?: string
  scale?: number
  locked?: number
  constructor(options?: any) {
    if (options) {
      this.nodes = []
      for (const item of options.nodes) {
        this.nodes.push(new Node(item))
      }
      this.lines = []
      for (const item of options.lines) {
        if (item.from && !(item.from instanceof Point)) {
          item.from = this.translateLineOptionToPoint(this.nodes, item.from)
        }
        if (item.to && !(item.to instanceof Point)) {
          item.to = this.translateLineOptionToPoint(this.nodes, item.to)
        }
        this.lines.push(new Line(item))
      }
      this.lineName = options.lineName || config.defaultLineName
      this.fromArrowType = options.fromArrowType || config.defaultFromArrowType
      this.toArrowType = options.toArrowType || config.defaultToArrowType
      this.scale = options.scale || 1
      this.locked = options.locked || 0
    }
  }
  translateLineOptionToPoint(
    nodes: Array<Node>,
    options: { id: number | string; anchorIndex: number }
  ) {
    const node = nodes.find(item => item.key === options.id)
    if (node) {
      return node.anchors[options.anchorIndex]
    } else {
      return options
    }
  }
}
