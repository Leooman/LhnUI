import config from './utils/config'
import {
  DefalutOptions,
  Options,
  Node,
  Line,
  Data,
  Point,
  EventType,
  LineMode,
} from './class'
import { drawTableNode } from './models/node/table'
import { pointInRect } from './utils/utils'
import { uuid } from '@lhn/utils'
import { drawShading, drawThumbnail } from './utils/externals'
import { MouseupStrategy, MousemoveStrategy, MousedownStrategy } from './events'
export class DiagramRenderer {
  private data: any
  canvas: HTMLCanvasElement = document.createElement('canvas')
  width: number = 0
  height: number = 0
  scaleRatio: number = 1
  grid: boolean | undefined
  ctx: CanvasRenderingContext2D | null
  canvasPos: any
  activeHoverNode: Node | undefined
  activeNode: Node | undefined
  eventType: EventType = EventType.NONE
  nodes: Array<Node> = []
  lines: Array<Line> = []
  mousedownPos: Point = new Point(0, 0)
  activeAnchor: Point = new Point(0, 0)
  newLineID: string = ''
  activeResizer: number = 0
  activeLineText?: Line
  activeLine?: Line
  activeLineControl?: Point
  scrollTop: number = 0
  scrollLeft: number = 0
  padding: number = 10
  thumbnail?: HTMLCanvasElement
  thumbnailCtx?: CanvasRenderingContext2D | null
  thumbnailScale: number = 1
  thumbnailActive: boolean = false
  constructor(public parentElem: HTMLElement, public options: Options = {}) {
    this.ctx = this.canvas.getContext('2d')
    if (config.thumbnail) {
      this.thumbnail = document.createElement('canvas')
      this.thumbnail.width = config.thumbnailW
      this.thumbnail.height = config.thumbnailH
      this.thumbnail.setAttribute(
        'style',
        'position: absolute; z-index: 3; bottom:15px; right: 15px;border: 3px solid rgba(192,192,192,0.5);border-radius: 3px;'
      )
      this.thumbnailCtx = this.thumbnail.getContext('2d')
      this.parentElem.appendChild(this.thumbnail)
    }
    this.load(Object.assign({}, DefalutOptions, options))
  }
  load(options: Options) {
    const { grid, data } = options
    this.grid = grid
    this.data = new Data(data)
    this.nodes = this.data.nodes
    this.lines = this.data.lines

    this.initCanvasWH()
    this.parentElem.appendChild(this.canvas)

    // 注册事件监听
    this.registerEventListeners()
    if (config.thumbnail && this.thumbnail) {
      this.registerThumbnailEventListeners()
    }

    this.render()
  }
  render() {
    if (this.ctx) {
      this.ctx.save()
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.grid && drawShading(this.ctx, this.canvas, this.scaleRatio)
      this.ctx.translate(-this.scrollLeft, -this.scrollTop)
      this.ctx.scale(this.scaleRatio, this.scaleRatio)
      drawTableNode(this.ctx, this.nodes)

      this.lines.forEach(line => {
        if (!line.hidden(this.nodes)) {
          // ANCHOR模式下根据锚点计算端点位置
          config.lineMode === LineMode.ANCHOR &&
            line.updateEndPoints(this.nodes)
          this.ctx && line.draw(this.ctx)
        }
      })
      this.ctx.restore()
      if (config.thumbnail) {
        drawThumbnail(this)
      }
    }
  }
  registerEventListeners() {
    const eventListeners = this._registerListener()
    for (const eventName in eventListeners) {
      const eventArr = Array.isArray(eventListeners[eventName])
        ? eventListeners[eventName]
        : [eventListeners[eventName]]

      for (const eventItem of eventArr) {
        this.canvas.addEventListener(eventName, eventItem.fn)
      }
    }
  }
  registerThumbnailEventListeners() {
    if (this.thumbnail) {
      const eventListeners = this._registerThumbnailListener()
      for (const eventName in eventListeners) {
        const eventArr = Array.isArray(eventListeners[eventName])
          ? eventListeners[eventName]
          : [eventListeners[eventName]]

        for (const eventItem of eventArr) {
          this.thumbnail.addEventListener(eventName, eventItem.fn)
        }
      }
    }
  }
  removeListener(events: any, listener?: string) {
    console.log(listener)
    for (const eventName in events) {
      const eventArr = Array.isArray(events[eventName])
        ? events[eventName]
        : [events[eventName]]

      for (const eventItem of eventArr) {
        eventItem.el.removeEventListener(eventName, eventItem.fn)
      }
    }
  }
  initCanvasWH() {
    this.width = this.canvas.width =
      this.parentElem.clientWidth / this.scaleRatio
    this.height = this.canvas.height =
      this.parentElem.clientHeight / this.scaleRatio
    this.parentElem.setAttribute(
      'style',
      `width:${this.width}px;height:${this.height}px`
    )
  }
  resize(size: { width: number; height: number }) {
    this.width = size.width
    this.height = size.height
    this.parentElem.setAttribute(
      'style',
      `width:${this.width}px;height:${this.height}px`
    )
    this.updateCanvasWH()
    this.render()
  }
  updateCanvasWH() {
    const nodes = this.nodes.filter(node => !node.parent)
    let maxWidth = 0
    let maxHeight = 0
    nodes.forEach(node => {
      maxWidth = Math.max(maxWidth, node.rect.x + node.rect.w)
      maxHeight = Math.max(maxHeight, node.rect.y + node.rect.h)
    })
    this.canvas.width = Math.max(this.width, maxWidth)
    this.canvas.height = Math.max(this.height, maxHeight)
  }
  _calcMousePos(e: MouseEvent): Point {
    const canvasPos = this.canvas.getBoundingClientRect() as DOMRect
    return new Point(
      (e.x - canvasPos.x + this.scrollLeft) / this.scaleRatio,
      (e.y - canvasPos.y + this.scrollTop) / this.scaleRatio
    )
  }
  getActiveHoverNode(pos: Point, oldNode: Node | undefined) {
    if (oldNode) {
      oldNode.updateNodeAnchorStatus(true)
    }
    const node = this.inNode(this.nodes, pos)
    if (node) {
      if (!oldNode) {
        node.updateNodeAnchorStatus(false)
        return node
      }
      if (node.key === oldNode.key) {
        return node
      } else {
        oldNode.updateNodeAnchorStatus(true)
        node.updateNodeAnchorStatus(false)
        return node
      }
    }
    return
  }
  getActiveNode(pos: Point) {
    if (this.eventType === EventType.NODERESIZE) return this.activeNode
    const node = this.inNode(this.nodes, pos)
    if (node && this.activeNode) {
      if (node.key === this.activeNode.key) return this.activeNode
      return node
    } else {
      return this.activeNode || node
    }
  }
  getLineControl(line: Line, pos: Point): Point | undefined {
    if (line.from.hit(pos, config.anchorRadius)) return line.from
    if (line.to.hit(pos, config.anchorRadius)) return line.to
    return
  }
  getHitAnchor(node: Node, pos: Point): Point | undefined {
    if (node.anchors) {
      const anchor = node.anchors.find(item => {
        return item.hit(pos, config.anchorRadius)
      })
      return anchor
    }
    return
  }
  inNode(nodes: Array<Node>, pos: Point): Node | undefined {
    // const node = nodes.find((node: Node) => {
    //   if (node.table.hidden) return false
    //   return pointInRect(pos, node.toPoints())
    // })
    let node
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (!nodes[i].table.hidden && pointInRect(pos, nodes[i].toPoints())) {
        node = nodes[i]
        break
      }
    }
    if (node) {
      const children = node.getChildNode(this.nodes)
      const child = this.inNode(children, pos)
      return child || node
    }
    return node
  }

  inLineText(lines: Array<Line>, pos: Point): Line | boolean {
    const line = lines.find((line: Line) => {
      const points = line.toTextPoints()
      if (points) {
        return pointInRect(pos, points)
      }
      return false
    })
    if (line) return line
    return false
  }

  addNode(node: Node) {
    if (this.data.locked) return
    this.nodes.push(new Node(node))
    this.render()
  }

  getActiveLine(pos: Point) {
    return this.lines.find(line => {
      return line.pointIn(pos)
    })
  }

  updateNodeActive(activeNode?: Node) {
    this.nodes.forEach(node => {
      node.active = activeNode ? activeNode.key === node.key : false
    })
  }
  updateLineActive(activeLine?: Line) {
    this.lines.forEach(line => {
      line.active = activeLine ? activeLine.id === line.id : false
    })
  }

  addLine(line: any) {
    if (this.data.locked) return

    const sameLine = this.lines.find(
      (item: { id: string }) => item.id === line.id
    )
    if (sameLine) {
      Object.assign(sameLine, line)
    } else {
      this.lines.push(new Line(line))
    }
    this.render()
  }
  calcScrollDistance(delta: { x: number; y: number }) {
    if (this.scrollLeft - delta.x <= 0) {
      this.scrollLeft = 0
    } else if (this.scrollLeft - delta.x >= this.canvas.width - this.width) {
      this.scrollLeft = this.canvas.width - this.width
    } else {
      this.scrollLeft -= delta.x
    }
    if (this.scrollTop - delta.y <= 0) {
      this.scrollTop = 0
    } else if (this.scrollTop - delta.y >= this.canvas.height - this.height) {
      this.scrollTop = this.canvas.height - this.height
    } else {
      this.scrollTop -= delta.y
    }
  }
  removeInvalidLine() {
    this.lines.splice(
      this.lines.findIndex(item => item.id === this.newLineID),
      1
    )
    this.render()
  }
  calcDelta(newPoint: Point, oldPoint: Point) {
    return {
      x: Number(((newPoint.x - oldPoint.x) * this.scaleRatio).toPrecision(1)),
      y: Number(((newPoint.y - oldPoint.y) * this.scaleRatio).toPrecision(1)),
    }
  }
  handleDblClick() {
    return this.activeHoverNode
  }
  handleTextClick() {
    return this.activeLineText
  }
  getParentNode(nodes: Array<Node>, pos: Point): Node | undefined {
    let node
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (!nodes[i].table.hidden && pointInRect(pos, nodes[i].toPoints())) {
        node = nodes[i]
        break
      }
    }
    return node
  }
  handleDragover(e: DragEvent) {
    const pos = new Point(
      (e.offsetX + this.scrollLeft) / this.scaleRatio,
      (e.offsetY + this.scrollTop) / this.scaleRatio
    )
    const parent = this.getParentNode(
      this.nodes.filter(node => node.table.isGroup),
      pos
    )
    if (parent) {
      return {
        key: uuid(),
        parent: parent.key,
        rect: {
          x: parent.rect.x,
          y: parent.rect.y + parent.table.titleRect.h,
          w: config.tableDefaultW,
          h: config.tableDefaultH,
        },
      }
    } else {
      return {
        key: uuid(),
        rect: {
          x: pos.x,
          y: pos.y,
          w: config.tableDefaultW,
          h: config.tableDefaultH,
        },
      }
    }
  }
  _registerListener(): any {
    const _this = this
    const MouseupEvent = new MouseupStrategy(this)
    const MousemoveEvent = new MousemoveStrategy(this)
    const MousedownEvent = new MousedownStrategy(this)
    // (兼容FF)
    const mousewheel =
      typeof window.onmousewheel === 'object' ? 'mousewheel' : 'DOMMouseScroll'
    return {
      mousedown: {
        fn(e: MouseEvent) {
          MousedownEvent.excute(e)
        },
      },
      mousemove: {
        fn(e: MouseEvent) {
          MousemoveEvent.setState(_this.eventType).excute(e)
        },
      },
      mouseup: {
        fn(e: MouseEvent) {
          MouseupEvent.setState(_this.eventType)
            .excute(e)
            .reset()
        },
      },
      dblclick: {
        fn(e: MouseEvent) {
          const pos = _this._calcMousePos(e)
          if (_this.activeHoverNode) {
            if (_this.activeHoverNode.table?.titleRect?.hit(pos)) {
              _this.eventType = EventType.NODEDBLCLICK
              _this.handleDblClick()
            }
          }
          _this.eventType = EventType.NONE
        },
      },
      [mousewheel]: {
        fn(e: WheelEvent) {
          if (e.deltaY < 0) {
            _this.scaleRatio = Number((_this.scaleRatio + 0.1).toPrecision(1))
          } else {
            const scale = Number((_this.scaleRatio - 0.1).toPrecision(1))
            _this.scaleRatio = scale < 0.5 ? 0.5 : scale
          }
          _this.render()
        },
      },
    }
  }
  _registerThumbnailListener(): any {
    const _this = this
    return {
      mousedown: {
        fn() {
          if (_this.thumbnail) {
            _this.thumbnail.style.cursor = 'pointer'
            _this.thumbnailActive = true
          }
        },
      },
      mousemove: {
        fn(e: MouseEvent) {
          if (_this.thumbnailActive) {
            // _this.scrollLeft -=
            //   (e.movementX * _this.scaleRatio) / _this.thumbnailScale
            // _this.scrollTop -=
            //   (e.movementY * _this.scaleRatio) / _this.thumbnailScale
            _this.calcScrollDistance({
              x: Number(
                (
                  (e.movementX * _this.scaleRatio) /
                  _this.thumbnailScale
                ).toPrecision(1)
              ),
              y: Number(
                (
                  (e.movementY * _this.scaleRatio) /
                  _this.thumbnailScale
                ).toPrecision(1)
              ),
            })
            _this.render()
          }
        },
      },
      mouseup: {
        fn() {
          if (_this.thumbnail) {
            _this.thumbnail.style.cursor = 'default'
            _this.thumbnailActive = false
          }
        },
      },
    }
  }
}
