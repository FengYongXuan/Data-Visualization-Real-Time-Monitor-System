<!--
针对于/rankpage这条路径而显示出来
在这个组件中，通过子组件注册的方式，要显示出Rank.vue这个组件
-->
<template>
  <div class="com-page">
    <rank></rank>
  </div>
</template>

<script>
import Rank from '../components/Rank'
export default {
  components: {
    rank: Rank
  }
}
</script>

<style>
</style>
