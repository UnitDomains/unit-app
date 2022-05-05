import {
    createApp
} from 'vue'
import App from './App.vue'

import i18n from './locales/i18n'

import router from './router'

//Element UI
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'





import {
    connect
}
from 'contractUtils/connect.js'

connect()

createApp(App)
    .use(router)
    .use(i18n)
    .use(ElementPlus)
    .mount('#app')