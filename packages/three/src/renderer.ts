import * as THREE from "three"
import { WEBGLRenderer } from "./base"
export class ShaderRenderer extends WEBGLRenderer {
    sphereShadowBases!: Array<any>

    constructor(public parentElem: HTMLElement, options: any = {}){
        super(parentElem,options)
        this.sphereShadowBases = []
    }
    init() {
        super.init()
        
        this.createPlane()
        this.createSphere()
        this.createHemisphereLight()
        this.createDirectLight()

        this.animate()
    }
    

    animate(time?:any){
        super.animate(time)
        time *= 0.001
        this.resize()

        {
            const canvas = this.renderer.domElement
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight
            this.camera.updateProjectionMatrix()
        }

        this.sphereShadowBases.forEach((sphereShadowBase, ndx) => {
            const {base, sphereMesh, shadowMesh, y} = sphereShadowBase

            const u = ndx / this.sphereShadowBases.length

            const speed = time * .2
            const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1)
            const radius = Math.sin(speed - ndx) * 10
            base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)

            const yOff = Math.abs(Math.sin(time * 2 + ndx))

            sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff)

            shadowMesh.material.opacity = THREE.MathUtils.lerp(1, .25, yOff)
        })
    }

    createDirectLight(){
        const color = 0xffffff
        const intensity = 1
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(0, 10, 5)
        light.target.position.set(-5, 0, 0)
        this.scene.add(light)
        this.scene.add(light.target)
    }

    createHemisphereLight(){
        const skyColor = 0xB1E1FF
        const groundColor = 0xB97A20
        const intensity = 2
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
        this.scene.add(light)
    }

    createPlane(){
        const planeSize = 40

        const texture = new THREE.TextureLoader().load(require("./image/checker.png"))
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.magFilter = THREE.NearestFilter
        const repeats = planeSize / 2
        texture.repeat.set(repeats, repeats)

        const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize)
        const planeMat = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
        })
        planeMat.color.setRGB(1.5, 1.5, 1.5)
        const mesh = new THREE.Mesh(planeGeo, planeMat)
        mesh.rotation.x = Math.PI * -0.5
        this.scene.add(mesh)
    }

    createSphere(){
        const sphereRadius = 1
        const sphereWidthDivisions = 32
        const sphereHeightDivisions = 16
        const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)

        const shadowTexture = new THREE.TextureLoader().load(require("./image/roundshadow.png"))

        const planeSize = 1
        const shadowGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize)

        const numSpheres = 15
        for (let i = 0; i < numSpheres; ++i) {
            const base = new THREE.Object3D()
            this.scene.add(base)

            const shadowMat = new THREE.MeshBasicMaterial({
                map: shadowTexture,
                transparent: true,
                depthWrite: false,
            })
            const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
            shadowMesh.position.y = 0.001
            shadowMesh.rotation.x = Math.PI * -.5
            const shadowSize = sphereRadius * 4
            shadowMesh.scale.set(shadowSize, shadowSize, shadowSize)
            base.add(shadowMesh)

            const u = i / numSpheres
            const sphereMat = new THREE.MeshPhongMaterial()
            sphereMat.color.setHSL(u, 1, .75)
            const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
            sphereMesh.position.set(0, sphereRadius + 2, 0)
            base.add(sphereMesh)

            this.sphereShadowBases.push({base, sphereMesh, shadowMesh, y: sphereMesh.position.y});
        }
    }

}