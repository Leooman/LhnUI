import { DiagramRenderer } from './renderer'
import { Options } from './class'
export class Diagram extends DiagramRenderer {
  fns: any
  constructor(parentElem: HTMLElement, options: Options = {}, fns: any) {
    super(parentElem, options)
    this.fns = fns
  }
  handleDblClick() {
    const node = super.handleDblClick()
    this.fns.dblclick(node)
    return node
  }
  handleTextClick() {
    const line = super.handleTextClick()
    this.fns.textclick(line)
    return line
  }
}
