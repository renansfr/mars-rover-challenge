<template>
  <div
    class="mp-field"
    v-bind="$attrs">
    <label>
      <span class="block w-full text-sm text-left" v-if="label">{{ label }}</span>
      <div class="flex" v-if="!$slots.content">
        <slot />
      </div>
      <slot name="content" />
    </label>
    <span class="text-sm text-gray-500 text-left" v-if="shouldShowHint">{{ hint }}</span>
    <div class="text-sm text-red-500 text-left" v-if="hasError"> {{ visibleError }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, provide, inject } from 'vue'
import { ErrorObject } from '@vuelidate/core'

export default defineComponent({
  name: 'mp-field',
  props: {
    label: {
      type: String,
      required: false,
      default: ''
    },
    errors: {
      type: Array as PropType<ErrorObject[]>,
      required: false
    },
    hint: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const hasInjectedError = inject('hasError', computed(() => false))
    const hasError = computed(() => !!props.errors?.length || hasInjectedError.value)

    const shouldShowHint = computed(() => {
      return !!props.hint
    })

    const visibleError = computed(() => {
      return props.errors?.[0]?.$message
    })

    provide('hasError', hasError)

    return {
      hasError,
      visibleError,
      shouldShowHint
    }
  }
})
</script>
