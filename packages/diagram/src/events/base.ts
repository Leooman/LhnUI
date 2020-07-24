import { DiagramRenderer } from '../renderer'
import { EventType } from '../class'
export interface State {
  excute(context: DiagramRenderer, e?: MouseEvent): void
}
export type EventStates = {
  [EventType.NONE]: State
  [EventType.NODECLICK]: State
  [EventType.CANVASCLICK]: State
  [EventType.LINECLICK]: State
  [EventType.ANCHORMATCH]: State
  [EventType.NODEHOVER]: State
  [EventType.NODERESIZE]: State
  [EventType.NODEDBLCLICK]: State
  [EventType.NODECOLLAPSE]: State
  [EventType.LINECONTROLCLICK]: State
}
