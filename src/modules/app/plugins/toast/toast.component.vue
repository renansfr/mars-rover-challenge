<template>
  <div
    :class="[
      'toast',
      'fixed',
      'p-4',
      'z-50',
      'flex justify-between items-center',
      'transition-all duration-300 ease-in-out',
      'text-white',
      'w-full md:w-auto',
      'md:bottom-8',
      'md:rounded',
      completedClass,
      typeClass
    ]"
    ref="toastRef"
  >
    <div class="message">
      <span v-html="notification.content"></span>
    </div>
    <mp-icon
      icon="times-circle"
      size="lg"
      class="ml-8 text-gray-200 cursor-pointer"
      @click="closeNotification()"
    />
  </div>
</template>

<script lang="ts">
import { Notification } from './index'
import {
  render,
  defineComponent,
  ref,
  computed,
  onMounted,
  PropType
} from 'vue'

export default defineComponent({
  name: 'mp-toast',
  props: {
    notification: {
      type: Object as PropType<Notification>,
      required: true
    }
  },
  setup(props) {
    const completed = ref(false)
    const toastRef = ref<Element>()

    const typeMap = {
      success: 'bg-red-900',
      info: 'bg-gray-500',
      error: 'bg-red-500',
      warn: 'bg-orange-500'
    }

    const typeClass = computed((): string => {
      return typeMap[props.notification.type!] || 'bg-gray-700'
    })

    const completedClass = computed((): string => {
      if (completed.value) {
        return 'top-0 md:top-auto md:right-[25%] min-w-[50%]'
      }
      return 'right-0 -top-full md:top-auto md:-right-full'
    })

    const closeNotification = () => {
      render(null, toastRef.value!.parentElement as Element)
    }

    onMounted(() => {
      setTimeout(() => {
        completed.value = true
      }, 0)
    })

    return {
      typeClass,
      completedClass,
      completed,
      toastRef,
      closeNotification
    }
  }
})
</script>
