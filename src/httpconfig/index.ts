import axios from 'axios'

const BASEURL = {
  //apiUrl: "https://metadata.unit.domains", //production
  apiUrl: 'http://127.0.0.1:8000', //dev
  domains: '/domains/v1/',
  price: '/price/v1/',
  reverse: '/reverse/v1/',
  search: '/search/v1/',
}

axios.defaults.timeout = 600000000 //600000s
axios.defaults.withCredentials = true

axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'

axios.defaults.baseURL = BASEURL.apiUrl

export { BASEURL, axios }
