<!--
针对/stockpage这条路径而显示出来
在这个组件中，通过注册子组件的方式显示Stock.vue这个组件
-->
<template>
  <div class="com-page">
    <stock></stock>
  </div>
</template>

<script>
import Stock from '../components/Stock.vue'
export default {
  components: {
    stock: Stock
  }
}
</script>

<style>
</style>
