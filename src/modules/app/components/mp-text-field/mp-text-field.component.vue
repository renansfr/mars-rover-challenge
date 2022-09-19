<template>
  <input
    :class="[
      'form-control block w-full px-3 py-2 text-base font-normal text-gray-800 bg-clip-padding border rounded transition ease-in-out m-0 focus:ring-1 focus:outline-none',
      hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-gray-600  focus:ring-gray-600',
      disabled ? 'bg-gray-200' : 'bg-white'
    ]"
    :placeholder="placeholder"
    :value="localValue"
    :disabled="disabled"
    :type="($attrs.type as string)"
    @input="onInput"
    @change="onChange"
    @blur="onBlur"
    @focus="onFocus"
    v-mask="mask"
  />
</template>

<script lang="ts">
import { defineComponent, inject, ref, watch } from 'vue'

export default defineComponent({
  name: 'mp-text-field',
  props: {
    modelValue: {
      type: [String, Number],
      required: false,
      default: ''
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    mask: {
      type: String,
      required: false,
      default: null
    }
  },
  setup(props, { emit }) {
    const hasError = inject('hasError', false)

    const localValue = ref(props.modelValue)

    const onInput = (event: Event) => {
      const resolvedValue = (event.target as HTMLInputElement).value
      emit('input', resolvedValue)
      emit('update:model-value', resolvedValue)
    }

    const onChange = (event: any) => {
      emit('change', (event.target as HTMLInputElement).value)
    }

    const onBlur = (event: any) => {
      emit('blur', (event.target as HTMLInputElement).value)
    }

    const onFocus = (event: any) => {
      emit('focus', (event.target as HTMLInputElement).value)
    }

    watch(
      () => props.modelValue,
      (value) => {
        localValue.value = value
      }
    )

    return {
      localValue,
      hasError,
      onInput,
      onChange,
      onBlur,
      onFocus
    }
  }
})
</script>
