<template>
  <input
    :class="[
      'form-control block w-full px-3 py-2 text-base font-normal text-gray-800 bg-clip-padding border rounded transition ease-in-out m-0 focus:ring-1 focus:outline-none',
      hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-sky-600  focus:ring-sky-600',
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

    const onChange = (event) => {
      emit('change', (event.target as HTMLInputElement).value)
    }

    const onBlur = (event) => {
      emit('blur', (event.target as HTMLInputElement).value)
    }

    const onFocus = (event) => {
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
