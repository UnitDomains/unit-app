import { useRouter, useRoute } from 'vue-router'

export const processError = (err: Error, router) => {
  if (err.message.indexOf('Unsupported network') >= 0) {
    router.push({ path: '/error/notsupportnetwork' })
  }
}
