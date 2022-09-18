<template>
  <h-transition-root :show="true" appear as="template">
    <h-dialog @close="onClose()">
      <h-transition-child
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </h-transition-child>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center text-center"
        >
          <h-transition-child
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <h-dialog-panel class="w-full max-w-sm transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
              <h-dialog-title as="h4" class="font-title text-lg text-center font-semibold leading-6 text-gray-900 p-4">{{ title }}</h-dialog-title>

              <div v-html="message" class="px-4"></div>

              <div class="grid grid-cols-1 gap-4 w-full mt-4 p-4">
                <mp-button
                  class="w-full"
                  :variant="okButtonVariant"
                  :type="okButtonType"
                  v-autofocus
                  @click="onOk()"
                >{{ okButtonText }}</mp-button>
                <mp-button
                  :type="cancelButtonType"
                  class="w-full"
                  :variant="cancelButtonVariant"
                  @click="onCancel()"
                  v-if="cancelButton"
                  >{{ cancelButtonText }}</mp-button
                >
              </div>
            </h-dialog-panel>
          </h-transition-child>
        </div>
      </div>
    </h-dialog>
  </h-transition-root>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ButtonType, ButtonVariant } from '../../components/mp-button/types'

export default defineComponent({
  name: 'mp-dialog',
  props: {
    title: {
      type: String,
      required: false
    },
    message: {
      type: String,
      required: true
    },
    okButton: {
      type: Boolean,
      required: false,
      default: true
    },
    okButtonText: {
      type: String,
      required: false,
      default: 'Ok'
    },
    okButtonVariant: {
      type: String as PropType<ButtonVariant>,
      required: false,
      default: 'default'
    },
    okButtonType: {
      type: String as PropType<ButtonType>,
      required: false,
      default: 'primary'
    },
    cancelButton: {
      type: Boolean,
      required: false,
      default: false
    },
    cancelButtonText: {
      type: String,
      required: false,
      default: 'Cancelar'
    },
    cancelButtonVariant: {
      type: String as PropType<ButtonVariant>,
      required: false,
      default: 'outline'
    },
    cancelButtonType: {
      type: String as PropType<ButtonType>,
      required: false,
      default: 'default'
    },
    closable: {
      type: Boolean,
      required: false
    }
  },
  setup(props, { emit }) {
    const onClose = () => {
      emit('close')
    }

    const onOk = () => {
      emit('ok')
    }

    const onCancel = () => {
      emit('cancel')
    }

    return {
      onClose,
      onOk,
      onCancel
    }
  }
})
</script>
