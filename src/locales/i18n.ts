import { createI18n } from 'vue-i18n'

import messages from './langs'

const defaultLocale = localStorage.getItem('locale') || 'en'
function getCookie(name: string) {
  var arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) return unescape(arr[2])
  else {
    /* 
    navigator.language返回值：
    ["af", "sq", "ar-SA", "ar-IQ", "ar-EG", "ar-LY", "ar-DZ", "ar-MA", "ar-TN", "ar-OM",
  "ar-YE", "ar-SY", "ar-JO", "ar-LB", "ar-KW", "ar-AE", "ar-BH", "ar-QA", "eu", "bg",
    "be", "ca", "zh-TW", "zh-CN", "zh-HK", "zh-SG", "hr", "cs", "da", "nl", "nl-BE", "en",
    "en-US", "en-EG", "en-AU", "en-GB", "en-CA", "en-NZ", "en-IE", "en-ZA", "en-JM",
    "en-BZ", "en-TT", "et", "fo", "fa", "fi", "fr", "fr-BE", "fr-CA", "fr-CH", "fr-LU",
    "gd", "gd-IE", "de", "de-CH", "de-AT", "de-LU", "de-LI", "el", "he", "hi", "hu",
    "is", "id", "it", "it-CH", "ja", "ko", "lv", "lt", "mk", "mt", "no", "pl",
    "pt-BR", "pt", "rm", "ro", "ro-MO", "ru", "ru-MI", "sz", "sr", "sk", "sl", "sb",
    "es", "es-AR", "es-GT", "es-CR", "es-PA", "es-DO", "es-MX", "es-VE", "es-CO",
    "es-PE", "es-EC", "es-CL", "es-UY", "es-PY", "es-BO", "es-SV", "es-HN", "es-NI",
    "es-PR", "sx", "sv", "sv-FI", "th", "ts", "tn", "tr", "uk", "ur", "ve", "vi", "xh",
    "ji", "zu"];
    */
    var defaultValue = navigator.language

    if (defaultValue == 'zh-CN') defaultValue = 'cn'
    else {
      defaultValue = defaultValue.substring(0, 2) //截取lang前2位字符
      if (defaultValue == 'en') defaultValue = 'en'
      else if (defaultValue == 'zh') defaultValue = 'hk'
      else if (defaultValue == 'ja') defaultValue = 'jp'
      else if (defaultValue == 'fr') defaultValue = 'fr'
      else if (defaultValue == 'ru') defaultValue = 'ru'
      else if (defaultValue == 'es') defaultValue = 'es'
      else if (defaultValue == 'ko') defaultValue = 'kr'
      else defaultValue = 'en'
    }
    return defaultValue
  }
}

const i18n = new createI18n({
  locale: defaultLocale,
  fallbackLocale: 'en',
  allowComposition: true,
  messages: messages,
})

export default i18n
