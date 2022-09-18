import { createVNode, render, App } from 'vue'
import ToastComponent from './toast.component.vue'

type PluginOptions = {
  name: string
}

export enum ToastType {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  SUCCESS = 'success'
}

export type Notification = {
  content: string
  duration?: number
  persistent?: boolean
  type?: ToastType
}

const isObject = (val: any) => val !== null && typeof val === 'object'

const createNotificationObject = (
  notification: Notification | string
): Notification => {
  if (!isObject(notification)) {
    return {
      content: notification as string,
      duration: 4000,
      persistent: false
    }
  }
  return {
    content: (notification as Notification).content,
    duration: (notification as Notification).duration || 4000,
    persistent: (notification as Notification).persistent || false
  }
}

let toastsContainer: HTMLDivElement

const mount = (notification: Notification, vueApp: App) => {
  const toastComponentInstance = createVNode(ToastComponent, {
    notification
  })
  toastComponentInstance.appContext = vueApp._context

  if (!toastsContainer) {
    toastsContainer = document.createElement('div')
    vueApp._container.appendChild(toastsContainer)
  }

  toastsContainer.innerHTML = ''
  const toastElement = document.createElement('div')
  toastsContainer.appendChild(toastElement)

  render(toastComponentInstance, toastElement)

  if (!notification.persistent) {
    setTimeout(() => {
      render(null, toastElement)
    }, notification.duration)
  }
}

const plugin = (app: App) => {
  const show = (notification: Notification) => {
    mount(notification, app)
  }

  return Object.values(ToastType).reduce(
    (acc: any, toastType: ToastType) => {
      if (!acc[toastType]) {
        acc[toastType] = (notification: Notification | string) => {
          const notificationObject = createNotificationObject(notification)
          notificationObject.type = toastType
          show(notificationObject)
        }
      }
      return acc
    },
    { show }
  )
}

export function Toast(app: App, options: PluginOptions) {
  const toast = plugin(app)
  const name = (options && options.name) || '$toast'
  Object.defineProperty(app.config.globalProperties, name, {
    get() {
      return toast
    }
  })
}
