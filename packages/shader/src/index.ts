import { ShaderRenderer } from './renderer'
export * as Shaders from "./shader"
export class Renderer extends ShaderRenderer {
  fns: any
  constructor(parentElem: HTMLElement, options: any = {}, fns: any) {
    super(parentElem, options)
    this.fns = fns
  }
}
