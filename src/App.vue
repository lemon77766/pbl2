<template>
  <div id="app">
    <SiteHeader v-if="showHeader" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const hideHeaderRoutes = new Set(['home', 'history', 'appreciation'])
const showHeader = computed(() => !hideHeaderRoutes.has((route.name as string) || ''))
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