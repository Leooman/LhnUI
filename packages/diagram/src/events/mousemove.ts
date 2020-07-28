import config from '../utils/config'
import { DiagramRenderer } from '../renderer'
import { EventType, LineMode } from '../class'
import { drawAnchors } from '../models/node/table'
import { State, EventStates } from './base'
class NodeClick implements State {
  excute(context: DiagramRenderer, e: MouseEvent) {
    if (context.activeNode) {
      const nowPos = context._calcMousePos(e)
      const delta = context.calcDelta(nowPos, context.mousedownPos)
      context.mousedownPos = nowPos
      const isOutBounds = context.activeNode.outBounds(context.nodes, delta)
      if (!isOutBounds) {
        if (config.lineMode === LineMode.HANDLER) {
          context.activeNode.translate(delta, context.lines)
          // get all generations and move just in time
          const generations = context.activeNode.getGenerations(context.nodes)
          if (generations) {
            generations.forEach(item => {
              item.translate(delta, context.lines)
            })
          }
        } else {
          context.activeNode.translate(delta)
          // get all generations and move just in time
          const generations = context.activeNode.getGenerations(context.nodes)
          if (generations) {
            generations.forEach(item => {
              item.translate(delta)
            })
          }
        }
        context.render()
      }
    }
  }
}
class None implements State {
  excute(context: DiagramRenderer, e: MouseEvent) {
    const pos = context._calcMousePos(e)
    const lineText = context.inLineText(context.lines, pos)
    if (lineText) {
      context.canvas.style.cursor = 'pointer'
    } else if (
      config.lineMode === LineMode.HANDLER &&
      context.getActiveLine(pos) &&
      context.eventType !== EventType.ANCHORMATCH
    ) {
      context.canvas.style.cursor = 'move'
    } else {
      context.activeHoverNode = context.getActiveHoverNode(
        pos,
        context.activeHoverNode
      )
      if (context.activeHoverNode) {
        if (context.getHitAnchor(context.activeHoverNode, pos)) {
          context.canvas.style.cursor = 'crosshair'
        } else if (context.activeHoverNode.table?.collapseRect?.hit(pos)) {
          context.canvas.style.cursor = 'pointer'
        } else {
          context.canvas.style.cursor = 'move'
        }
        context.render()
        context.ctx &&
          drawAnchors(
            context.ctx,
            context.activeHoverNode,
            context.scaleRatio,
            context.scrollLeft,
            context.scrollTop
          )
      } else {
        context.canvas.style.cursor = 'default'
        context.render()
      }
      if (context.activeNode) {
        const resizer = context.activeNode.hitResizer(pos)
        if (resizer !== undefined && resizer >= 0) {
          context.canvas.style.cursor = config.resizerCursors[resizer]
        }
      }
    }
    if (context.activeLine) {
      const lineControl = context.getLineControl(context.activeLine, pos)
      if (lineControl) {
        context.canvas.style.cursor = 'pointer'
      }
    }
  }
}
class CanvasClick implements State {
  excute(context: DiagramRenderer, e: MouseEvent) {
    const nowPos = context._calcMousePos(e)
    const delta = context.calcDelta(nowPos, context.mousedownPos)
    context.mousedownPos = nowPos
    context.calcScrollDistance(delta)
    context.render()
  }
}
class LineClick implements State {
  excute(context: DiagramRenderer, e: MouseEvent) {
    const nowPos = context._calcMousePos(e)
    const delta = context.calcDelta(nowPos, context.mousedownPos)
    context.mousedownPos = nowPos
    if (context.activeLine) {
      const fromNode = context.activeLine.from.getLinkNode(context.nodes)
      const toNode = context.activeLine.to.getLinkNode(context.nodes)
      if (fromNode && toNode && delta) {
        context.activeLine.lineMove(fromNode, toNode, delta)
      }
      context.render()
    }
  }
}
class NodeResize implements State {
  excute(context: DiagramRenderer, e: MouseEvent) {
    if (context.activeNode) {
      const nowPos = context._calcMousePos(e)
      const delta = context.calcDelta(nowPos, context.mousedownPos)
      context.mousedownPos = nowPos
      context.activeNode.resize(
        context.nodes,
        context.activeResizer,
        delta,
        context.lines
      )
      context.render()
    }
  }
}
class LineControlClick implements State {
  excute(context: DiagramRenderer, e: MouseEvent) {
    const nowPos = context._calcMousePos(e)
    const delta = context.calcDelta(nowPos, context.mousedownPos)
    context.mousedownPos = nowPos
    if (context.activeLineControl && context.activeLine) {
      const node = context.activeLineControl.getLinkNode(context.nodes)
      if (node) {
        context.activeLine.lineEndMove(context.activeLineControl, node, delta)
        context.render()
      }
    }
  }
}
class AnchorMatch extends None implements State {
  excute(context: DiagramRenderer, e: MouseEvent) {
    context.addLine({
      id: context.newLineID,
      from: context.activeAnchor,
      to: context._calcMousePos(e),
    })
    super.excute(context, e)
  }
}

export class MousemoveStrategy {
  context: DiagramRenderer
  excuter?: State
  eventStates: Partial<EventStates>
  constructor(context: DiagramRenderer) {
    this.context = context
    this.eventStates = {
      [EventType.NONE]: new None(),
      [EventType.NODECLICK]: new NodeClick(),
      [EventType.CANVASCLICK]: new CanvasClick(),
      [EventType.LINECLICK]: new LineClick(),
      [EventType.ANCHORMATCH]: new AnchorMatch(),
      [EventType.NODERESIZE]: new NodeResize(),
      [EventType.LINECONTROLCLICK]: new LineControlClick(),
    }
  }
  setState(state: EventType) {
    this.excuter = this.eventStates[state]
    return this
  }
  excute(e: MouseEvent) {
    this.excuter && this.excuter.excute(this.context, e)
  }
}
