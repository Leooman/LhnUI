<template>
  <div class="shader">
    <router-link class="item" v-for="shader in shaders" :to="`/subShader/${shader}`">
      {{shader}}
      <!-- <img :src="`/shader/${shader}.png`" alt=""> -->
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from '@vue/composition-api'
import { Shaders } from '@lhn/shader'
export default defineComponent({
  setup(_,ctx) {
    const data = reactive({
      shaders:Object.keys(Shaders)
    })
    onMounted(() => {

    })
    return {
      ...toRefs(data)
    }
  }
})
</script>

<style lang="scss" scoped>
  .shader{
    display: grid;
    min-height: 100%;
    grid-template-columns: repeat(4,1fr);
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    .item{
      border: 1px solid #cccccc;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>