<template>
  <div class="shader">
    <div id="canvas" ref="canvas"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from '@vue/composition-api'
import { Renderer } from '@lhn/shader'
export default defineComponent({
  setup(_,ctx) {
    let renderer:Renderer
    onMounted(() => {
      const ele = document.getElementById("canvas")
      if (ele) {
        renderer = new Renderer(ele,{},{})
        console.log(renderer)
        renderer.init()
      }
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