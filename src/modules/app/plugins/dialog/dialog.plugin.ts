import { App, createVNode, render } from 'vue'
import { ButtonType, ButtonVariant } from '../../components/mp-button/types'
import DialogComponent from './dialog.component.vue'

type PluginOptions = {
  name: string
}

export type DialogProps = {
  icon?: string | string[]
  title?: string
  message?: string
  okButton?: boolean
  okButtonText?: string
  okButtonVariant?: ButtonVariant
  okButtonType?: ButtonType
  okButtonHandler?: CallableFunction
  cancelButton?: boolean
  cancelButtonText?: string
  cancelButtonVariant?: ButtonVariant
  cancelButtonType?: ButtonType
  cancelButtonHandler?: CallableFunction
  closable?: boolean
}

export type Dialog = {
  confirm: (dialogProps: DialogProps) => Promise<boolean | undefined>
}

type PromiseResolve = (value: boolean | PromiseLike<boolean | undefined> | undefined) => void

const mount = (dialogProps: DialogProps, vueApp: App, resolve: PromiseResolve) => {
  const listeners = {
    onClose: () => {
      destroy()
      resolve(undefined)
    },
    onOk: () => {
      destroy()
      resolve(true)
    },
    onCancel: () => {
      destroy()
      resolve(false)
    }
  }

  const mergedPassedProps = {
    ...dialogProps,
    ...listeners
  }

  const vnode = createVNode(DialogComponent, mergedPassedProps)
  vnode.appContext = vueApp._context

  const el = document.createElement('div')
  vueApp._container.appendChild(el)

  render(vnode, el)

  const destroy = () => {
    render(null, el)
  }

  return {
    vnode,
    el
  }
}

const plugin = (app: App): Dialog => {
  return {
    confirm(dialogProps: DialogProps): Promise<boolean | undefined> {
      return new Promise((resolve) => {
        const { vnode } = mount(dialogProps, app, resolve)

        const componentInstance = vnode.component as any
        componentInstance.$plugin = plugin
      })
    }
  }
}

export function Dialog(app: App, options: PluginOptions) {
  const dialog = plugin(app)
  const name = (options && options.name) || '$dialog'
  Object.defineProperty(app.config.globalProperties, name, {
    get() {
      return dialog
    }
  })
}
