import * as THREE from "three"
import { WEBGLRenderer } from "./base"
export class ShaderRenderer extends WEBGLRenderer {
    shader!: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.ShaderMaterial>
    shaderMaterial: any

    constructor(public parentElem: HTMLElement, options: any = {}){
        super(parentElem,options)
        this.shaderMaterial = options.shader
    }
    init() {
        super.init()

        this.shader = this.createShader()

        this.animate()
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
            vertexShader: this.shaderMaterial.testVertexShader,
            fragmentShader: this.shaderMaterial.testFragmentShader
        })
        const geom = new THREE.PlaneBufferGeometry(width, height)
        const mesh = new THREE.Mesh( geom, material )
        this.scene.add(mesh)
        return mesh
    }

    animate(){
        super.animate()
        this.shader.material.uniforms.iTime.value += this.clock.getDelta()
    }

}