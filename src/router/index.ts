import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouteRecordRaw,
} from 'vue-router'

import {
  SupportedNetworkId,
  convert2SupportedNetworkId,
  isSupportedNetwork,
} from 'contracts/types'

import { web3Config } from '@/contracts/web3'

const ErrorContainer = () => import('../views/errors/ErrorContainer.vue')
const ServerError = () => import('../views/errors/ServerError.vue')
const NotFound = () => import('../views/errors/NotFound.vue')
const ContractError = () => import('../views/errors/ContractError.vue')
const WalletError = () => import('../views/errors/WalletError.vue')
const NotSupportNetwork = () => import('../views/errors/NotSupportNetwork.vue')

const Welcome = () => import('../views/Welcome.vue')
const About = () => import('../views/About.vue')

const Search = () => import('../views/search/Search.vue')
const SearchByTLD = () => import('../views/search/SearchByTLD.vue')
const NameContainer = () => import('../views/name/NameContainer.vue')
const Register = () => import('../views/name/Register.vue')
const NameDetails = () => import('../views/name/NameDetails.vue')
const Subdomains = () => import('../views/name/Subdomains.vue')

const AddressContainer = () => import('../views/address/AddressContainer.vue')
const AddressController = () => import('../views/address/AddressController.vue')
const AddressRegistrant = () => import('../views/address/AddressRegistrant.vue')

const ManagerContainer = () => import('../views/manager/ManagerContainer.vue')

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: Welcome,
    beforeEnter: (to, from, next) => {
      next()
    },
  },

  {
    path: '/search/:searchText',
    name: 'search',
    component: Search,
    beforeEnter: (to, from, next) => {
      console.log(to)
      next()
    },
  },

  {
    path: '/search/tld/:tldText',
    name: 'searchByTLD',
    component: SearchByTLD,
    beforeEnter: (to, from, next) => {
      next()
    },
  },

  {
    path: '/name/:domainName',
    component: NameContainer,
    children: [
      {
        path: 'register',
        component: Register,
      },
      {
        path: 'details',
        component: NameDetails,
      },
      {
        path: 'subdomains',
        component: Subdomains,
      },
    ],
  },

  {
    path: '/address/:account',
    component: AddressContainer,
    children: [
      {
        path: 'registrant',
        component: AddressRegistrant,
      },
      {
        path: 'controller',
        component: AddressController,
      },
      {
        path: '',
        component: AddressRegistrant,
      },
    ],
  },

  {
    path: '/manager',
    name: 'manager',
    component: ManagerContainer,
    beforeEnter: (to, from, next) => {
      next()
    },
  },

  {
    path: '/error',
    component: ErrorContainer,
    children: [
      {
        path: 'servererror',
        component: ServerError,
      },
      {
        path: 'contracterror',
        component: ContractError,
      },
      {
        path: 'notsupportnetwork',
        name: 'notsupportnetwork',
        component: NotSupportNetwork,
      },
      {
        path: 'wallet',
        component: WalletError,
      },
    ],
  },

  {
    path: '/about',
    name: 'about',
    component: About,
    beforeEnter: (to, from, next) => {
      next()
    },
  },

  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    beforeEnter: (to, from, next) => {
      next()
    },
  },
]

const isSubdomain = function (domainName: string) {
  return domainName?.split('.').length - 1 > 1
}
/**
 * 创建路由
 */
const router = createRouter({
  // hash模式：createWebHashHistory，
  // history模式：createWebHistory
  //history: createWebHistory('/'),
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to, from) => {
  try {
    let id = await web3Config.getNetworkId()

    if (id == 0) {
      try {
        await web3Config.connect()
        id = await web3Config.getNetworkId()
      } catch (err) {}
    }

    if (to.name === 'notsupportnetwork') {
      if (isSupportedNetwork(id)) return { path: '/' }
      return true
    }

    if (!isSupportedNetwork(id)) return { path: '/error/notsupportnetwork' }
  } catch (err) {}
})

/**
 * 初始化钱包
 */
/*const InitWallet = function() {
  if (typeof web3 !== 'undefined') {
    if (web3.currentProvider.isMetaMask === true) {
      store.dispatch('setWallet', {
        value: true
      })
    } else {
      // Another web3 provider
      store.setWallet(false)
      store.setAccount(null)
    }
  } else {
    // No web 3 provider
    //  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    store.dispatch('setWallet', {
      value: false
    })
    store.dispatch('setAccount', {
      account: null
    })
  }
}*/

export default router
