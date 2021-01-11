import * as THREE from "three"
import C from "./config"
import { testVertexShader,testFragmentShader } from "./shader/test10"
export class WEBGLRenderer {
    renderer!: THREE.WebGLRenderer
    scene!: THREE.Scene
    camera!: THREE.PerspectiveCamera
    clock!: THREE.Clock
    shader!: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.ShaderMaterial>

    constructor(public parentElem: HTMLElement, options: any = {}){
        
    }
    init() {
        this.renderer = this.createRenderer()
        this.scene = this.createScene()
        this.camera = this.createCamera()
        this.clock = new THREE.Clock()

        if(C.AxesHelper) this.createAxesHelper()

        this.shader = this.createShader()

        this.animate()
    }
    
    createRenderer(){
        const renderer = new THREE.WebGLRenderer({
            antialias:true,
            alpha:true
        })
        renderer.setClearColor(C.RendererColor,C.RendererAlpha)
        renderer.setSize(this.parentElem.clientWidth,this.parentElem.clientHeight)
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
        camera.position.set(0,0,500)
        camera.lookAt(this.scene.position)
        return camera
    }
    createAxesHelper(){
        this.scene.add(new THREE.AxesHelper(C.AxesSize))
    }

    createShader(){
        const width = this.parentElem.clientWidth
        const height = this.parentElem.clientHeight
        const uniforms = {
            iTime: { value: 1.0 },
            iResolution: { value: new THREE.Vector2(width * 1.0, height * 1.0)},
            iMouse: { value: new THREE.Vector3(0.0, 0.0, 0.0) }
        }
        const material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: testVertexShader,
            fragmentShader: testFragmentShader
        })
        const geom = new THREE.PlaneBufferGeometry(width, height)
        const mesh = new THREE.Mesh( geom, material )
        this.scene.add(mesh)
        return mesh
    }

    animate(){
        requestAnimationFrame(this.animate.bind(this))
        this.shader.material.uniforms.iTime.value += this.clock.getDelta()
        this.renderer.render(this.scene, this.camera)
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
    _registerListener(): any {
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