<template>
  <component :is="resolvedLayout" />
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import MpLayoutMain from './main.layout.vue'
import MpLayoutTransparent from './transparent.layout.vue'
import { Layout } from './layouts.enum'

export default defineComponent({
  name: 'layout-resolver',
  components: {
    MpLayoutMain,
    MpLayoutTransparent
  },
  setup () {
    const layouts = {
      [Layout.MAIN]: 'mp-layout-main',
      [Layout.TRANSPARENT]: 'mp-layout-transparent'
    }

    const route = useRoute()

    const resolvedLayout = computed(() => {
      const routeLayout = route.meta.layout
      if (!routeLayout) {
        return layouts[Layout.TRANSPARENT]
      }

      const layout = layouts[routeLayout]
      if (!layout) {
        return layouts[Layout.TRANSPARENT]
      }

      return layout
    })

    return {
      resolvedLayout
    }
  }
})
</script>
