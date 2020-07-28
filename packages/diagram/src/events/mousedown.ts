import config from '../utils/config'
import { DiagramRenderer } from '../renderer'
import { EventType, LineMode } from '../class'
import { uuid } from '../utils/utils'
import { State } from './base'
class Excuter implements State {
  excute(context: DiagramRenderer, e: MouseEvent) {
    const pos = context._calcMousePos(e)
    context.mousedownPos = pos
    const lineText = context.inLineText(context.lines, pos)
    const line = context.getActiveLine(pos)
    if (lineText && typeof lineText !== 'boolean') {
      context.activeLineText = lineText
      context.handleTextClick()
    } else if (line && config.lineMode === LineMode.HANDLER) {
      context.activeLine = line
      context.eventType = EventType.LINECLICK
    } else {
      if (context.activeHoverNode) {
        const anchor = context.getHitAnchor(context.activeHoverNode, pos)
        if (anchor) {
          context.eventType = EventType.ANCHORMATCH
          context.activeAnchor = anchor
          context.newLineID = uuid()
        } else if (context.activeHoverNode.table?.collapseRect?.hit(pos)) {
          context.eventType = EventType.NODECOLLAPSE
        } else {
          context.eventType = EventType.NODECLICK
        }
      } else {
        context.eventType = EventType.CANVASCLICK
        context.canvas.style.cursor = 'pointer'
      }
      if (context.activeNode) {
        const resizer = context.activeNode.hitResizer(pos)
        if (resizer !== undefined && resizer >= 0) {
          context.eventType = EventType.NODERESIZE
          context.activeResizer = resizer
          context.canvas.style.cursor = config.resizerCursors[resizer]
        }
      }
      context.activeNode = context.getActiveNode(pos)
    }
    if (context.activeLine) {
      const lineControl = context.getLineControl(context.activeLine, pos)
      if (lineControl) {
        context.activeLineControl = lineControl
        context.eventType = EventType.LINECONTROLCLICK
      }
    }
  }
}
export class MousedownStrategy {
  context: DiagramRenderer
  excuter: Excuter
  constructor(context: DiagramRenderer) {
    this.context = context
    this.excuter = new Excuter()
  }
  excute(e: MouseEvent) {
    this.excuter.excute(this.context, e)
  }
}
