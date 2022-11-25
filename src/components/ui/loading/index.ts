import { createApp, h } from 'vue'
import { ref, SetupContext } from 'vue'
import Loading from './Loading.vue'
import i18n from '@/locales/i18n'
export interface ILoading {
  id: string
  func: () => void
}

export const showLoading = (options: ILoading) => {
  const { id, func } = options
  const div = document.createElement('div')
  //const container = document.querySelector(id)
  //container?.appendChild(div)

  document.body.appendChild(div)

  const close = () => {
    app.unmount()
    div.remove()

    //  container?.removeChild(div)
    //  div.remove()
  }
  const app = createApp({
    render() {
      return h(
        Loading,
        {
          func: func,
          onUpdateVisible: (newVisible: boolean) => {
            if (newVisible === false) {
              close()
            }
          },
        },
        {},
      )
    },
  })
  app.use(i18n).mount(div)
}
