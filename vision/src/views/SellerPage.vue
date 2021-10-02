<!--
针对 /sellerpage这条路径显示出来的
在该组件中，通过子组件注册的方式，要显示出Seller.vue这个组件
-->
<template>
  <div class="com-page">
    <seller></seller>
  </div>
</template>

<script>
import Seller from '@/components/Seller'
export default {
  components: {
    seller: Seller
  }
}
</script>

<style>
</style>
