import * as THREE from "three"
import C from "./config"
export abstract class WEBGLRenderer {
    renderer!: THREE.WebGLRenderer
    scene!: THREE.Scene
    camera!: THREE.PerspectiveCamera
    clock!: THREE.Clock
    animation!: number

    constructor(public parentElem: HTMLElement, options: any = {}){
        
    }
    init() {
        this.renderer = this.createRenderer()
        this.scene = this.createScene()
        this.camera = this.createCamera()
        this.clock = new THREE.Clock()
        if(C.AxesHelper) this.createAxesHelper()
    }
    
    createRenderer(){
        const renderer = new THREE.WebGLRenderer({
            antialias:true,
            alpha:true
        })
        renderer.setClearColor(C.RendererColor,C.RendererAlpha)
        renderer.setSize(this.parentElem.clientWidth,this.parentElem.clientHeight)
        renderer.physicallyCorrectLights = true
        this.parentElem.appendChild(renderer.domElement)
        return renderer
    }
    createScene(){
        return new THREE.Scene()
    }
    createCamera(){
        const camera = new THREE.PerspectiveCamera(
            C.CameraFov, 
            this.parentElem.clientWidth / this.parentElem.clientHeight, 
            C.CameraNear, 
            C.CameraFar
        )
        camera.position.set(0,10,20)
        camera.lookAt(this.scene.position)
        return camera
    }
    createAxesHelper(){
        this.scene.add(new THREE.AxesHelper(C.AxesSize))
    }

    animate(time:any){
        this.animation = requestAnimationFrame(this.animate.bind(this))
        this.renderer.render(this.scene, this.camera)
    }
    destroy(){
        window.removeEventListener("resize", this.resize)
        this.clearScene()
        this.renderer.renderLists.dispose()
        this.renderer.dispose()
        this.renderer.forceContextLoss()
        // this.renderer.domElement = null
        // this.renderer.context = null
        // this.renderer = null
        cancelAnimationFrame(this.animation)
        THREE.Cache.clear()
    }
    clearScene(){
        this._removeItem(this.scene)
    }
    _removeItem(item: any){
        let target = item.children.filter((x: any) => x)
        target.forEach((item: any) => {
          if (item.children.length) {
            this._removeItem(item)
          } else {
            item.geometry?.dispose()
            item.material?.dispose()
            item.clear()
          }
        })
        item.clear()
        target = null
    }
    resize(){
        const canvas = this.renderer.domElement
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        const needResize = canvas.width !== width || canvas.height !== height
        if (needResize) {
            this.renderer.setSize(width, height, false)
        }
        return needResize
    }
    registerEventListeners() {
        const eventListeners = this._registerListener()
        for (const eventName in eventListeners) {
            const eventArr = Array.isArray(eventListeners[eventName])
                ? eventListeners[eventName]
                : [eventListeners[eventName]]

            for (const eventItem of eventArr) {
                this.renderer.domElement.addEventListener(eventName, eventItem.fn)
            }
        }
    }
    _registerListener():any {
        const mousewheel =
            typeof window.onmousewheel === 'object' ? 'mousewheel' : 'DOMMouseScroll'
        return {
            [mousewheel]: {
                fn(e: WheelEvent){
                    
                }
            },
            pointerup: {
                fn(e: MouseEvent) {
                    
                }
            },
            pointermove: {
                fn(e: MouseEvent) {
                    
                },
            },
        }
    }
}