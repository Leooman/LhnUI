<template>
  <div class="shader">
    <div id="canvas"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount } from '@vue/composition-api'
import { Renderer,Shaders } from '@lhn/shader'
export default defineComponent({
  setup(_,{root}:any) {
    let renderer:Renderer

    onMounted(() => {
      const ele = document.getElementById("canvas")
      if (ele) {
        renderer = new Renderer(ele,{
          // @ts-ignore
          shader:Shaders[root.$route.params.id]
        },{})
        renderer.init()
        // @ts-ignore
        window.scene = renderer.scene
      }
    })
    onBeforeUnmount(() => {
      renderer.destroy()
      // renderer.renderer.domElement = null
      // renderer.renderer.context = null
      // renderer.renderer = null
    })
    return {
      
    }
  }
})
</script>

<style lang="scss" scoped>
  .shader {
    height: 100%;
    display: flex;
    flex: 1;
    background: #ffffff;
    overflow: hidden;
    position: relative;
    #canvas {
      width: 100%;
      height: 100%;
      margin: auto;
      overflow: hidden;
    }
  }
</style>