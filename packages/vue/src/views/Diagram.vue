<template>
  <DiagramComponent />
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from '@vue/composition-api'
import DiagramComponent from '@lhn/diagram'

export default defineComponent({
  components:{
    DiagramComponent
  },
  setup(_,ctx) {
    return {
    }
  }
})
</script>

<style lang="scss" scoped>

</style>