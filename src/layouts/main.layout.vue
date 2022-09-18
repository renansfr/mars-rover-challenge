<template>
  <div class="h-screen flex flex-col">
    <MpHeader class="fixed w-full top-0" />
    <div class="h-screen flex-grow mt-16">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MpHeader from '../modules/app/components/mp-header/mp-header.vue'

export default defineComponent({
  name: 'mp-layout-main',
  components: {
    MpHeader
  }
})
</script>
