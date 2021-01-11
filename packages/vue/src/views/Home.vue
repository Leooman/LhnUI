<template>
  <div class="home">
    <router-link class="item" to="diagram">Diagram</router-link>
    <router-link class="item" to="icon">Icon</router-link>
    <router-link class="item" to="shader">Shader</router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
export default class Home extends Vue {}
</script>
<style lang="scss" scoped>
  .home{
    display: grid;
    height: 100%;
    grid-template-columns: repeat(4,1fr);
    grid-template-rows: repeat(4,1fr);
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    .item{
      border: 1px solid #cccccc;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
