<template>
  <button
    :type="isSubmit ? 'submit' : 'button'"
    class="inline-flex justify-center transition duration-150 group focus:outline-none"
    :class="buttonClasses"
    ref="buttonRef"
    @click="onClick($event)">
    <span class="flex items-center leading-6 group-hover">
      <MpSpinner v-if="isLoading" class="w-6 h-6 mr-2" />
      <span v-if="$slots.startIcon" class="mr-2">
        <slot name="startIcon" />
      </span>
      <span class="w-full text-center">
        <slot />
      </span>
      <span v-if="$slots.endIcon" class="ml-2">
        <slot name="endIcon" />
      </span>
    </span>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue'
import { ButtonType, ButtonVariant } from './types'
import MpSpinner from '../mp-spinner/mp-spinner.vue'

const variantClasses = {
  default: 'text-white font-bold py-2 px-4 rounded transition duration-100 ease-in-out',
  outline: 'font-bold py-2 px-4 rounded border',
  text: 'inline hover:underline transition duration-100 ease-in-out'
}

export default defineComponent({
  name: 'mp-button',
  emits: ['click'],
  components: {
    MpSpinner
  },
  props: {
    variant: {
      type: String as PropType<ButtonVariant>,
      default: 'default'
    },
    type: {
      type: String as PropType<ButtonType>,
      required: false,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const buttonRef = ref<HTMLInputElement>()
    const isSubmit = ref(false)
    const buttonClasses = computed(() => {
      const typeClasses = {
        default: '',
        primary: '',
        warning: '',
        danger: '',
        black: ''
      }
      switch (props.variant) {
        case 'default':
          typeClasses.default = 'bg-gray-300 hover:bg-gray-400 active:bg-gray-500 focus:bg-gray-400 border-gray-400'
          typeClasses.primary = 'bg-red-500 hover:bg-red-600 active:bg-red-700 focus:bg-red-600 border-red-600'
          typeClasses.warning = 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 focus:bg-yellow-600 border-yellow-600'
          typeClasses.danger = 'bg-red-500 hover:bg-red-600 active:bg-red-700 focus:bg-red-600 border-red-600'
          typeClasses.black = 'bg-gray-900 hover:bg-gray-800 active:bg-gray-700 focus:bg-gray-700 border-gray-700'
          break
        case 'outline':
          typeClasses.default = 'bg-white hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-100 border-gray-200'
          typeClasses.primary = 'bg-white hover:bg-red-100 active:bg-red-200 focus:bg-red-100 border-red-200 text-red-500'
          typeClasses.warning = 'bg-white hover:bg-yellow-100 active:bg-yellow-200 focus:bg-yellow-100 border-yellow-200 text-yellow-500'
          typeClasses.danger = 'bg-white hover:bg-red-100 active:bg-red-200 focus:bg-red-100 border-red-200 text-red-500'
          typeClasses.black = 'bg-white hover:bg-gray-800 active:bg-gray-700 focus:bg-gray-700 border-gray-700 text-gray-800'
          break
        case 'text':
          typeClasses.default = 'text-gray-500 hover:text-gray-600 active:text-gray-700 focus:text-gray-600'
          typeClasses.primary = 'text-red-500 hover:text-red-600 active:text-red-700 focus:text-red-600'
          typeClasses.warning = 'text-yellow-500 hover:text-yellow-600 active:text-yellow-700 focus:text-yellow-600'
          typeClasses.danger = 'text-red-500 hover:text-red-600 active:text-red-700 focus:text-red-600'
          typeClasses.black = ''
          break
        default:
          typeClasses.default = 'bg-gray-300 hover:bg-gray-400 active:bg-gray-500 focus:bg-gray-400 border-gray-400'
          typeClasses.primary = 'bg-red-500 hover:bg-red-600 active:bg-red-700 focus:bg-red-700 border-red-600'
          typeClasses.warning = 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 focus:bg-yellow-600 border-yellow-600'
          typeClasses.danger = 'bg-red-500 hover:bg-red-600 active:bg-red-700 focus:bg-red-600 border-red-600'
          typeClasses.black = 'bg-gray-900 hover:bg-gray-800 active:bg-gray-700 focus:bg-gray-700 border-gray-700'
      }

      return [
        variantClasses[props.variant],
        typeClasses[props.type],
        isDisabled.value ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      ].join(' ')
    })

    const isDisabled = computed(() => {
      return props.disabled || props.isLoading
    })

    const onClick = (event: Event) => {
      if (isDisabled.value) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        emit('click', event)
      }
    }

    const checkButtonType = () => {
      isSubmit.value = !!buttonRef.value?.form
    }

    onMounted(() => {
      checkButtonType()
    })

    return {
      isSubmit,
      buttonRef,
      buttonClasses,
      onClick
    }
  }
})
</script>
