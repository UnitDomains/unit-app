import { createApp, h } from 'vue'
import ModalDialog from './Dialog.vue'
import i18n from '@/locales/i18n'
import { useI18n } from 'vue-i18n'
export interface IDialogOptions {
  footerVisible: boolean
  cancelVisible: boolean
  title: string
  content: string
  ok: () => void
  cancel: () => void
  dialogType?: number
}

export const createDialog = (options: IDialogOptions) => {
  const {
    footerVisible,
    cancelVisible,
    title,
    content,
    ok,
    cancel,
    dialogType,
  } = options
  const div = document.createElement('div')

  document.body.appendChild(div)
  const close = () => {
    app.unmount()
    div.remove()
  }

  const app = createApp({
    render() {
      return h(
        ModalDialog,
        {
          visible: true,
          footerVisible: footerVisible,
          cancelVisible: cancelVisible,
          onUpdateVisible: (newVisible: boolean) => {
            if (newVisible === false) {
              close()
            }
          },
          title,
          ok,
          cancel,
          dialogType,
        },
        {
          default() {
            return content
          },
        },
      )
    },
  })
  app.use(i18n).mount(div)
}

export const createAlertDialog = (content: string) => {
  const ok = async () => {}
  const cancel = (): void => {}
  const options: IDialogOptions = {
    footerVisible: true,
    cancelVisible: false,
    title: 'alert',
    content: content,
    ok: ok,
    cancel: cancel,
    dialogType: 1,
  }
  return createDialog(options)
}
