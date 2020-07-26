import config from '../utils/config'
import { DiagramRenderer } from '../renderer'
import { EventType, LineMode } from '../class'
import { State, EventStates } from './base'
class NodeClick implements State {
  excute(context: DiagramRenderer) {
    if (context.activeNode) {
      context.updateNodeActive(context.activeNode)
      context.updateCanvasWH()
      context.render()
    }
  }
}
class None implements State {
  excute(context: DiagramRenderer) {
    context.updateNodeActive()
    context.updateLineActive()
    context.render()
  }
}
class CanvasClick implements State {
  excute(context: DiagramRenderer) {
    context.updateNodeActive()
    context.updateLineActive()
    context.render()
  }
}
class LineClick implements State {
  excute(context: DiagramRenderer) {
    context.updateLineActive(context.activeLine)
    context.render()
  }
}
class AnchorMatch implements State {
  excute(context: DiagramRenderer, e: MouseEvent) {
    const pos = context._calcMousePos(e)
    if (context.activeHoverNode) {
      if (config.lineMode === LineMode.ANCHOR) {
        const anchor = context.getHitAnchor(context.activeHoverNode, pos)
        if (anchor) {
          context.addLine({
            id: context.newLineID,
            from: context.activeAnchor,
            to: anchor,
            text: 'text',
          })
        } else {
          context.removeInvalidLine()
        }
      } else if (config.lineMode === LineMode.HANDLER) {
        const newLine = context.lines.find(
          line => line.id === context.newLineID
        )
        const anchorIndex = newLine?.getLineToDirection(pos)
        if (anchorIndex !== undefined && anchorIndex >= 0) {
          context.addLine({
            id: context.newLineID,
            from: context.activeAnchor,
            to: context.activeHoverNode.anchors[anchorIndex],
            text: 'text',
          })
        }
      }
    } else {
      context.removeInvalidLine()
    }
  }
}
export class MouseupStrategy {
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
    }
  }
  setState(state: EventType) {
    this.excuter = this.eventStates[state]
    return this
  }
  excute(e: MouseEvent) {
    this.excuter && this.excuter.excute(this.context, e)
    return this
  }
  reset() {
    this.context.eventType = EventType.NONE
  }
}
