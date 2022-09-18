<template>
  <div id="page" class="h-full">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'mp-app-page',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    }
  },
  watch: {
    title: {
      immediate: true,
      handler (title) {
        document.title = String(title)
      }
    }
  }
})
</script>

<style scoped>
</style>
