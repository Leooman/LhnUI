import { WEBGLRenderer } from './renderer'
export class Renderer extends WEBGLRenderer {
  fns: any
  constructor(parentElem: HTMLElement, options: any = {}, fns: any) {
    super(parentElem, options)
    this.fns = fns
  }
}
