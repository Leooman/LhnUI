<template>
  <div class="icons">
    <div class="item" v-for="icon in iconfont.glyphs">
      <IconComponent :icon="`#${iconfont.css_prefix_text}${icon.font_class}`"></IconComponent>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from '@vue/composition-api'
import IconComponent from '@lhn/icon'
// @ts-ignore
import iconfont from "@/assets/iconfont.json"

export default defineComponent({
  components:{
    IconComponent
  },
  setup(_,ctx) {
    return {
      iconfont
    }
  }
})
</script>

<style lang="scss" scoped>
  .icons{
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill,50px);
    grid-template-rows: repeat(auto-fill,50px);
    .item{
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover{
        background: #dedede;
        cursor: pointer;
      }
    }
  }
</style>