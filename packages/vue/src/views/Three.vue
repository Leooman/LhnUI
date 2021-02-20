<template>
  <div class="threejs">
    <div id="canvas"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount } from '@vue/composition-api'
import { Renderer } from '@lhn/three'
export default defineComponent({
  setup(_,{root}:any) {
    let renderer:Renderer

    onMounted(() => {
      const ele = document.getElementById("canvas")
      if (ele) {
        renderer = new Renderer(ele,{},{})
        renderer.init()
      }
    })
    onBeforeUnmount(() => {
      renderer.destroy()
    })
    return {
      
    }
  }
})
</script>

<style lang="scss" scoped>
  .threejs {
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