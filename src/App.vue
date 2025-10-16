<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 应用入口组件
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  background:
    radial-gradient(1200px 600px at 10% -10%, #F2ECD9 0%, transparent 60%),
    radial-gradient(1200px 600px at 110% 10%, #F6EBD2 0%, transparent 55%),
    linear-gradient(135deg, #F7F3E8 0%, #F2E9D9 100%);
}
</style>